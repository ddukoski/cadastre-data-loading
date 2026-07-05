import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { and, gte, lte, eq, isNotNull, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { zgradi, parceli, parceliDelovi, prijavi, naseleniMesta } from '../../db/schema.js';
import {
  yearRangeQuerySchema,
  usageTypeQuerySchema,
  dateRangeQuerySchema,
  buildYearPointSchema,
  municipalityCountSchema,
  usageBreakdownSchema,
  applicationsPointSchema,
  parcelAreaBucketSchema,
} from '../schemas/stats.js';
import { HTTP_STATUS, API_TAGS } from '../../consts.js';
import { z } from '@hono/zod-openapi';

const router = new OpenAPIHono();

router.openapi(
  createRoute({
    method: 'get',
    path: '/build-years',
    tags: [API_TAGS.STATS],
    summary: 'Building counts by construction year',
    request: { query: yearRangeQuerySchema },
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(buildYearPointSchema) } },
        description: 'Building counts per year',
      },
    },
  }),
  async (c) => {
    const { yearFrom = 1950, yearTo = 2026 } = c.req.valid('query');

    const rows = await db
      .select({ year: zgradi.buildYear, count: sql<number>`count(*)` })
      .from(zgradi)
      .where(and(isNotNull(zgradi.buildYear), gte(zgradi.buildYear, yearFrom), lte(zgradi.buildYear, yearTo)))
      .groupBy(zgradi.buildYear)
      .orderBy(zgradi.buildYear);

    return c.json(
      rows.map((r) => ({ year: r.year as number, count: r.count })),
      HTTP_STATUS.OK,
    );
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/properties-by-municipality',
    tags: [API_TAGS.STATS],
    summary: 'Property counts per municipality',
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(municipalityCountSchema) } },
        description: 'Property counts per municipality',
      },
    },
  }),
  async (c) => {
    const rows = await db
      .select({ opstina: naseleniMesta.opstinaIme, count: sql<number>`count(*)` })
      .from(parceli)
      .innerJoin(zgradi, eq(zgradi.parcelId, parceli.parcelId))
      .innerJoin(naseleniMesta, eq(naseleniMesta.mestoSifra, parceli.cdpId))
      .where(isNotNull(naseleniMesta.opstinaIme))
      .groupBy(naseleniMesta.opstinaIme)
      .orderBy(sql`count(*) desc`);

    return c.json(
      rows.map((r) => ({ opstina: r.opstina as string, count: r.count })),
      HTTP_STATUS.OK,
    );
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/usage-breakdown',
    tags: [API_TAGS.STATS],
    summary: 'Parcel land usage type breakdown',
    request: { query: usageTypeQuerySchema },
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(usageBreakdownSchema) } },
        description: 'Land usage type counts',
      },
    },
  }),
  async (c) => {
    const { usageType } = c.req.valid('query');

    const rows = await db
      .select({ usageType: parceliDelovi.usageFullname, count: sql<number>`count(*)` })
      .from(parceliDelovi)
      .where(and(isNotNull(parceliDelovi.usageFullname), usageType ? eq(parceliDelovi.usageFullname, usageType) : undefined))
      .groupBy(parceliDelovi.usageFullname)
      .orderBy(sql`count(*) desc`);

    return c.json(
      rows.map((r) => ({ usageType: r.usageType as string, count: r.count })),
      HTTP_STATUS.OK,
    );
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/applications-over-time',
    tags: [API_TAGS.STATS],
    summary: 'Citizen applications submitted per month',
    request: { query: dateRangeQuerySchema },
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(applicationsPointSchema) } },
        description: 'Application counts per month',
      },
    },
  }),
  async (c) => {
    const { dateFrom = '2025-01-01', dateTo = '2026-07-01', classification } = c.req.valid('query');

    const rows = await db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${prijavi.submissionDatetime}), 'YYYY-MM')`,
        count: sql<number>`count(*)`,
      })
      .from(prijavi)
      .where(
        and(
          gte(prijavi.submissionDatetime, new Date(dateFrom)),
          lte(prijavi.submissionDatetime, new Date(dateTo)),
          classification ? eq(prijavi.classification, classification) : undefined,
        ),
      )
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    return c.json(rows, HTTP_STATUS.OK);
  },
);

router.openapi(
  createRoute({
    method: 'get',
    path: '/parcel-area-distribution',
    tags: [API_TAGS.STATS],
    summary: 'Parcel size distribution',
    request: { query: usageTypeQuerySchema },
    responses: {
      200: {
        content: { 'application/json': { schema: z.array(parcelAreaBucketSchema) } },
        description: 'Parcel counts per area bucket',
      },
    },
  }),
  async (c) => {
    const { usageType } = c.req.valid('query');

    const rows = await db
      .select({
        bucket: sql<string>`case
          when ${parceliDelovi.areaM2} < 100 then '0-100'
          when ${parceliDelovi.areaM2} < 500 then '100-500'
          when ${parceliDelovi.areaM2} < 1000 then '500-1000'
          when ${parceliDelovi.areaM2} < 5000 then '1000-5000'
          else '5000+' end`,
        count: sql<number>`count(*)`,
      })
      .from(parceliDelovi)
      .where(usageType ? eq(parceliDelovi.usageFullname, usageType) : undefined)
      .groupBy(sql`1`);

    return c.json(rows, HTTP_STATUS.OK);
  },
);

export default router;
