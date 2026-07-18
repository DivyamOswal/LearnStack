import { z } from 'zod';

const emptyParams = z.object({}).optional();
const emptyQuery = z.object({}).optional();

export const createChapterSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(200),
    order: z.coerce.number().int().min(1, 'Order must be a positive integer'),
    courseId: z.string().uuid('Invalid course ID'),
  }),
  params: emptyParams,
  query: emptyQuery,
});

export const updateChapterSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    order: z.coerce.number().int().min(1).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: emptyQuery,
});

export const chapterIdParamSchema = z.object({
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

export const reorderChaptersSchema = z.object({
  body: z.object({
    chapters: z
      .array(
        z.object({
          chapterId: z.string().uuid(),
          order: z.number().int().min(1),
        })
      )
      .min(1, 'At least one chapter is required to reorder'),
  }),
  params: z.object({
    courseId: z.string().uuid(),
  }),
  query: emptyQuery,
});