import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import * as userService from './users.service';

const getUploadedAvatarUrl = (req: Request) =>
  (req.file as Express.Multer.File & { path?: string })?.path;

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getProfile(req.user!.id);
  res.status(200).json(new ApiResponse(200, user, 'Profile fetched.'));
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const avatarUrl = getUploadedAvatarUrl(req);
  const user = await userService.editProfile(req.user!.id, req.body, avatarUrl);
  res.status(200).json(new ApiResponse(200, user, 'Profile updated.'));
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await userService.changePassword(req.user!.id, req.body);
  res.status(200).json(new ApiResponse(200, null, 'Password changed successfully. Please log in again.'));
});

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const summary = await userService.getDashboardSummary(req.user!.id);
  res.status(200).json(new ApiResponse(200, summary, 'Dashboard data fetched.'));
});

export const toggleBookmark = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.toggleBookmark(req.user!.id, req.params.courseId);
  res
    .status(200)
    .json(new ApiResponse(200, result, result.bookmarked ? 'Course bookmarked.' : 'Bookmark removed.'));
});

export const getMyBookmarks = asyncHandler(async (req: Request, res: Response) => {
  const bookmarks = await userService.getMyBookmarks(req.user!.id);
  res.status(200).json(new ApiResponse(200, bookmarks, 'Bookmarks fetched.'));
});