import prisma from '../../config/db';

export const findLessonWithCourse = (lessonId: string) => {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      chapter: { select: { courseId: true } },
    },
  });
};

export const findCourseById = (courseId: string) => {
  return prisma.course.findUnique({ where: { id: courseId } });
};

// Has this user actually purchased the course this lesson belongs to?
export const findCompletedOrder = (userId: string, courseId: string) => {
  return prisma.order.findFirst({
    where: { userId, courseId, status: 'COMPLETED' },
  });
};

export const findProgressRecord = (userId: string, lessonId: string) => {
  return prisma.progress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });
};

export const upsertProgress = (userId: string, courseId: string, lessonId: string) => {
  return prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {
      completed: true,
      completedAt: new Date(),
    },
    create: {
      userId,
      courseId,
      lessonId,
      completed: true,
      completedAt: new Date(),
    },
  });
};

export const unmarkProgress = (userId: string, lessonId: string) => {
  return prisma.progress.update({
    where: { userId_lessonId: { userId, lessonId } },
    data: { completed: false, completedAt: null },
  });
};

export const countTotalLessonsInCourse = (courseId: string) => {
  return prisma.lesson.count({
    where: { chapter: { courseId } },
  });
};

export const countCompletedLessonsForUser = (userId: string, courseId: string) => {
  return prisma.progress.count({
    where: { userId, courseId, completed: true },
  });
};

export const findProgressForCourse = (userId: string, courseId: string) => {
  return prisma.progress.findMany({
    where: { userId, courseId },
    include: {
      lesson: { select: { id: true, title: true, type: true, chapterId: true } },
    },
  });
};

// "Continue learning": the most recently touched incomplete lesson,
// falling back to the most recently completed one if everything's done.
export const findMostRecentProgress = (userId: string, courseId: string) => {
  return prisma.progress.findFirst({
    where: { userId, courseId },
    orderBy: { updatedAt: 'desc' },
    include: {
      lesson: { select: { id: true, title: true, chapterId: true } },
    },
  });
};

export const findAllInProgressCoursesForUser = (userId: string) => {
  return prisma.progress.findMany({
    where: { userId },
    distinct: ['courseId'],
    orderBy: { updatedAt: 'desc' },
    include: {
      course: { select: { id: true, title: true, slug: true, thumbnailUrl: true } },
    },
  });
};