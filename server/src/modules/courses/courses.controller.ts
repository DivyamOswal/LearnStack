import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { uploadBufferToImageKit } from '../../utils/imagekit.helper';
import * as courseService from './courses.service';

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  console.log('========== CREATE COURSE ==========');
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);

  let thumbnailUrl: string | undefined;

  if (req.file) {
    thumbnailUrl = await uploadBufferToImageKit(
      req.file.buffer,
      `${uuidv4()}-${req.file.originalname}`,
      'LearnStack/courses'
    );
  }

  console.log('THUMBNAIL URL:', thumbnailUrl);

  const course = await courseService.addCourse(
    req.user!.id,
    req.body,
    thumbnailUrl
  );

  res
    .status(201)
    .json(new ApiResponse(201, course, 'Course created successfully.'));
});

export const getPublicCourses = asyncHandler(async (req: Request, res: Response) => {
  const result = await courseService.listPublicCourses(
    req.query as any,
    req.user?.id
  );

  res
    .status(200)
    .json(new ApiResponse(200, result, 'Courses fetched.'));
});

export const getAdminCourses = asyncHandler(async (req: Request, res: Response) => {
  const result = await courseService.listAllCoursesForAdmin(req.query as any);

  res
    .status(200)
    .json(new ApiResponse(200, result, 'All courses fetched.'));
});

export const getCourseBySlug = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.getCourseBySlug(req.params.slug);

  res
    .status(200)
    .json(new ApiResponse(200, course, 'Course fetched.'));
});

export const getCourseByIdForAdmin = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.getCourseByIdForAdmin(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, course, 'Course fetched.'));
});

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  console.log('========== UPDATE COURSE ==========');
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);

  let thumbnailUrl: string | undefined;

  if (req.file) {
    thumbnailUrl = await uploadBufferToImageKit(
      req.file.buffer,
      `${uuidv4()}-${req.file.originalname}`,
      'LearnStack/courses'
    );
  }

  const course = await courseService.editCourse(
    req.params.id,
    req.body,
    thumbnailUrl
  );

  res
    .status(200)
    .json(new ApiResponse(200, course, 'Course updated.'));
});

export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
  await courseService.removeCourse(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Course deleted.'));
});

export const searchAll = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.query.q as string) ?? '';

  const results = await courseService.search(query);

  res
    .status(200)
    .json(new ApiResponse(200, results, 'Search results fetched.'));
});