import { z } from 'zod';
import { QuestionType } from '@prisma/client';

const emptyParams = z.object({}).optional();
const emptyQuery = z.object({}).optional();

export const createQuizSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200),
    courseId: z.string().uuid('Invalid course ID'),
    timeLimitMins: z.coerce.number().int().min(1).optional(),
    negativeMarking: z.coerce.boolean().optional(),
    passingScore: z.coerce.number().int().min(0).max(100).optional(),
  }),
  params: emptyParams,
  query: emptyQuery,
});

export const updateQuizSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    timeLimitMins: z.coerce.number().int().min(1).optional(),
    negativeMarking: z.coerce.boolean().optional(),
    passingScore: z.coerce.number().int().min(0).max(100).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: emptyQuery,
});

const answerSchema = z.object({
  text: z.string().min(1, 'Answer text is required'),
  isCorrect: z.boolean(),
});

export const createQuestionSchema = z.object({
  body: z
    .object({
      text: z.string().min(3, 'Question text must be at least 3 characters'),
      type: z.nativeEnum(QuestionType),
      order: z.coerce.number().int().min(1),
      points: z.coerce.number().int().min(1).optional(),
      answers: z.array(answerSchema).min(2, 'At least 2 answer options are required'),
    })
    .refine(
      (data) => data.answers.some((a) => a.isCorrect),
      { message: 'At least one answer must be marked correct', path: ['answers'] }
    )
    .refine(
      (data) =>
        data.type !== QuestionType.TRUE_FALSE || data.answers.length === 2,
      { message: 'TRUE_FALSE questions must have exactly 2 answers', path: ['answers'] }
    )
    .refine(
      (data) =>
        data.type === QuestionType.MULTIPLE_ANSWER ||
        data.answers.filter((a) => a.isCorrect).length === 1,
      { message: 'Only MULTIPLE_ANSWER questions can have more than one correct answer', path: ['answers'] }
    ),
  params: z.object({
    quizId: z.string().uuid(),
  }),
  query: emptyQuery,
});

export const quizIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const questionIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const courseIdParamSchema = z.object({
  params: z.object({
    courseId: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const submitQuizAttemptSchema = z.object({
  body: z.object({
    answers: z
      .array(
        z.object({
          questionId: z.string().uuid(),
          selectedAnswerIds: z.array(z.string().uuid()),
        })
      )
      .min(1, 'At least one answer is required'),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: emptyQuery,
});