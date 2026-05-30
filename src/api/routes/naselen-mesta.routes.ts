import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq, count } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { naseleniMesta } from '../../db/schema.js';
import {
  paginationSchema,
  paginationParams,
  listResponseSchema,
  notFoundSchema,
  idParamSchema,
} from '../common/pagination.js';

import { OpstinaBriefSchema, NaselenMestoSchema } from '../schemas/naseleni-mesta.js';
import { HTTP_STATUS, API_TAGS } from '../../consts.js';

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: [API_TAGS.NASELENI_MESTA],
    summary: 'List settlements',
    request: { query: paginationSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: listResponseSchema(NaselenMestoSchema) } },
        description: 'List of settlements',
      },
    },
  }),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const { limit: lim, offset } = paginationParams({ page, limit });
    const [rows, [{ count: total }]] = await Promise.all([
      db.query.naseleniMesta.findMany({ with: { opstina: true }, limit: lim, offset }),
      db.select({ count: count() }).from(naseleniMesta),
    ]);
    return c.json({ data: rows as any[], total: Number(total), page, limit: lim }, HTTP_STATUS.OK);
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: [API_TAGS.NASELENI_MESTA],
    summary: 'Get settlement by ID',
    request: { params: idParamSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: NaselenMestoSchema } },
        description: 'Settlement',
      },
      404: {
        content: { 'application/json': { schema: notFoundSchema } },
        description: 'Not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const row = await db.query.naseleniMesta.findFirst({
      where: eq(naseleniMesta.id, id),
      with: { opstina: true },
    });
    if (!row) return c.json({ error: 'Not found' }, HTTP_STATUS.NOT_FOUND);
    return c.json(row as any, HTTP_STATUS.OK);
  },
);

export default router;
