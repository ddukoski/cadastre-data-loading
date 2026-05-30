import { z } from '@hono/zod-openapi';

export const NaselenMestoBriefSchema = z.object({
  id: z.number().int(),
  mestoSifra: z.string().nullable(),
  mestoIme: z.string().nullable(),
}).nullable().openapi('NaselenMestoBrief');

export const UlicaCrSchema = z.object({
  id: z.number().int(),
  arcgisObjectid: z.number().int().nullable(),
  globalid: z.string().nullable(),
  ulicaIme: z.string().nullable(),
  ulicaSifraCr: z.string().nullable(),
  ioTip: z.string().nullable(),
  mestoIme: z.string().nullable(),
  mestoSifra: z.string().nullable(),
  objectCode: z.string().nullable(),
  flagCr: z.number().int().nullable(),
  flagForDelete: z.number().int().nullable(),
  naselenMesto: NaselenMestoBriefSchema,
}).openapi('UlicaCr');
