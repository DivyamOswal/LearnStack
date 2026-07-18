import { Prisma } from '@prisma/client';
import prisma from '../../config/db';
import { BlogListQuery, CreateBlogInput, UpdateBlogInput } from './blog.types';

const slugify = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const createBlog = async (
  authorId: string,
  input: CreateBlogInput,
  coverImage?: string
) => {
  const baseSlug = slugify(input.title);
  let slug = baseSlug;
  let counter = 1;

  // ensure slug uniqueness
  while (await prisma.blog.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return prisma.blog.create({
    data: {
      title: input.title,
      slug,
      content: input.content,
      coverImage,
      isPublished: input.isPublished ?? false,
      authorId,
    },
  });
};

export const findBlogs = async ({ page = 1, limit = 10, search }: BlogListQuery, publishedOnly: boolean) => {
  const skip = (page - 1) * limit;

  const where: Prisma.BlogWhereInput = {
    ...(publishedOnly ? { isPublished: true } : {}),
    ...(search
      ? { title: { contains: search, mode: 'insensitive' } }
      : {}),
  };

  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        isPublished: true,
        createdAt: true,
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.blog.count({ where }),
  ]);

  return { blogs, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const findBlogById = (id: string) => {
  return prisma.blog.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, avatarUrl: true } } },
  });
};

export const findBlogBySlug = (slug: string) => {
  return prisma.blog.findUnique({
    where: { slug },
    include: { author: { select: { id: true, name: true, avatarUrl: true } } },
  });
};

export const updateBlog = async (
  id: string,
  input: UpdateBlogInput,
  coverImage?: string
) => {
  let slug: string | undefined;

  if (input.title) {
    const baseSlug = slugify(input.title);
    slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await prisma.blog.findUnique({ where: { slug } });
      if (!existing || existing.id === id) break;
      slug = `${baseSlug}-${counter++}`;
    }
  }

  return prisma.blog.update({
    where: { id },
    data: {
      ...(input.title ? { title: input.title, slug } : {}),
      ...(input.content ? { content: input.content } : {}),
      ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
      ...(coverImage ? { coverImage } : {}),
    },
  });
};

export const deleteBlog = (id: string) => {
  return prisma.blog.delete({ where: { id } });
};