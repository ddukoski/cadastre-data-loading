import { z } from '@hono/zod-openapi';

export const ParcelBriefSchema = z.object({
  id: z.number().int(),
  parcelId: z.number().int().nullable(),
  parcelNumber: z.string().nullable(),
  cdpCcId: z.string().nullable(),
}).nullable().openapi('ParcelBriefPrijavi');

export const PrijavaSchema = z.object({
  id: z.number().int(),
  arcgisObjectid: z.number().int().nullable(),
  name: z.string().nullable(),
  surname: z.string().nullable(),
  eMail: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  submissionDatetime: z.string().nullable(),
  note: z.string().nullable(),
  fkParcel: z.number().int().nullable(),
  fkAddress: z.number().int().nullable(),
  streetName: z.string().nullable(),
  houseNumber: z.number().int().nullable(),
  letter: z.string().nullable(),
  entrance: z.string().nullable(),
  classification: z.string().nullable(),
  parcel: ParcelBriefSchema,
}).openapi('Prijava');
