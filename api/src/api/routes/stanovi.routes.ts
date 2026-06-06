import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq, count } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { stanovi } from '../../db/schema.js';
import {
  paginationSchema,
  paginationParams,
  listResponseSchema,
  notFoundSchema,
  idParamSchema,
} from '../common/pagination.js';
import { HTTP_STATUS } from '../../consts.js';

import { AddressBriefSchema, NaselenMestoBriefSchema, StanSchema } from '../schemas/stanovi.js';

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Stanovi'],
    summary: 'List apartments',
    request: { query: paginationSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: listResponseSchema(StanSchema) } },
        description: 'List of apartments',
      },
    },
  }),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const { limit: lim, offset } = paginationParams({ page, limit });
    const [rows, [{ count: total }]] = await Promise.all([
      db.query.stanovi.findMany({
        with: { address: true, naselenMesto: true },
        limit: lim,
        offset,
      }),
      db.select({ count: count() }).from(stanovi),
    ]);
    return c.json({ data: rows as any[], total: Number(total), page, limit: lim }, HTTP_STATUS.OK);
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Stanovi'],
    summary: 'Get apartment by ID',
    request: { params: idParamSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: StanSchema } },
        description: 'Apartment',
      },
      404: {
        content: { 'application/json': { schema: notFoundSchema } },
        description: 'Not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const row = await db.query.stanovi.findFirst({
      where: eq(stanovi.id, id),
      with: { address: true, naselenMesto: true },
    });
    if (!row) return c.json({ error: 'Not found' }, HTTP_STATUS.NOT_FOUND);
    return c.json(row as any, 200);
  },
);

export default router;
