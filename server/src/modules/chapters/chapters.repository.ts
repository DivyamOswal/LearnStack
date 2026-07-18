import prisma from '../../config/db';
import { CreateChapterInput, UpdateChapterInput } from './chapters.types';

export const findCourseById = (courseId: string) => {
  return prisma.course.findUnique({ where: { id: courseId } });
};

export const createChapter = (input: CreateChapterInput) => {
  return prisma.chapter.create({
    data: {
      title: input.title,
      order: input.order,
      courseId: input.courseId,
    },
  });
};

export const findChaptersByCourse = (courseId: string) => {
  return prisma.chapter.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        select: { id: true, title: true, type: true, order: true },
      },
    },
  });
};

export const findChapterById = (id: string) => {
  return prisma.chapter.findUnique({
    where: { id },
    include: {
      lessons: { orderBy: { order: 'asc' } },
    },
  });
};

export const findChapterByCourseAndOrder = (courseId: string, order: number) => {
  return prisma.chapter.findUnique({
    where: { courseId_order: { courseId, order } },
  });
};

export const updateChapter = (id: string, input: UpdateChapterInput) => {
  return prisma.chapter.update({
    where: { id },
    data: {
      ...(input.title ? { title: input.title } : {}),
      ...(input.order !== undefined ? { order: input.order } : {}),
    },
  });
};

export const deleteChapter = (id: string) => {
  return prisma.chapter.delete({ where: { id } });
};

export const reorderChaptersTx = async (
  courseId: string,
  chapters: { chapterId: string; order: number }[]
) => {
  return prisma.$transaction(async (tx) => {
    for (const { chapterId } of chapters) {
      const chapter = await tx.chapter.findUnique({ where: { id: chapterId } });
      if (!chapter || chapter.courseId !== courseId) {
        throw new Error(`Chapter ${chapterId} does not belong to course ${courseId}`);
      }
    }

    // Phase 1: bump every target chapter to a temporary negative order
    // to avoid colliding with the @@unique([courseId, order]) constraint.
    await Promise.all(
      chapters.map(({ chapterId }, index) =>
        tx.chapter.update({
          where: { id: chapterId },
          data: { order: -(index + 1) },
        })
      )
    );

    // Phase 2: set the real, final orders.
    await Promise.all(
      chapters.map(({ chapterId, order }) =>
        tx.chapter.update({
          where: { id: chapterId },
          data: { order },
        })
      )
    );
  });
};