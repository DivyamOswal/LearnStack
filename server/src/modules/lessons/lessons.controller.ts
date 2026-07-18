import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import * as lessonService from './lessons.service';

interface UploadedFiles {
  video?: Express.Multer.File[];
  pdf?: Express.Multer.File[];
}

const extractFileUrls = (req: Request) => {
  const files = req.files as UploadedFiles | undefined;
  return {
    videoUrl: files?.video?.[0]
      ? (files.video[0] as Express.Multer.File & { path?: string }).path
      : undefined,
    pdfUrl: files?.pdf?.[0]
      ? (files.pdf[0] as Express.Multer.File & { path?: string }).path
      : undefined,
  };
};

export const createLesson = asyncHandler(async (req: Request, res: Response) => {
  const files = extractFileUrls(req);
  const lesson = await lessonService.addLesson(req.body, files);
  res.status(201).json(new ApiResponse(201, lesson, 'Lesson created successfully.'));
});

export const getLessonsForChapter = asyncHandler(async (req: Request, res: Response) => {
  const lessons = await lessonService.getLessonsForChapter(req.params.chapterId);
  res.status(200).json(new ApiResponse(200, lessons, 'Lessons fetched.'));
});

export const getLesson = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await lessonService.getLessonDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, lesson, 'Lesson fetched.'));
});

export const updateLesson = asyncHandler(async (req: Request, res: Response) => {
  const files = extractFileUrls(req);
  const lesson = await lessonService.editLesson(req.params.id, req.body, files);
  res.status(200).json(new ApiResponse(200, lesson, 'Lesson updated.'));
});

export const deleteLesson = asyncHandler(async (req: Request, res: Response) => {
  await lessonService.removeLesson(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Lesson deleted.'));
});

export const reorderLessons = asyncHandler(async (req: Request, res: Response) => {
  await lessonService.reorderLessons(req.params.chapterId, req.body.lessons);
  res.status(200).json(new ApiResponse(200, null, 'Lessons reordered successfully.'));
});