import { z } from 'zod';

const emptyParams = z.object({}).optional();
const emptyQuery = z.object({}).optional();

export const markLessonCompleteSchema = z.object({
  body: z.object({
    lessonId: z.string().uuid('Invalid lesson ID'),
  }),
  params: emptyParams,
  query: emptyQuery,
});

export const courseIdParamSchema = z.object({
  params: z.object({
    courseId: z.string().uuid('Invalid course ID'),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const lessonIdParamSchema = z.object({
  params: z.object({
    lessonId: z.string().uuid('Invalid lesson ID'),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});