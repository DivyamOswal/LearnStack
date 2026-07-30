import { z } from 'zod';

const emptyParams = z.object({}).optional();
const emptyQuery = z.object({}).optional();

// "false" is a non-empty string Boolean("false") === true in JS, so
// z.coerce.boolean() would wrongly treat it as true. Explicit string check instead.
const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((val) => (typeof val === 'string' ? val === 'true' : val))
  .optional();

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    isPublished: booleanFromString,
  }),
  params: emptyParams,
  query: emptyQuery,
});

export const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    content: z.string().min(10).optional(),
    isPublished: booleanFromString,
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: emptyQuery,
});

export const blogIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const blogSlugParamSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const listBlogsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
  }),
  params: emptyParams,
  body: z.object({}).optional(),
});