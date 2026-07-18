import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import * as progressService from './progress.service';

export const markLessonComplete = asyncHandler(async (req: Request, res: Response) => {
  const progress = await progressService.markLessonComplete(req.user!.id, req.body.lessonId);
  res.status(200).json(new ApiResponse(200, progress, 'Lesson marked as complete.'));
});

export const markLessonIncomplete = asyncHandler(async (req: Request, res: Response) => {
  const progress = await progressService.markLessonIncomplete(req.user!.id, req.params.lessonId);
  res.status(200).json(new ApiResponse(200, progress, 'Lesson marked as incomplete.'));
});

export const getCourseProgressSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await progressService.getCourseProgressSummary(req.user!.id, req.params.courseId);
  res.status(200).json(new ApiResponse(200, summary, 'Progress summary fetched.'));
});

export const getDetailedProgress = asyncHandler(async (req: Request, res: Response) => {
  const progress = await progressService.getDetailedProgressForCourse(req.user!.id, req.params.courseId);
  res.status(200).json(new ApiResponse(200, progress, 'Detailed progress fetched.'));
});

export const getContinueLearning = asyncHandler(async (req: Request, res: Response) => {
  const result = await progressService.getContinueLearning(req.user!.id, req.params.courseId);
  res.status(200).json(new ApiResponse(200, result, 'Continue-learning data fetched.'));
});

export const getInProgressCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await progressService.getInProgressCourses(req.user!.id);
  res.status(200).json(new ApiResponse(200, courses, 'In-progress courses fetched.'));
});