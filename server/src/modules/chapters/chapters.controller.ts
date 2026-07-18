import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import * as chapterService from './chapters.service';

export const createChapter = asyncHandler(async (req: Request, res: Response) => {
  const chapter = await chapterService.addChapter(req.body);
  res.status(201).json(new ApiResponse(201, chapter, 'Chapter created successfully.'));
});

export const getChaptersForCourse = asyncHandler(async (req: Request, res: Response) => {
  const chapters = await chapterService.getChaptersForCourse(req.params.courseId);
  res.status(200).json(new ApiResponse(200, chapters, 'Chapters fetched.'));
});

export const getChapter = asyncHandler(async (req: Request, res: Response) => {
  const chapter = await chapterService.getChapterDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, chapter, 'Chapter fetched.'));
});

export const updateChapter = asyncHandler(async (req: Request, res: Response) => {
  const chapter = await chapterService.editChapter(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, chapter, 'Chapter updated.'));
});

export const deleteChapter = asyncHandler(async (req: Request, res: Response) => {
  await chapterService.removeChapter(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Chapter deleted.'));
});

export const reorderChapters = asyncHandler(async (req: Request, res: Response) => {
  await chapterService.reorderChapters(req.params.courseId, req.body.chapters);
  res.status(200).json(new ApiResponse(200, null, 'Chapters reordered successfully.'));
});