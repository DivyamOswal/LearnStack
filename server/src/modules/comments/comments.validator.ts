import { z } from 'zod';

const emptyParams = z.object({}).optional();
const emptyQuery = z.object({}).optional();

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(2000),
    lessonId: z.string().uuid('Invalid lesson ID'),
    parentId: z.string().uuid('Invalid parent comment ID').optional(),
  }),
  params: emptyParams,
  query: emptyQuery,
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment cannot be empty').max(2000),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: emptyQuery,
});

export const commentIdParamSchema = z.object({
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