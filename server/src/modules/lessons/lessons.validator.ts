import { z } from 'zod';
import { LessonType } from '@prisma/client';

const emptyParams = z.object({}).optional();
const emptyQuery = z.object({}).optional();

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200),
    type: z.nativeEnum(LessonType),
    order: z.coerce.number().int().min(1, 'Order must be a positive integer'),
    chapterId: z.string().uuid('Invalid chapter ID'),
    content: z.string().optional(),
  }),
  params: emptyParams,
  query: emptyQuery,
});

export const updateLessonSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    type: z.nativeEnum(LessonType).optional(),
    order: z.coerce.number().int().min(1).optional(),
    content: z.string().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: emptyQuery,
});

export const lessonIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const chapterIdParamSchema = z.object({
  params: z.object({
    chapterId: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const reorderLessonsSchema = z.object({
  body: z.object({
    lessons: z
      .array(
        z.object({
          lessonId: z.string().uuid(),
          order: z.number().int().min(1),
        })
      )
      .min(1, 'At least one lesson is required to reorder'),
  }),
  params: z.object({
    chapterId: z.string().uuid(),
  }),
  query: emptyQuery,
});