import { ApiError } from '../../utils/ApiError';
import * as courseRepo from './courses.repository';
import { CourseListQuery, CreateCourseInput, UpdateCourseInput } from './courses.types';

export const addCourse = async (
  createdById: string,
  input: CreateCourseInput,
  thumbnailUrl?: string
) => {
  const categoryExists = await courseRepo.checkCategoryExists(input.categoryId);
  if (!categoryExists) {
    throw new ApiError(400, 'Selected category does not exist.');
  }

  if (input.discountPrice !== undefined && input.discountPrice >= input.price) {
    throw new ApiError(400, 'Discount price must be lower than the regular price.');
  }

  return courseRepo.createCourse(createdById, input, thumbnailUrl);
};

export const listPublicCourses = async (query: CourseListQuery) => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 12;
  return courseRepo.findCourses({ ...query, page, limit }, true);
};

export const listAllCoursesForAdmin = async (query: CourseListQuery) => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 12;
  return courseRepo.findCourses({ ...query, page, limit }, false);
};

export const getCourseBySlug = async (slug: string) => {
  const course = await courseRepo.findCourseBySlug(slug);
  if (!course || !course.isPublished) {
    throw new ApiError(404, 'Course not found.');
  }
  return course;
};

export const getCourseByIdForAdmin = async (id: string) => {
  const course = await courseRepo.findCourseById(id);
  if (!course) throw new ApiError(404, 'Course not found.');
  return course;
};

export const editCourse = async (
  id: string,
  input: UpdateCourseInput,
  thumbnailUrl?: string
) => {
  const existing = await courseRepo.findCourseById(id);
  if (!existing) throw new ApiError(404, 'Course not found.');

  if (input.categoryId) {
    const categoryExists = await courseRepo.checkCategoryExists(input.categoryId);
    if (!categoryExists) throw new ApiError(400, 'Selected category does not exist.');
  }

  const effectivePrice = input.price ?? Number(existing.price);
  const effectiveDiscount = input.discountPrice ?? (existing.discountPrice ? Number(existing.discountPrice) : undefined);
  if (effectiveDiscount !== undefined && effectiveDiscount >= effectivePrice) {
    throw new ApiError(400, 'Discount price must be lower than the regular price.');
  }

  return courseRepo.updateCourse(id, input, thumbnailUrl);
};

export const removeCourse = async (id: string) => {
  const existing = await courseRepo.findCourseById(id);
  if (!existing) throw new ApiError(404, 'Course not found.');
  return courseRepo.deleteCourse(id);
};