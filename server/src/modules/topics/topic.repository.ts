import prisma from '../../config/db';
import { CreateTopicInput, UpdateTopicInput } from './topic.types';

export const findLessonById = (lessonId: string) => {
  return prisma.lesson.findUnique({ where: { id: lessonId } });
};

export const findTopicByLessonAndOrder = (lessonId: string, order: number) => {
  return prisma.topic.findUnique({
    where: { lessonId_order: { lessonId, order } },
  });
};

export const createTopic = (input: CreateTopicInput) => {
  return prisma.topic.create({
    data: {
      title: input.title,
      content: input.content,
      order: input.order,
      lessonId: input.lessonId,
    },
  });
};

export const findTopicsByLesson = (lessonId: string) => {
  return prisma.topic.findMany({
    where: { lessonId },
    orderBy: { order: 'asc' },
  });
};

export const findTopicById = (id: string) => {
  return prisma.topic.findUnique({ where: { id } });
};

export const updateTopic = (id: string, input: UpdateTopicInput) => {
  return prisma.topic.update({
    where: { id },
    data: {
      ...(input.title ? { title: input.title } : {}),
      ...(input.content ? { content: input.content } : {}),
      ...(input.order !== undefined ? { order: input.order } : {}),
    },
  });
};

export const deleteTopic = (id: string) => {
  return prisma.topic.delete({ where: { id } });
};

export const reorderTopicsTx = async (
  lessonId: string,
  topics: { topicId: string; order: number }[]
) => {
  return prisma.$transaction(async (tx) => {
    for (const { topicId } of topics) {
      const topic = await tx.topic.findUnique({ where: { id: topicId } });
      if (!topic || topic.lessonId !== lessonId) {
        throw new Error(`Topic ${topicId} does not belong to lesson ${lessonId}`);
      }
    }

    await Promise.all(
      topics.map(({ topicId }, index) =>
        tx.topic.update({ where: { id: topicId }, data: { order: -(index + 1) } })
      )
    );

    await Promise.all(
      topics.map(({ topicId, order }) =>
        tx.topic.update({ where: { id: topicId }, data: { order } })
      )
    );
  });
};