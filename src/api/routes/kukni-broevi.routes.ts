import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq, count } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { kukniBoevi } from '../../db/schema.js';
import {
  paginationSchema,
  paginationParams,
  listResponseSchema,
  notFoundSchema,
  idParamSchema,
} from '../common/pagination.js';
import { HTTP_STATUS } from '../../consts.js';

import { KukenBrojSchema } from '../schemas/kukni-broevi.js';

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Kukni Broevi'],
    summary: 'List house numbers (addresses)',
    request: { query: paginationSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: listResponseSchema(KukenBrojSchema) } },
        description: 'List of house numbers',
      },
    },
  }),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const { limit: lim, offset } = paginationParams({ page, limit });
    const [rows, [{ count: total }]] = await Promise.all([
      db.query.kukniBoevi.findMany({
        with: { naselenMesto: true, parcel: true },
        limit: lim,
        offset,
      }),
      db.select({ count: count() }).from(kukniBoevi),
    ]);
    return c.json({ data: rows as any[], total: Number(total), page, limit: lim }, HTTP_STATUS.OK);
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Kukni Broevi'],
    summary: 'Get house number by ID',
    request: { params: idParamSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: KukenBrojSchema } },
        description: 'House number',
      },
      404: {
        content: { 'application/json': { schema: notFoundSchema } },
        description: 'Not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const row = await db.query.kukniBoevi.findFirst({
      where: eq(kukniBoevi.id, id),
      with: { naselenMesto: true, parcel: true },
    });
    if (!row) return c.json({ error: 'Not found' }, HTTP_STATUS.NOT_FOUND);
    return c.json(row as any, 200);
  },
);

export default router;
