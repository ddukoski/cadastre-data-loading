import { z } from '@hono/zod-openapi';

export const NaselenMestoBriefSchema = z.object({
  id: z.number().int(),
  mestoSifra: z.string().nullable(),
  mestoIme: z.string().nullable(),
}).nullable().openapi('NaselenMestoBriefKorisnici');

export const KorisnikSchema = z.object({
  id: z.number().int(),
  arcgisObjectid: z.number().int().nullable(),
  globalid: z.string().nullable(),
  username: z.string(),
  nasMestoId: z.string().nullable(),
  nasMestoIme: z.string().nullable(),
  opstinaIme: z.string().nullable(),
  naselenMesto: NaselenMestoBriefSchema,
}).openapi('Korisnik');
