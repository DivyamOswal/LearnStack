import { z } from 'zod';

const emptyParams = z.object({}).optional();
const emptyQuery = z.object({}).optional();

export const createReviewSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('Invalid course ID'),
    rating: z.coerce.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    comment: z.string().max(1000).optional(),
  }),
  params: emptyParams,
  query: emptyQuery,
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5).optional(),
    comment: z.string().max(1000).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: emptyQuery,
});

export const reviewIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const courseIdParamSchema = z.object({
  params: z.object({
    courseId: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const listReviewsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
  params: z.object({
    courseId: z.string().uuid(),
  }),
  body: z.object({}).optional(),
});