import { ApiError } from '../../utils/ApiError';
import * as blogRepo from './blog.repository';
import { BlogListQuery, CreateBlogInput, UpdateBlogInput } from './blog.types';

export const addBlog = async (
  authorId: string,
  input: CreateBlogInput,
  coverImage?: string
) => {
  return blogRepo.createBlog(authorId, input, coverImage);
};

export const listPublicBlogs = async (query: BlogListQuery) => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  return blogRepo.findBlogs({ ...query, page, limit }, true);
};

export const listAllBlogsForAdmin = async (query: BlogListQuery) => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  return blogRepo.findBlogs({ ...query, page, limit }, false);
};

export const getBlogBySlug = async (slug: string) => {
  const blog = await blogRepo.findBlogBySlug(slug);
  if (!blog || !blog.isPublished) {
    throw new ApiError(404, 'Blog post not found.');
  }
  return blog;
};

export const getBlogByIdForAdmin = async (id: string) => {
  const blog = await blogRepo.findBlogById(id);
  if (!blog) throw new ApiError(404, 'Blog post not found.');
  return blog;
};

export const editBlog = async (
  id: string,
  input: UpdateBlogInput,
  coverImage?: string
) => {
  const existing = await blogRepo.findBlogById(id);
  if (!existing) throw new ApiError(404, 'Blog post not found.');
  return blogRepo.updateBlog(id, input, coverImage);
};

export const removeBlog = async (id: string) => {
  const existing = await blogRepo.findBlogById(id);
  if (!existing) throw new ApiError(404, 'Blog post not found.');
  return blogRepo.deleteBlog(id);
};