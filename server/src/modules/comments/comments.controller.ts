import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import * as commentService from './comments.service';

export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const comment = await commentService.addComment(req.user!.id, req.body);
  res.status(201).json(new ApiResponse(201, comment, 'Comment posted.'));
});

export const getCommentsForLesson = asyncHandler(async (req: Request, res: Response) => {
  const comments = await commentService.getCommentsForLesson(req.params.lessonId);
  res.status(200).json(new ApiResponse(200, comments, 'Comments fetched.'));
});

export const likeComment = asyncHandler(async (req: Request, res: Response) => {
  const comment = await commentService.likeComment(req.params.id);
  res.status(200).json(new ApiResponse(200, comment, 'Comment liked.'));
});

export const reportComment = asyncHandler(async (req: Request, res: Response) => {
  await commentService.reportComment(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Comment reported. Our team will review it.'));
});

export const updateComment = asyncHandler(async (req: Request, res: Response) => {
  const comment = await commentService.editComment(req.params.id, req.user!.id, req.body.content);
  res.status(200).json(new ApiResponse(200, comment, 'Comment updated.'));
});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  await commentService.removeComment(req.params.id, req.user!.id, req.user!.role);
  res.status(200).json(new ApiResponse(200, null, 'Comment deleted.'));
});

// ---------- Admin moderation ----------

export const getReportedComments = asyncHandler(async (_req: Request, res: Response) => {
  const comments = await commentService.getReportedComments();
  res.status(200).json(new ApiResponse(200, comments, 'Reported comments fetched.'));
});

export const dismissReport = asyncHandler(async (req: Request, res: Response) => {
  const comment = await commentService.dismissReport(req.params.id);
  res.status(200).json(new ApiResponse(200, comment, 'Report dismissed.'));
});