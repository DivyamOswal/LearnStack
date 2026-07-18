import { ApiError } from '../../utils/ApiError';
import * as lessonRepo from './lessons.repository';
import { CreateLessonInput, UpdateLessonInput } from './lessons.types';

export const addLesson = async (
  input: CreateLessonInput,
  files?: { videoUrl?: string; pdfUrl?: string }
) => {
  const chapter = await lessonRepo.findChapterById(input.chapterId);
  if (!chapter) throw new ApiError(404, 'Chapter not found.');

  const existingAtOrder = await lessonRepo.findLessonByChapterAndOrder(
    input.chapterId,
    input.order
  );
  if (existingAtOrder) {
    throw new ApiError(409, `A lesson already exists at position ${input.order} in this chapter.`);
  }

  if (input.type === 'VIDEO' && !files?.videoUrl) {
    throw new ApiError(400, 'A video file is required for VIDEO type lessons.');
  }
  if ((input.type === 'ARTICLE' || input.type === 'MARKDOWN' || input.type === 'CODE_SNIPPET') && !input.content) {
    throw new ApiError(400, `Content is required for ${input.type} type lessons.`);
  }

  return lessonRepo.createLesson(input, files);
};

export const getLessonsForChapter = async (chapterId: string) => {
  const chapter = await lessonRepo.findChapterById(chapterId);
  if (!chapter) throw new ApiError(404, 'Chapter not found.');
  return lessonRepo.findLessonsByChapter(chapterId);
};

export const getLessonDetail = async (id: string) => {
  const lesson = await lessonRepo.findLessonById(id);
  if (!lesson) throw new ApiError(404, 'Lesson not found.');
  return lesson;
};

export const editLesson = async (
  id: string,
  input: UpdateLessonInput,
  files?: { videoUrl?: string; pdfUrl?: string }
) => {
  const existing = await lessonRepo.findLessonById(id);
  if (!existing) throw new ApiError(404, 'Lesson not found.');

  if (input.order !== undefined && input.order !== existing.order) {
    const collision = await lessonRepo.findLessonByChapterAndOrder(
      existing.chapterId,
      input.order
    );
    if (collision) {
      throw new ApiError(409, `A lesson already exists at position ${input.order} in this chapter.`);
    }
  }

  return lessonRepo.updateLesson(id, input, files);
};

export const removeLesson = async (id: string) => {
  const existing = await lessonRepo.findLessonById(id);
  if (!existing) throw new ApiError(404, 'Lesson not found.');
  return lessonRepo.deleteLesson(id);
};

export const reorderLessons = async (
  chapterId: string,
  lessons: { lessonId: string; order: number }[]
) => {
  const chapter = await lessonRepo.findChapterById(chapterId);
  if (!chapter) throw new ApiError(404, 'Chapter not found.');

  try {
    await lessonRepo.reorderLessonsTx(chapterId, lessons);
  } catch (err) {
    throw new ApiError(400, err instanceof Error ? err.message : 'Failed to reorder lessons.');
  }
};