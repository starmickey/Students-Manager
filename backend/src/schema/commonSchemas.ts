import { z } from 'zod';

export const paginationSchema = z
  .object({
    page: z
      .string()
      .regex(/^\d+$/, { message: 'Page must be a valid integer string' })
      .transform(Number)
      .refine(val => val >= 1, { message: 'Page must be at least 1' })
      .default('1'),

    pageSize: z
      .string()
      .regex(/^\d+$/, { message: 'Page size must be a valid integer string' })
      .transform(Number)
      .refine(val => val >= 1, { message: 'Page size must be at least 1' })
      .optional(),
      // .default('10'),

    sort: z.string().optional(),
    sortOrder: z
      .enum(['asc', 'desc'], {
        message: 'Sortorder must be one of this: "asc" or "desc"',
      })
      .optional(),
  })
  .transform(({ sort, sortOrder, ...rest }) => ({
    ...rest,
    sort: sort ? { [sort]: sortOrder ?? 'asc' } : undefined,
  }));
