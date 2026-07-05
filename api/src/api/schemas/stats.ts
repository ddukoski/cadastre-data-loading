import { z } from '@hono/zod-openapi';
import { USAGE_TYPES, CLASSIFICATIONS } from '../../../../shared/cadastre-options.js';

export const yearRangeQuerySchema = z.object({
  yearFrom: z.coerce.number().int().optional().openapi({ example: 1960 }),
  yearTo: z.coerce.number().int().optional().openapi({ example: 2026 }),
});

export const usageTypeQuerySchema = z.object({
  usageType: z.enum(USAGE_TYPES).optional().openapi({ example: 'Residential' }),
});

export const dateRangeQuerySchema = z.object({
  dateFrom: z.string().optional().openapi({ example: '2025-01-01' }),
  dateTo: z.string().optional().openapi({ example: '2026-07-05' }),
  classification: z.enum(CLASSIFICATIONS).optional().openapi({ example: 'Ownership transfer' }),
});

export const buildYearPointSchema = z.object({
  year: z.number().int().openapi({ example: 1985 }),
  count: z.number().int().openapi({ example: 214 }),
});

export const municipalityCountSchema = z.object({
  opstina: z.string().openapi({ example: 'Karpos' }),
  count: z.number().int().openapi({ example: 4213 }),
});

export const usageBreakdownSchema = z.object({
  usageType: z.string().openapi({ example: 'Residential' }),
  count: z.number().int().openapi({ example: 8931 }),
});

export const applicationsPointSchema = z.object({
  month: z.string().openapi({ example: '2026-06' }),
  count: z.number().int().openapi({ example: 132 }),
});

export const parcelAreaBucketSchema = z.object({
  bucket: z.string().openapi({ example: '100-500' }),
  count: z.number().int().openapi({ example: 1876 }),
});
