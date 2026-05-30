import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq, count } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { opstini } from '../../db/schema.js';
import {
  paginationSchema,
  paginationParams,
  listResponseSchema,
  notFoundSchema,
  idParamSchema,
} from '../common/pagination.js';

import { OpstinSchema } from '../schemas/opstini.js';
import { HTTP_STATUS, API_TAGS } from '../../consts.js';

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: [API_TAGS.OPSTINI],
    summary: 'List municipalities',
    request: { query: paginationSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: listResponseSchema(OpstinSchema) } },
        description: 'List of municipalities',
      },
    },
  }),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const { limit: lim, offset } = paginationParams({ page, limit });
    const [rows, [{ count: total }]] = await Promise.all([
      db.select().from(opstini).limit(lim).offset(offset),
      db.select({ count: count() }).from(opstini),
    ]);
    return c.json({ data: rows as any[], total: Number(total), page, limit: lim }, HTTP_STATUS.OK);
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: [API_TAGS.OPSTINI],
    summary: 'Get municipality by ID',
    request: { params: idParamSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: OpstinSchema } },
        description: 'Municipality',
      },
      404: {
        content: { 'application/json': { schema: notFoundSchema } },
        description: 'Not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const [row] = await db.select().from(opstini).where(eq(opstini.id, id));
    if (!row) return c.json({ error: 'Not found' }, HTTP_STATUS.NOT_FOUND);
    return c.json(row as any, HTTP_STATUS.OK);
  },
);

export default router;
