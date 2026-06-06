import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq, count } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { parceli } from '../../db/schema.js';
import {
  paginationSchema,
  paginationParams,
  listResponseSchema,
  notFoundSchema,
  idParamSchema,
} from '../common/pagination.js';
import { HTTP_STATUS } from '../../consts.js';

import { ParcelaSchema } from '../schemas/parceli.js';

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Parceli'],
    summary: 'List cadastral parcels',
    request: { query: paginationSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: listResponseSchema(ParcelaSchema) } },
        description: 'List of parcels',
      },
    },
  }),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const { limit: lim, offset } = paginationParams({ page, limit });
    const [rows, [{ count: total }]] = await Promise.all([
      db.select().from(parceli).limit(lim).offset(offset),
      db.select({ count: count() }).from(parceli),
    ]);
    return c.json({ data: rows as any[], total: Number(total), page, limit: lim }, HTTP_STATUS.OK);
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Parceli'],
    summary: 'Get parcel by ID',
    request: { params: idParamSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: ParcelaSchema } },
        description: 'Parcel',
      },
      404: {
        content: { 'application/json': { schema: notFoundSchema } },
        description: 'Not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const [row] = await db.select().from(parceli).where(eq(parceli.id, id));
    if (!row) return c.json({ error: 'Not found' }, HTTP_STATUS.NOT_FOUND);
    return c.json(row as any, 200);
  },
);

export default router;
