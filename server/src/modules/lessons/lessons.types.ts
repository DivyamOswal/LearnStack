import { LessonType } from '@prisma/client';

export interface CreateLessonInput {
  title: string;
  type: LessonType;
  order: number;
  chapterId: string;
  content?: string; // for ARTICLE / MARKDOWN / CODE_SNIPPET
}

export interface UpdateLessonInput {
  title?: string;
  type?: LessonType;
  order?: number;
  content?: string;
}

export interface ReorderLessonsInput {
  lessonId: string;
  order: number;
}