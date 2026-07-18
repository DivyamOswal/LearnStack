import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import * as blogService from './blog.service';

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const coverImage = (req.file as Express.Multer.File & { path?: string })?.path;
  const blog = await blogService.addBlog(req.user!.id, req.body, coverImage);
  res.status(201).json(new ApiResponse(201, blog, 'Blog post created.'));
});

export const getPublicBlogs = asyncHandler(async (req: Request, res: Response) => {
  const result = await blogService.listPublicBlogs(req.query as any);
  res.status(200).json(new ApiResponse(200, result, 'Blogs fetched.'));
});

export const getAdminBlogs = asyncHandler(async (req: Request, res: Response) => {
  const result = await blogService.listAllBlogsForAdmin(req.query as any);
  res.status(200).json(new ApiResponse(200, result, 'All blogs fetched.'));
});

export const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.getBlogBySlug(req.params.slug);
  res.status(200).json(new ApiResponse(200, blog, 'Blog post fetched.'));
});

export const getBlogByIdForAdmin = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.getBlogByIdForAdmin(req.params.id);
  res.status(200).json(new ApiResponse(200, blog, 'Blog post fetched.'));
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const coverImage = (req.file as Express.Multer.File & { path?: string })?.path;
  const blog = await blogService.editBlog(req.params.id, req.body, coverImage);
  res.status(200).json(new ApiResponse(200, blog, 'Blog post updated.'));
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  await blogService.removeBlog(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Blog post deleted.'));
});