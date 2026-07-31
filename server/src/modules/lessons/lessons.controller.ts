import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { uploadBufferToImageKit } from '../../utils/imagekit.helper';
import * as lessonService from './lessons.service';

interface UploadedFiles {
  video?: Express.Multer.File[];
  pdf?: Express.Multer.File[];
}

export const createLesson = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as UploadedFiles;

  let videoUrl: string | undefined;
  let pdfUrl: string | undefined;

  if (files?.video?.length) {
    videoUrl = await uploadBufferToImageKit(
      files.video[0].buffer,
      `${uuidv4()}-${files.video[0].originalname}`,
      'LearnStack/videos'
    );
  }

  if (files?.pdf?.length) {
    pdfUrl = await uploadBufferToImageKit(
      files.pdf[0].buffer,
      `${uuidv4()}-${files.pdf[0].originalname}`,
      'LearnStack/pdfs'
    );
  }

  const lesson = await lessonService.addLesson(req.body, {
    videoUrl,
    pdfUrl,
  });

  res
    .status(201)
    .json(new ApiResponse(201, lesson, 'Lesson created successfully.'));
});

export const getLessonsForChapter = asyncHandler(async (req: Request, res: Response) => {
  const lessons = await lessonService.getLessonsForChapter(req.params.chapterId);

  res
    .status(200)
    .json(new ApiResponse(200, lessons, 'Lessons fetched.'));
});

export const getLesson = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await lessonService.getLessonDetail(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, lesson, 'Lesson fetched.'));
});

export const updateLesson = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as UploadedFiles;

  let videoUrl: string | undefined;
  let pdfUrl: string | undefined;

  if (files?.video?.length) {
    videoUrl = await uploadBufferToImageKit(
      files.video[0].buffer,
      `${uuidv4()}-${files.video[0].originalname}`,
      'LearnStack/videos'
    );
  }

  if (files?.pdf?.length) {
    pdfUrl = await uploadBufferToImageKit(
      files.pdf[0].buffer,
      `${uuidv4()}-${files.pdf[0].originalname}`,
      'LearnStack/pdfs'
    );
  }

  const lesson = await lessonService.editLesson(
    req.params.id,
    req.body,
    {
      videoUrl,
      pdfUrl,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, lesson, 'Lesson updated.'));
});

export const deleteLesson = asyncHandler(async (req: Request, res: Response) => {
  await lessonService.removeLesson(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Lesson deleted.'));
});

export const reorderLessons = asyncHandler(async (req: Request, res: Response) => {
  await lessonService.reorderLessons(
    req.params.chapterId,
    req.body.lessons
  );

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Lessons reordered successfully.'));
});