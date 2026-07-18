import { Role } from '@prisma/client';
import { ApiError } from '../../utils/ApiError';
import * as commentRepo from './comments.repository';
import { CreateCommentInput } from './comments.types';

export const addComment = async (userId: string, input: CreateCommentInput) => {
  const lesson = await commentRepo.findLessonById(input.lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found.');

  if (input.parentId) {
    const parent = await commentRepo.findCommentById(input.parentId);
    if (!parent) throw new ApiError(404, 'Comment you are replying to no longer exists.');
    if (parent.lessonId !== input.lessonId) {
      throw new ApiError(400, 'Reply must belong to the same lesson as the comment.');
    }
  }

  return commentRepo.createComment(userId, input);
};

export const getCommentsForLesson = async (lessonId: string) => {
  const lesson = await commentRepo.findLessonById(lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found.');
  return commentRepo.findCommentsForLesson(lessonId);
};

export const likeComment = async (id: string) => {
  const comment = await commentRepo.findCommentById(id);
  if (!comment) throw new ApiError(404, 'Comment not found.');
  return commentRepo.incrementLikes(id);
};

export const reportComment = async (id: string) => {
  const comment = await commentRepo.findCommentById(id);
  if (!comment) throw new ApiError(404, 'Comment not found.');
  return commentRepo.markReported(id);
};

export const dismissReport = async (id: string) => {
  const comment = await commentRepo.findCommentById(id);
  if (!comment) throw new ApiError(404, 'Comment not found.');
  return commentRepo.unmarkReported(id);
};

export const editComment = async (id: string, userId: string, content: string) => {
  const comment = await commentRepo.findCommentById(id);
  if (!comment) throw new ApiError(404, 'Comment not found.');
  if (comment.userId !== userId) {
    throw new ApiError(403, 'You can only edit your own comments.');
  }
  return commentRepo.updateCommentContent(id, content);
};

export const removeComment = async (
  id: string,
  requestingUserId: string,
  requestingUserRole: Role
) => {
  const comment = await commentRepo.findCommentById(id);
  if (!comment) throw new ApiError(404, 'Comment not found.');

  const isOwner = comment.userId === requestingUserId;
  const isAdmin = requestingUserRole === Role.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You do not have permission to delete this comment.');
  }

  return commentRepo.deleteComment(id);
};

export const getReportedComments = async () => {
  return commentRepo.findReportedComments();
};