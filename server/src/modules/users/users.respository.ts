import prisma from '../../config/db';
import { UpdateProfileInput } from './users.types';

export const findUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      bio: true,
      socialLinks: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });
};

export const findUserWithPassword = (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const updateProfile = (id: string, input: UpdateProfileInput, avatarUrl?: string) => {
  return prisma.user.update({
    where: { id },
    data: {
      ...(input.name ? { name: input.name } : {}),
      ...(input.bio !== undefined ? { bio: input.bio } : {}),
      ...(input.socialLinks ? { socialLinks: input.socialLinks } : {}),
      ...(avatarUrl ? { avatarUrl } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      bio: true,
      socialLinks: true,
    },
  });
};

export const updatePassword = (id: string, hashedPassword: string) => {
  return prisma.user.update({ where: { id }, data: { password: hashedPassword, refreshToken: null } });
};

// ---------- Dashboard aggregation ----------

export const getPurchasedCourses = (userId: string) => {
  return prisma.order.findMany({
    where: { userId, status: 'COMPLETED' },
    include: {
      course: {
        select: { id: true, title: true, slug: true, thumbnailUrl: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getCertificateCount = (userId: string) => {
  return prisma.certificate.count({ where: { userId } });
};

export const getBookmarkCount = (userId: string) => {
  return prisma.bookmark.count({ where: { userId } });
};

export const getRecentProgress = (userId: string) => {
  return prisma.progress.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: {
      lesson: { select: { id: true, title: true } },
      course: { select: { id: true, title: true, slug: true } },
    },
  });
};

export const getRecentQuizAttempts = (userId: string) => {
  return prisma.quizAttempt.findMany({
    where: { userId },
    orderBy: { attemptedAt: 'desc' },
    take: 5,
    include: {
      quiz: { select: { id: true, title: true } },
    },
  });
};

// ---------- Bookmarks / wishlist ----------

export const findCourseById = (courseId: string) => {
  return prisma.course.findUnique({ where: { id: courseId } });
};

export const findBookmark = (userId: string, courseId: string) => {
  return prisma.bookmark.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
};

export const addBookmark = (userId: string, courseId: string) => {
  return prisma.bookmark.create({ data: { userId, courseId } });
};

export const removeBookmark = (userId: string, courseId: string) => {
  return prisma.bookmark.delete({
    where: { userId_courseId: { userId, courseId } },
  });
};

export const getBookmarks = (userId: string) => {
  return prisma.bookmark.findMany({
    where: { userId },
    include: {
      course: {
        select: { id: true, title: true, slug: true, thumbnailUrl: true, price: true, discountPrice: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};