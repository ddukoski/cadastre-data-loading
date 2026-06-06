import { z } from '@hono/zod-openapi';

export const ObjektSchema = z.object({
  id: z.number().int(),
  arcgisObjectid: z.number().int().nullable(),
  globalid: z.string().nullable(),
  sifraOdd: z.number().int().nullable(),
  sifraKo: z.number().int().nullable(),
  kOddeleni: z.string().nullable(),
  kOpstina: z.string().nullable(),
  parcela: z.string().nullable(),
  parcn: z.number().int().nullable(),
  subn: z.number().int().nullable(),
  bldn: z.number().int().nullable(),
  idParc: z.string().nullable(),
  idPp: z.string().nullable(),
  mesto: z.string().nullable(),
  sifraKult: z.number().int().nullable(),
  kultura: z.string().nullable(),
  opsConcat: z.string().nullable(),
  stArea: z.number().nullable(),
  stLength: z.number().nullable(),
  geometry: z.string().nullable(),
}).openapi('Objekt');
