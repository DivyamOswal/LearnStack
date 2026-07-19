import { z } from 'zod';

const emptyParams = z.object({}).optional();
const emptyQuery = z.object({}).optional();

export const createTopicSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(200),
    content: z.string().min(5, 'Content must be at least 5 characters'),
    order: z.coerce.number().int().min(1, 'Order must be a positive integer'),
    lessonId: z.string().uuid('Invalid lesson ID'),
  }),
  params: emptyParams,
  query: emptyQuery,
});

export const updateTopicSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    content: z.string().min(5).optional(),
    order: z.coerce.number().int().min(1).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: emptyQuery,
});

export const topicIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const lessonIdParamSchema = z.object({
  params: z.object({
    lessonId: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});