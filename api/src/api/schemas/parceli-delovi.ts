import { z } from '@hono/zod-openapi';

export const ParcelBriefSchema = z.object({
  id: z.number().int(),
  parcelId: z.number().int().nullable(),
  parcelNumber: z.string().nullable(),
  cdpCcId: z.string().nullable(),
}).nullable().openapi('ParcelBriefDelovi');

export const ParcelDelSchema = z.object({
  id: z.number().int(),
  arcgisObjectid: z.number().int().nullable(),
  parcelId: z.number().int().nullable(),
  parcelpartId: z.number().int().nullable(),
  cdpCcId: z.string().nullable(),   
  cdpId: z.number().int().nullable(),
  ccId: z.number().int().nullable(),
  parcelNumber: z.string().nullable(),
  buildingNumber: z.number().int().nullable(),
  propertyListNumber: z.number().int().nullable(),
  calledPlaceName: z.string().nullable(),
  map: z.number().int().nullable(),
  sketch: z.number().int().nullable(),
  usageCode: z.number().int().nullable(),
  usageCode1: z.number().int().nullable(),
  usageShortname: z.string().nullable(),
  usageFullname: z.string().nullable(),
  classId: z.number().int().nullable(),
  areaM2: z.number().nullable(),
  usageRightId: z.number().int().nullable(),
  propertyRightId: z.number().int().nullable(),
  changesbookNumber: z.number().int().nullable(),
  changeDate: z.string().nullable(),
  hashdiff: z.string().nullable(),
  shapeLength: z.number().nullable(),
  shapeArea: z.number().nullable(),
  geometry: z.string().nullable(),
  parcel: ParcelBriefSchema,
}).openapi('ParcelDel');
