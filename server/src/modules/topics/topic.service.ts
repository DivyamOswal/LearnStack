import { ApiError } from '../../utils/ApiError';
import * as topicRepo from './topic.repository';
import { CreateTopicInput, UpdateTopicInput } from './topic.types';

export const addTopic = async (input: CreateTopicInput) => {
  const lesson = await topicRepo.findLessonById(input.lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found.');

  const existingAtOrder = await topicRepo.findTopicByLessonAndOrder(input.lessonId, input.order);
  if (existingAtOrder) {
    throw new ApiError(409, `A topic already exists at position ${input.order} in this lesson.`);
  }

  return topicRepo.createTopic(input);
};

export const getTopicsForLesson = async (lessonId: string) => {
  const lesson = await topicRepo.findLessonById(lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found.');
  return topicRepo.findTopicsByLesson(lessonId);
};

export const getTopicDetail = async (id: string) => {
  const topic = await topicRepo.findTopicById(id);
  if (!topic) throw new ApiError(404, 'Topic not found.');
  return topic;
};

export const editTopic = async (id: string, input: UpdateTopicInput) => {
  const existing = await topicRepo.findTopicById(id);
  if (!existing) throw new ApiError(404, 'Topic not found.');

  if (input.order !== undefined && input.order !== existing.order) {
    const collision = await topicRepo.findTopicByLessonAndOrder(existing.lessonId, input.order);
    if (collision) {
      throw new ApiError(409, `A topic already exists at position ${input.order} in this lesson.`);
    }
  }

  return topicRepo.updateTopic(id, input);
};

export const removeTopic = async (id: string) => {
  const existing = await topicRepo.findTopicById(id);
  if (!existing) throw new ApiError(404, 'Topic not found.');
  return topicRepo.deleteTopic(id);
};

export const reorderTopics = async (
  lessonId: string,
  topics: { topicId: string; order: number }[]
) => {
  const lesson = await topicRepo.findLessonById(lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found.');

  try {
    await topicRepo.reorderTopicsTx(lessonId, topics);
  } catch (err) {
    throw new ApiError(400, err instanceof Error ? err.message : 'Failed to reorder topics.');
  }
};