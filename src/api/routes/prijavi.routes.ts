import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq, count } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { prijavi } from '../../db/schema.js';
import {
  paginationSchema,
  paginationParams,
  listResponseSchema,
  notFoundSchema,
  idParamSchema,
} from '../common/pagination.js';
import { HTTP_STATUS, API_TAGS } from '../../consts.js';
import { PrijavaSchema } from '../schemas/prijavi.js';

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: [API_TAGS.PRIJAVI],
    summary: 'List public submissions',
    request: { query: paginationSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: listResponseSchema(PrijavaSchema) } },
        description: 'List of submissions',
      },
    },
  }),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const { limit: lim, offset } = paginationParams({ page, limit });
    const [rows, [{ count: total }]] = await Promise.all([
      db.query.prijavi.findMany({ with: { parcel: true }, limit: lim, offset }),
      db.select({ count: count() }).from(prijavi),
    ]);
    return c.json({ data: rows as any[], total: Number(total), page, limit: lim }, HTTP_STATUS.OK);
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: [API_TAGS.PRIJAVI],
    summary: 'Get submission by ID',
    request: { params: idParamSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: PrijavaSchema } },
        description: 'Submission',
      },
      404: {
        content: { 'application/json': { schema: notFoundSchema } },
        description: 'Not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const row = await db.query.prijavi.findFirst({
      where: eq(prijavi.id, id),
      with: { parcel: true },
    });
    if (!row) return c.json({ error: 'Not found' }, HTTP_STATUS.NOT_FOUND);
    return c.json(row as any, HTTP_STATUS.OK);
  },
);

export default router;
