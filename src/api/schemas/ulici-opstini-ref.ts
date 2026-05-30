import { z } from '@hono/zod-openapi';

export const NaselenMestoBriefSchema = z.object({
  id: z.number().int(),
  mestoSifra: z.string().nullable(),
  mestoIme: z.string().nullable(),
}).nullable().openapi('NaselenMestoBriefUliciOpstini');

export const UlicaOpstinRefSchema = z.object({
  id: z.number().int(),
  arcgisObjectid: z.number().int().nullable(),
  globalid: z.string().nullable(),
  ulicaIme: z.string().nullable(),
  ulicaSifraCr: z.string().nullable(),
  mestoIme: z.string().nullable(),
  mestoSifra: z.string().nullable(),
  imeNaUlicaOpstina: z.string().nullable(),
  statusOpstina: z.string().nullable(),
  naselenMesto: NaselenMestoBriefSchema,
}).openapi('UlicaOpstinRef');
