import { z } from '@hono/zod-openapi';

export const ParcelaSchema = z.object({
  id: z.number().int(),
  arcgisObjectid: z.number().int().nullable(),
  parcelId: z.number().int().nullable(),
  cdpCcId: z.string().nullable(),
  cdpId: z.string().nullable(),
  ccId: z.string().nullable(),
  parcelNumber: z.string().nullable(),
  propertyListNumber: z.number().int().nullable(),
  calledPlaceName: z.string().nullable(),
  ccNameLat: z.string().nullable(),
  ccNameMk: z.string().nullable(),
  cdpNameLat: z.string().nullable(),
  cdpNameMk: z.string().nullable(),
  shapeLength: z.number().nullable(),
  shapeArea: z.number().nullable(),
  geometry: z.string().nullable(),
}).openapi('Parcela');
