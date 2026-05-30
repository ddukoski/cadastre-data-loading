import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq, count } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { uliciOpstiniRef } from '../../db/schema.js';
import {
  paginationSchema,
  paginationParams,
  listResponseSchema,
  notFoundSchema,
  idParamSchema,
} from '../common/pagination.js';
import { HTTP_STATUS, API_TAGS } from '../../consts.js';
import { UlicaOpstinRefSchema } from '../schemas/ulici-opstini-ref.js';

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: [API_TAGS.ULICI_OPSTINI_REF],
    summary: 'List street-municipality reference table',
    request: { query: paginationSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: listResponseSchema(UlicaOpstinRefSchema) } },
        description: 'List of street-municipality references',
      },
    },
  }),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const { limit: lim, offset } = paginationParams({ page, limit });
    const [rows, [{ count: total }]] = await Promise.all([
      db.query.uliciOpstiniRef.findMany({ with: { naselenMesto: true }, limit: lim, offset }),
      db.select({ count: count() }).from(uliciOpstiniRef),
    ]);
    return c.json({ data: rows as any[], total: Number(total), page, limit: lim }, HTTP_STATUS.OK);
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: [API_TAGS.ULICI_OPSTINI_REF],
    summary: 'Get street-municipality reference by ID',
    request: { params: idParamSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: UlicaOpstinRefSchema } },
        description: 'Street-municipality reference',
      },
      404: {
        content: { 'application/json': { schema: notFoundSchema } },
        description: 'Not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const row = await db.query.uliciOpstiniRef.findFirst({
      where: eq(uliciOpstiniRef.id, id),
      with: { naselenMesto: true },
    });
    if (!row) return c.json({ error: 'Not found' }, HTTP_STATUS.NOT_FOUND);
    return c.json(row as any, HTTP_STATUS.OK);
  },
);

export default router;
