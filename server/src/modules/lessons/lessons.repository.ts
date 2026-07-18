import { Prisma, LessonType } from '@prisma/client';
import prisma from '../../config/db';
import { CreateLessonInput, UpdateLessonInput } from './lessons.types';

export const findChapterById = (chapterId: string) => {
  return prisma.chapter.findUnique({ where: { id: chapterId } });
};

export const createLesson = async (
  input: CreateLessonInput,
  files?: { videoUrl?: string; pdfUrl?: string }
) => {
  return prisma.lesson.create({
    data: {
      title: input.title,
      type: input.type,
      order: input.order,
      chapterId: input.chapterId,
      content: input.content,
      videoUrl: files?.videoUrl,
      pdfUrl: files?.pdfUrl,
    },
  });
};

export const findLessonsByChapter = (chapterId: string) => {
  return prisma.lesson.findMany({
    where: { chapterId },
    orderBy: { order: 'asc' },
    include: {
      topics: { orderBy: { order: 'asc' } },
    },
  });
};

export const findLessonById = (id: string) => {
  return prisma.lesson.findUnique({
    where: { id },
    include: {
      topics: { orderBy: { order: 'asc' } },
      chapter: { select: { id: true, title: true, courseId: true } },
    },
  });
};

export const findLessonByChapterAndOrder = (chapterId: string, order: number) => {
  return prisma.lesson.findUnique({
    where: { chapterId_order: { chapterId, order } },
  });
};

export const updateLesson = async (
  id: string,
  input: UpdateLessonInput,
  files?: { videoUrl?: string; pdfUrl?: string }
) => {
  return prisma.lesson.update({
    where: { id },
    data: {
      ...(input.title ? { title: input.title } : {}),
      ...(input.type ? { type: input.type } : {}),
      ...(input.order !== undefined ? { order: input.order } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(files?.videoUrl ? { videoUrl: files.videoUrl } : {}),
      ...(files?.pdfUrl ? { pdfUrl: files.pdfUrl } : {}),
    },
  });
};

export const deleteLesson = (id: string) => {
  return prisma.lesson.delete({ where: { id } });
};

export const reorderLessonsTx = async (
  chapterId: string,
  lessons: { lessonId: string; order: number }[]
) => {
  // Two-phase update avoids unique constraint collisions on (chapterId, order):
  // first bump every target lesson to a temporary negative order, then set final orders.
  return prisma.$transaction(async (tx) => {
    for (const { lessonId } of lessons) {
      const lesson = await tx.lesson.findUnique({ where: { id: lessonId } });
      if (!lesson || lesson.chapterId !== chapterId) {
        throw new Error(`Lesson ${lessonId} does not belong to chapter ${chapterId}`);
      }
    }

    await Promise.all(
      lessons.map(({ lessonId }, index) =>
        tx.lesson.update({
          where: { id: lessonId },
          data: { order: -(index + 1) }, // temporary negative order
        })
      )
    );

    await Promise.all(
      lessons.map(({ lessonId, order }) =>
        tx.lesson.update({
          where: { id: lessonId },
          data: { order },
        })
      )
    );
  });
};