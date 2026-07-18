import prisma from '../../config/db';
import { CreateCommentInput } from './comments.types';

export const findLessonById = (lessonId: string) => {
  return prisma.lesson.findUnique({ where: { id: lessonId } });
};

export const findCommentById = (id: string) => {
  return prisma.comment.findUnique({ where: { id } });
};

export const createComment = (userId: string, input: CreateCommentInput) => {
  return prisma.comment.create({
    data: {
      content: input.content,
      lessonId: input.lessonId,
      userId,
      parentId: input.parentId,
    },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
};

// Fetch only top-level comments; replies are nested via Prisma's include.
// Two levels deep matches your spec's "Nested Comments" without unbounded recursion.
export const findCommentsForLesson = (lessonId: string) => {
  return prisma.comment.findMany({
    where: { lessonId, parentId: null },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      replies: {
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
    },
  });
};

export const incrementLikes = (id: string) => {
  return prisma.comment.update({
    where: { id },
    data: { likes: { increment: 1 } },
  });
};

export const markReported = (id: string) => {
  return prisma.comment.update({
    where: { id },
    data: { isReported: true },
  });
};

export const unmarkReported = (id: string) => {
  return prisma.comment.update({
    where: { id },
    data: { isReported: false },
  });
};

export const updateCommentContent = (id: string, content: string) => {
  return prisma.comment.update({
    where: { id },
    data: { content },
  });
};

export const deleteComment = (id: string) => {
  return prisma.comment.delete({ where: { id } });
};

export const findReportedComments = () => {
  return prisma.comment.findMany({
    where: { isReported: true },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true } },
      lesson: { select: { id: true, title: true } },
    },
  });
};