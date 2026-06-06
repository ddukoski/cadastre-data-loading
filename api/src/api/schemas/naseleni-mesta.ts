import { z } from '@hono/zod-openapi';

export const OpstinaBriefSchema = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  nameMk: z.string().nullable(),
  codeTu: z.string().nullable(),
}).nullable().openapi('OpstinaBrief');

export const NaselenMestoSchema = z.object({
  id: z.number().int(),
  arcgisObjectid: z.number().int().nullable(),
  globalid: z.string().nullable(),
  mestoUid: z.string().nullable(),
  mestoSifra: z.string().nullable(),
  mestoIme: z.string().nullable(),
  opstinaSifra: z.string().nullable(),
  opstinaIme: z.string().nullable(),
  stArea: z.number().nullable(),
  stLength: z.number().nullable(),
  rawAttributes: z.string().nullable(),
  geometry: z.string().nullable(),
  opstina: OpstinaBriefSchema,
}).openapi('NaselenMesto');
