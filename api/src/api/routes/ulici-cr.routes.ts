import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq, count } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { uliciCr } from '../../db/schema.js';
import {
  paginationSchema,
  paginationParams,
  listResponseSchema,
  notFoundSchema,
  idParamSchema,
} from '../common/pagination.js';
import { HTTP_STATUS } from '../../consts.js';

import { NaselenMestoBriefSchema, UlicaCrSchema } from '../schemas/ulici-cr.js';

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Ulici CR'],
    summary: 'List CR streets',
    request: { query: paginationSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: listResponseSchema(UlicaCrSchema) } },
        description: 'List of CR streets',
      },
    },
  }),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const { limit: lim, offset } = paginationParams({ page, limit });
    const [rows, [{ count: total }]] = await Promise.all([
      db.query.uliciCr.findMany({ with: { naselenMesto: true }, limit: lim, offset }),
      db.select({ count: count() }).from(uliciCr),
    ]);
    return c.json({ data: rows as any[], total: Number(total), page, limit: lim }, HTTP_STATUS.OK);
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Ulici CR'],
    summary: 'Get CR street by ID',
    request: { params: idParamSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: UlicaCrSchema } },
        description: 'CR street',
      },
      404: {
        content: { 'application/json': { schema: notFoundSchema } },
        description: 'Not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const row = await db.query.uliciCr.findFirst({
      where: eq(uliciCr.id, id),
      with: { naselenMesto: true },
    });
    if (!row) return c.json({ error: 'Not found' }, HTTP_STATUS.NOT_FOUND);
    return c.json(row as any, 200);
  },
);

export default router;
