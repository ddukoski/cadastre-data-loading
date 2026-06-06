import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq, count } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { parceliDelovi } from '../../db/schema.js';
import {
  paginationSchema,
  paginationParams,
  listResponseSchema,
  notFoundSchema,
  idParamSchema,
} from '../common/pagination.js';
import { HTTP_STATUS } from '../../consts.js';

import { ParcelBriefSchema, ParcelDelSchema } from '../schemas/parceli-delovi.js';

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Parceli Delovi'],
    summary: 'List parcel parts',
    request: { query: paginationSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: listResponseSchema(ParcelDelSchema) } },
        description: 'List of parcel parts',
      },
    },
  }),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const { limit: lim, offset } = paginationParams({ page, limit });
    const [rows, [{ count: total }]] = await Promise.all([
      db.query.parceliDelovi.findMany({ with: { parcel: true }, limit: lim, offset }),
      db.select({ count: count() }).from(parceliDelovi),
    ]);
    return c.json({ data: rows as any[], total: Number(total), page, limit: lim }, HTTP_STATUS.OK);
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Parceli Delovi'],
    summary: 'Get parcel part by ID',
    request: { params: idParamSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: ParcelDelSchema } },
        description: 'Parcel part',
      },
      404: {
        content: { 'application/json': { schema: notFoundSchema } },
        description: 'Not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const row = await db.query.parceliDelovi.findFirst({
      where: eq(parceliDelovi.id, id),
      with: { parcel: true },
    });
    if (!row) return c.json({ error: 'Not found' }, HTTP_STATUS.NOT_FOUND);
    return c.json(row as any, 200);
  },
);

export default router;
