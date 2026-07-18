import { ApiError } from '../../utils/ApiError';
import * as chapterRepo from './chapters.repository';
import { CreateChapterInput, UpdateChapterInput } from './chapters.types';

export const addChapter = async (input: CreateChapterInput) => {
  const course = await chapterRepo.findCourseById(input.courseId);
  if (!course) throw new ApiError(404, 'Course not found.');

  const existingAtOrder = await chapterRepo.findChapterByCourseAndOrder(
    input.courseId,
    input.order
  );
  if (existingAtOrder) {
    throw new ApiError(409, `A chapter already exists at position ${input.order} in this course.`);
  }

  return chapterRepo.createChapter(input);
};

export const getChaptersForCourse = async (courseId: string) => {
  const course = await chapterRepo.findCourseById(courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  return chapterRepo.findChaptersByCourse(courseId);
};

export const getChapterDetail = async (id: string) => {
  const chapter = await chapterRepo.findChapterById(id);
  if (!chapter) throw new ApiError(404, 'Chapter not found.');
  return chapter;
};

export const editChapter = async (id: string, input: UpdateChapterInput) => {
  const existing = await chapterRepo.findChapterById(id);
  if (!existing) throw new ApiError(404, 'Chapter not found.');

  if (input.order !== undefined && input.order !== existing.order) {
    const collision = await chapterRepo.findChapterByCourseAndOrder(
      existing.courseId,
      input.order
    );
    if (collision) {
      throw new ApiError(409, `A chapter already exists at position ${input.order} in this course.`);
    }
  }

  return chapterRepo.updateChapter(id, input);
};

export const removeChapter = async (id: string) => {
  const existing = await chapterRepo.findChapterById(id);
  if (!existing) throw new ApiError(404, 'Chapter not found.');
  return chapterRepo.deleteChapter(id);
};

export const reorderChapters = async (
  courseId: string,
  chapters: { chapterId: string; order: number }[]
) => {
  const course = await chapterRepo.findCourseById(courseId);
  if (!course) throw new ApiError(404, 'Course not found.');

  try {
    await chapterRepo.reorderChaptersTx(courseId, chapters);
  } catch (err) {
    throw new ApiError(400, err instanceof Error ? err.message : 'Failed to reorder chapters.');
  }
};