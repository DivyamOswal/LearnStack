import { ApiError } from '../../utils/ApiError';
import * as progressRepo from './progress.repository';
import { CourseProgressSummary } from './progress.types';

export const markLessonComplete = async (userId: string, lessonId: string) => {
  const lesson = await progressRepo.findLessonWithCourse(lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found.');

  const courseId = lesson.chapter.courseId;

  const hasPurchased = await progressRepo.findCompletedOrder(userId, courseId);
  if (!hasPurchased) {
    throw new ApiError(403, 'You must purchase this course before tracking progress.');
  }

  return progressRepo.upsertProgress(userId, courseId, lessonId);
};

export const markLessonIncomplete = async (userId: string, lessonId: string) => {
  const existing = await progressRepo.findProgressRecord(userId, lessonId);
  if (!existing) {
    throw new ApiError(404, 'No progress record exists for this lesson yet.');
  }
  return progressRepo.unmarkProgress(userId, lessonId);
};

export const getCourseProgressSummary = async (
  userId: string,
  courseId: string
): Promise<CourseProgressSummary> => {
  const course = await progressRepo.findCourseById(courseId);
  if (!course) throw new ApiError(404, 'Course not found.');

  const [totalLessons, completedLessons] = await Promise.all([
    progressRepo.countTotalLessonsInCourse(courseId),
    progressRepo.countCompletedLessonsForUser(userId, courseId),
  ]);

  const percentComplete =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    courseId,
    totalLessons,
    completedLessons,
    percentComplete,
    isComplete: totalLessons > 0 && completedLessons === totalLessons,
  };
};

export const getDetailedProgressForCourse = async (userId: string, courseId: string) => {
  const course = await progressRepo.findCourseById(courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  return progressRepo.findProgressForCourse(userId, courseId);
};

export const getContinueLearning = async (userId: string, courseId: string) => {
  const course = await progressRepo.findCourseById(courseId);
  if (!course) throw new ApiError(404, 'Course not found.');

  const mostRecent = await progressRepo.findMostRecentProgress(userId, courseId);
  if (!mostRecent) {
    return null; // student hasn't started this course yet LearnStack frontend shows "Start Course"
  }

  return {
    lessonId: mostRecent.lesson.id,
    lessonTitle: mostRecent.lesson.title,
    chapterId: mostRecent.lesson.chapterId,
    completed: mostRecent.completed,
  };
};

export const getInProgressCourses = async (userId: string) => {
  return progressRepo.findAllInProgressCoursesForUser(userId);
};