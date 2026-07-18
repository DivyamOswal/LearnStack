import { Prisma } from '@prisma/client';
import prisma from '../../config/db';
import { CourseListQuery, CreateCourseInput, UpdateCourseInput } from './courses.types';

const slugify = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const generateUniqueSlug = async (title: string, excludeId?: string) => {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.course.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

export const createCourse = async (
  createdById: string,
  input: CreateCourseInput,
  thumbnailUrl?: string
) => {
  const slug = await generateUniqueSlug(input.title);

  return prisma.course.create({
    data: {
      title: input.title,
      slug,
      description: input.description,
      price: input.price,
      discountPrice: input.discountPrice,
      categoryId: input.categoryId,
      isPublished: input.isPublished ?? false,
      createdById,
      thumbnailUrl,
    },
  });
};

export const findCourses = async (
  { page = 1, limit = 12, search, categoryId, isPublished }: CourseListQuery,
  restrictToPublished: boolean
) => {
  const skip = (page - 1) * limit;

  const where: Prisma.CourseWhereInput = {
    ...(restrictToPublished ? { isPublished: true } : {}),
    ...(!restrictToPublished && isPublished !== undefined
      ? { isPublished: isPublished === 'true' }
      : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnailUrl: true,
        price: true,
        discountPrice: true,
        isPublished: true,
        createdAt: true,
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { reviews: true, orders: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.count({ where }),
  ]);

  return { courses, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const findCourseBySlug = (slug: string) => {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      createdBy: { select: { id: true, name: true, avatarUrl: true } },
      chapters: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: { id: true, title: true, type: true, order: true },
          },
        },
      },
      quizzes: { select: { id: true, title: true } },
      _count: { select: { reviews: true, orders: true } },
    },
  });
};

export const findCourseById = (id: string) => {
  return prisma.course.findUnique({ where: { id } });
};

export const updateCourse = async (
  id: string,
  input: UpdateCourseInput,
  thumbnailUrl?: string
) => {
  let slug: string | undefined;
  if (input.title) {
    slug = await generateUniqueSlug(input.title, id);
  }

  return prisma.course.update({
    where: { id },
    data: {
      ...(input.title ? { title: input.title, slug } : {}),
      ...(input.description ? { description: input.description } : {}),
      ...(input.price !== undefined ? { price: input.price } : {}),
      ...(input.discountPrice !== undefined ? { discountPrice: input.discountPrice } : {}),
      ...(input.categoryId ? { categoryId: input.categoryId } : {}),
      ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
      ...(thumbnailUrl ? { thumbnailUrl } : {}),
    },
  });
};

export const deleteCourse = (id: string) => {
  return prisma.course.delete({ where: { id } });
};

export const checkCategoryExists = async (categoryId: string) => {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  return !!category;
};