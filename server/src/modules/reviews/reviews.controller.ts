import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import * as reviewService from './reviews.service';

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.addReview(req.user!.id, req.body);
  res.status(201).json(new ApiResponse(201, review, 'Review submitted successfully.'));
});

export const getReviewsForCourse = asyncHandler(async (req: Request, res: Response) => {
  const result = await reviewService.getReviewsForCourse(req.params.courseId, req.query as any);
  res.status(200).json(new ApiResponse(200, result, 'Reviews fetched.'));
});

export const getRatingDistribution = asyncHandler(async (req: Request, res: Response) => {
  const distribution = await reviewService.getRatingDistribution(req.params.courseId);
  res.status(200).json(new ApiResponse(200, distribution, 'Rating distribution fetched.'));
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.editReview(req.params.id, req.user!.id, req.body);
  res.status(200).json(new ApiResponse(200, review, 'Review updated.'));
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user!.role === 'ADMIN';
  await reviewService.removeReview(req.params.id, req.user!.id, isAdmin);
  res.status(200).json(new ApiResponse(200, null, 'Review deleted.'));
});