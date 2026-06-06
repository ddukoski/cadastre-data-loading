import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq, count } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { korisnici } from '../../db/schema.js';
import {
  paginationSchema,
  paginationParams,
  listResponseSchema,
  notFoundSchema,
  idParamSchema,
} from '../common/pagination.js';
import { HTTP_STATUS, API_TAGS } from '../../consts.js';
import { KorisnikSchema } from '../schemas/korisnici.js';

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: [API_TAGS.KORISNICI],
    summary: 'List users',
    request: { query: paginationSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: listResponseSchema(KorisnikSchema) } },
        description: 'List of users',
      },
    },
  }),
  async (c) => {
    const { page, limit } = c.req.valid('query');
    const { limit: lim, offset } = paginationParams({ page, limit });
    const [rows, [{ count: total }]] = await Promise.all([
      db.query.korisnici.findMany({ with: { naselenMesto: true }, limit: lim, offset }),
      db.select({ count: count() }).from(korisnici),
    ]);
    return c.json({ data: rows as any[], total: Number(total), page, limit: lim }, HTTP_STATUS.OK);
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    tags: [API_TAGS.KORISNICI],
    summary: 'Get user by ID',
    request: { params: idParamSchema },
    responses: {
      200: {
        content: { 'application/json': { schema: KorisnikSchema } },
        description: 'User',
      },
      404: {
        content: { 'application/json': { schema: notFoundSchema } },
        description: 'Not found',
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid('param');
    const row = await db.query.korisnici.findFirst({
      where: eq(korisnici.id, id),
      with: { naselenMesto: true },
    });
    if (!row) return c.json({ error: 'Not found' }, HTTP_STATUS.NOT_FOUND);
    return c.json(row as any, HTTP_STATUS.OK);
  },
);

export default router;
