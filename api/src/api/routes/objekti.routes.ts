import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq, count } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { objekti } from '../../db/schema.js';
import {
  paginationSchema,
  paginationParams,
  listResponseSchema,
  notFoundSchema,
  idParamSchema,
} from '../common/pagination.js';
import { HTTP_STATUS } from '../../consts.js';

import { ObjektSchema } from '../schemas/objekti.js';

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['Objekti'],
    summary: 'List old-cadastre buildings',
    request: { query: paginationSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: listResponseSchema(ObjektSchema) } },
        description: 'List of objects',
      },
    },
  }),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const { limit: lim, offset } = paginationParams({ page, limit });
    const [rows, [{ count: total }]] = await Promise.all([
      db.select().from(objekti).limit(lim).offset(offset),
      db.select({ count: count() }).from(objekti),
    ]);
    return c.json({ data: rows as any[], total: Number(total), page, limit: lim }, HTTP_STATUS.OK);
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Objekti'],
    summary: 'Get object by ID',
    request: { params: idParamSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: ObjektSchema } },
        description: 'Object',
      },
      404: {
        content: { 'application/json': { schema: notFoundSchema } },
        description: 'Not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const [row] = await db.select().from(objekti).where(eq(objekti.id, id));
    if (!row) return c.json({ error: 'Not found' }, HTTP_STATUS.NOT_FOUND);
    return c.json(row as any, 200);
  },
);

export default router;
