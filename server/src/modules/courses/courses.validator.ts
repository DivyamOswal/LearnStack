import { z } from 'zod';

const emptyParams = z.object({}).optional();
const emptyBody = z.object({}).optional();

// "false" is a non-empty string, and Boolean("false") === true in JS —
// z.coerce.boolean() would incorrectly treat it as true. This transform
// explicitly checks the string value instead of relying on JS truthiness.
const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((val) => (typeof val === 'string' ? val === 'true' : val))
  .optional();

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.coerce.number().min(0, 'Price cannot be negative'),
    discountPrice: z.coerce.number().min(0).optional(),
    categoryId: z.string().uuid('Invalid category ID'),
    isPublished: booleanFromString,
  }),
  params: emptyParams,
  query: emptyParams,
});

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(20).optional(),
    price: z.coerce.number().min(0).optional(),
    discountPrice: z.coerce.number().min(0).optional(),
    categoryId: z.string().uuid().optional(),
    isPublished: booleanFromString,
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: emptyParams,
});

export const courseIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: emptyBody,
  query: emptyParams,
});

export const courseSlugParamSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
  body: emptyBody,
  query: emptyParams,
});

export const listCoursesSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    isPublished: z.string().optional(),
  }),
  params: emptyParams,
  body: emptyBody,
});

export const searchQuerySchema = z.object({
  query: z.object({
    q: z.string().optional(),
  }),
  params: z.object({}).optional(),
  body: z.object({}).optional(),
});