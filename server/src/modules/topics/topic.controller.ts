import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import * as topicService from './topic.service';

export const createTopic = asyncHandler(async (req: Request, res: Response) => {
  const topic = await topicService.addTopic(req.body);
  res.status(201).json(new ApiResponse(201, topic, 'Topic created successfully.'));
});

export const getTopicsForLesson = asyncHandler(async (req: Request, res: Response) => {
  const topics = await topicService.getTopicsForLesson(req.params.lessonId);
  res.status(200).json(new ApiResponse(200, topics, 'Topics fetched.'));
});

export const getTopic = asyncHandler(async (req: Request, res: Response) => {
  const topic = await topicService.getTopicDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, topic, 'Topic fetched.'));
});

export const updateTopic = asyncHandler(async (req: Request, res: Response) => {
  const topic = await topicService.editTopic(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, topic, 'Topic updated.'));
});

export const deleteTopic = asyncHandler(async (req: Request, res: Response) => {
  await topicService.removeTopic(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Topic deleted.'));
});

export const reorderTopics = asyncHandler(async (req: Request, res: Response) => {
  await topicService.reorderTopics(req.params.lessonId, req.body.topics);
  res.status(200).json(new ApiResponse(200, null, 'Topics reordered successfully.'));
});