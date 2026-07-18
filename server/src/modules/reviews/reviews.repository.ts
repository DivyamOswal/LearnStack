import prisma from '../../config/db';
import { CreateReviewInput, UpdateReviewInput } from './reviews.types';

export const findCourseById = (courseId: string) => {
  return prisma.course.findUnique({ where: { id: courseId } });
};

// Verifies the user actually purchased the course before letting them review it.
export const findCompletedOrder = (userId: string, courseId: string) => {
  return prisma.order.findFirst({
    where: { userId, courseId, status: 'COMPLETED' },
  });
};

export const findExistingReview = (userId: string, courseId: string) => {
  return prisma.review.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
};

export const createReview = (userId: string, input: CreateReviewInput) => {
  return prisma.review.create({
    data: {
      userId,
      courseId: input.courseId,
      rating: input.rating,
      comment: input.comment,
    },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
};

export const findReviewsForCourse = async (
  courseId: string,
  { page = 1, limit = 10 }: { page?: number; limit?: number }
) => {
  const skip = (page - 1) * limit;

  const [reviews, total, aggregate] = await Promise.all([
    prisma.review.findMany({
      where: { courseId },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { courseId } }),
    prisma.review.aggregate({
      where: { courseId },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  return {
    reviews,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    averageRating: aggregate._avg.rating ? Math.round(aggregate._avg.rating * 10) / 10 : 0,
    ratingCount: aggregate._count.rating,
  };
};

export const findReviewById = (id: string) => {
  return prisma.review.findUnique({ where: { id } });
};

export const updateReview = (id: string, input: UpdateReviewInput) => {
  return prisma.review.update({
    where: { id },
    data: {
      ...(input.rating !== undefined ? { rating: input.rating } : {}),
      ...(input.comment !== undefined ? { comment: input.comment } : {}),
    },
  });
};

export const deleteReview = (id: string) => {
  return prisma.review.delete({ where: { id } });
};

// Rating distribution for a course, e.g. { 5: 12, 4: 3, 3: 1, 2: 0, 1: 0 }
export const getRatingDistribution = async (courseId: string) => {
  const rows = await prisma.review.groupBy({
    by: ['rating'],
    where: { courseId },
    _count: { rating: true },
  });

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const row of rows) {
    distribution[row.rating] = row._count.rating;
  }
  return distribution;
};