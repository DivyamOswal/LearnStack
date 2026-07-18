import { ApiError } from '../../utils/ApiError';
import * as reviewRepo from './reviews.repository';
import { CreateReviewInput, UpdateReviewInput } from './reviews.types';

export const addReview = async (userId: string, input: CreateReviewInput) => {
  const course = await reviewRepo.findCourseById(input.courseId);
  if (!course) throw new ApiError(404, 'Course not found.');

  const hasPurchased = await reviewRepo.findCompletedOrder(userId, input.courseId);
  if (!hasPurchased) {
    throw new ApiError(403, 'You can only review courses you have purchased.');
  }

  const existingReview = await reviewRepo.findExistingReview(userId, input.courseId);
  if (existingReview) {
    throw new ApiError(409, 'You have already reviewed this course. Edit your existing review instead.');
  }

  return reviewRepo.createReview(userId, input);
};

export const getReviewsForCourse = async (
  courseId: string,
  query: { page?: number; limit?: number }
) => {
  const course = await reviewRepo.findCourseById(courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  return reviewRepo.findReviewsForCourse(courseId, query);
};

export const getRatingDistribution = async (courseId: string) => {
  const course = await reviewRepo.findCourseById(courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  return reviewRepo.getRatingDistribution(courseId);
};

export const editReview = async (id: string, userId: string, input: UpdateReviewInput) => {
  const review = await reviewRepo.findReviewById(id);
  if (!review) throw new ApiError(404, 'Review not found.');
  if (review.userId !== userId) {
    throw new ApiError(403, 'You can only edit your own review.');
  }
  return reviewRepo.updateReview(id, input);
};

export const removeReview = async (id: string, userId: string, isAdmin: boolean) => {
  const review = await reviewRepo.findReviewById(id);
  if (!review) throw new ApiError(404, 'Review not found.');

  if (review.userId !== userId && !isAdmin) {
    throw new ApiError(403, 'You do not have permission to delete this review.');
  }

  return reviewRepo.deleteReview(id);
};