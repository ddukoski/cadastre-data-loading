import { z } from '@hono/zod-openapi';

export const LogAktivnostSchema = z.object({
  id: z.number().int(),
  arcgisObjectid: z.number().int().nullable(),
  globalid: z.string().nullable(),
  username: z.string().nullable(),
  editedFc: z.string().nullable(),
  objectId: z.string().nullable(),
  operationType: z.string().nullable(),
  dateTime: z.string().nullable(),
}).openapi('LogAktivnost');
