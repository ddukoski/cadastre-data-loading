import { z } from '@hono/zod-openapi';

export const OpstinSchema = z.object({
  id: z.number().int(),
  arcgisObjectid: z.number().int().nullable(),
  globalid: z.string().nullable(),
  numericId: z.number().int().nullable(),
  name: z.string().nullable(),
  nameMk: z.string().nullable(),
  maticenbro: z.string().nullable(),
  codeTu: z.string().nullable(),
  shapeLeng: z.number().nullable(),
  shapeArea: z.number().nullable(),
  geometry: z.string().nullable(),
}).openapi('Opstina');
