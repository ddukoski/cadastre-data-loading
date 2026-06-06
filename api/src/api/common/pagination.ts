import { z } from '@hono/zod-openapi';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
  limit: z.coerce.number().int().min(1).max(500).default(50).openapi({ example: 50 }),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export function paginationParams(input: PaginationInput) {
  return {
    limit: input.limit,
    offset: (input.page - 1) * input.limit,
  };
}

export function listResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    total: z.number().int().openapi({ example: 100 }),
    page: z.number().int().openapi({ example: 1 }),
    limit: z.number().int().openapi({ example: 50 }),
  });
}

export const notFoundSchema = z.object({ error: z.string().openapi({ example: 'Not found' }) });
export const idParamSchema = z.object({ id: z.coerce.number().int().openapi({ example: 1 }) });
