
import { z } from '@hono/zod-openapi';

export const NaselenMestoBriefSchema = z.object({
  id: z.number().int(),
  mestoSifra: z.string().nullable(),
  mestoIme: z.string().nullable(),
}).nullable().openapi('NaselenMestoBriefUlici');

export const UlicaSchema = z.object({
  id: z.number().int(),
  arcgisObjectid: z.number().int().nullable(),
  globalid: z.string().nullable(),
  globalidOld: z.string().nullable(),
  idUlica: z.string().nullable(),
  imeNaUlica: z.string().nullable(),
  imeNovaUlica: z.string().nullable(),
  imeNaUlicaAl: z.string().nullable(),
  imeNaUlicaEn: z.string().nullable(),
  uliciCrFk: z.string().nullable(),
  tabla: z.string().nullable(),
  status: z.string().nullable(),
  statusUlica: z.string().nullable(),
  nevalidniUlici: z.string().nullable(),
  nacinNaSobiranje: z.string().nullable(),
  interenStatus: z.string().nullable(),
  tehnickiBroj: z.string().nullable(),
  imeNaUlicaOpstina: z.string().nullable(),
  statusOpstina: z.string().nullable(),
  promeneta_grafika: z.string().nullable(),
  mestoSifra: z.string().nullable(),
  zabeleskaodkontrola: z.string().nullable(),
  zabeleskaOdOpstini: z.string().nullable(),
  zabeleskaOpstiniTeks: z.string().nullable(),
  stLength: z.number().nullable(),
  geometry: z.string().nullable(),
  naselenMesto: NaselenMestoBriefSchema,
}).openapi('Ulica');
