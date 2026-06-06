import { z } from '@hono/zod-openapi';

export const AddressBriefSchema = z.object({
  id: z.number().int(),
  globalid: z.string().nullable(),
  imeNaUlica: z.string().nullable(),
  kukenBroj: z.number().int().nullable(),
  dodatokNaKukenBroj: z.string().nullable(),
}).nullable().openapi('AddressBrief');

export const NaselenMestoBriefSchema = z.object({
  id: z.number().int(),
  mestoSifra: z.string().nullable(),
  mestoIme: z.string().nullable(),
}).nullable().openapi('NaselenMestoBriefStanovi');

export const StanSchema = z.object({
  id: z.number().int(),
  arcgisObjectid: z.number().int().nullable(),
  globalid: z.string().nullable(),
  globalidAddresses: z.string().nullable(),
  idVlez: z.number().int().nullable(),
  kat: z.number().int().nullable(),
  vidNaKat: z.string().nullable(),
  tipNaKat: z.string().nullable(),
  brojNaKat: z.string().nullable(),
  brojNaStan: z.string().nullable(),
  statusStan: z.string().nullable(),
  validniStanovi: z.string().nullable(),
  infoZaStanLokal: z.string().nullable(),
  nacinNaSobiranje: z.string().nullable(),
  mestoSifra: z.string().nullable(),
  interenStatus: z.string().nullable(),
  zabeleskaodkontrola: z.string().nullable(),
  zabeleskaOdOpstini: z.string().nullable(),
  zabeleskaOpstiniTeks: z.string().nullable(),
  address: AddressBriefSchema,
  naselenMesto: NaselenMestoBriefSchema,
}).openapi('Stan');
