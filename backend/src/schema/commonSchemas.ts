import { z } from 'zod';

/**
 * paginationSchema
 * 
 * A Zod schema to validate and transform query parameters for pagination and sorting.
 * 
 * Fields:
 *  - page: (string) Required, must be a string representing a positive integer >= 1.
 *          Transformed to a number. Default is '1'.
 * 
 *  - pageSize: (string, optional) If provided, must be a string representing a positive integer >= 1.
 *              Transformed to a number. Optional, no default currently set.
 * 
 *  - sort: (string, optional) The field name to sort by.
 * 
 *  - sortOrder: (enum 'asc' | 'desc', optional) Sort order direction.
 *               Defaults to 'asc' if sort is provided but sortOrder is not.
 * 
 * Transformation:
 *  - Converts 'page' and 'pageSize' strings to numbers.
 *  - If 'sort' is provided, transforms into an object like { [sort]: sortOrder }.
 *  - Otherwise, 'sort' will be undefined.
 * 
 * Usage:
 *  - Validates and parses query parameters to enforce correct pagination and sorting values.
 *  - Helps prevent invalid or malicious input.
 */
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
