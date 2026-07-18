import { z } from 'zod';

const emptyParams = z.object({}).optional();
const emptyBody = z.object({}).optional();

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.coerce.number().min(0, 'Price cannot be negative'),
    discountPrice: z.coerce.number().min(0).optional(),
    categoryId: z.string().uuid('Invalid category ID'),
    isPublished: z.coerce.boolean().optional(),
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
    isPublished: z.coerce.boolean().optional(),
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