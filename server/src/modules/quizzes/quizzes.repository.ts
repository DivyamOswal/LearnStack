import prisma from '../../config/db';
import { CreateQuizInput, UpdateQuizInput, CreateQuestionInput } from './quizzes.types';

export const findCourseById = (courseId: string) => {
  return prisma.course.findUnique({ where: { id: courseId } });
};

export const createQuiz = (input: CreateQuizInput) => {
  return prisma.quiz.create({
    data: {
      title: input.title,
      courseId: input.courseId,
      timeLimitMins: input.timeLimitMins,
      negativeMarking: input.negativeMarking ?? false,
      passingScore: input.passingScore ?? 50,
    },
  });
};

export const findQuizzesByCourse = (courseId: string) => {
  return prisma.quiz.findMany({
    where: { courseId },
    select: {
      id: true,
      title: true,
      timeLimitMins: true,
      negativeMarking: true,
      passingScore: true,
      _count: { select: { questions: true } },
    },
  });
};

// For students: quiz + questions + answer TEXT, but never expose isCorrect.
export const findQuizForAttempt = (id: string) => {
  return prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          text: true,
          type: true,
          order: true,
          points: true,
          answers: {
            select: { id: true, text: true }, // isCorrect deliberately excluded
          },
        },
      },
    },
  });
};

// For admin: full quiz including which answers are correct.
export const findQuizForAdmin = (id: string) => {
  return prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: { answers: true },
      },
    },
  });
};

// Internal use only (scoring) — includes correct answers.
export const findQuizWithCorrectAnswers = (id: string) => {
  return prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        include: { answers: true },
      },
    },
  });
};

export const updateQuiz = (id: string, input: UpdateQuizInput) => {
  return prisma.quiz.update({
    where: { id },
    data: {
      ...(input.title ? { title: input.title } : {}),
      ...(input.timeLimitMins !== undefined ? { timeLimitMins: input.timeLimitMins } : {}),
      ...(input.negativeMarking !== undefined ? { negativeMarking: input.negativeMarking } : {}),
      ...(input.passingScore !== undefined ? { passingScore: input.passingScore } : {}),
    },
  });
};

export const deleteQuiz = (id: string) => {
  return prisma.quiz.delete({ where: { id } });
};

export const createQuestion = (quizId: string, input: CreateQuestionInput) => {
  return prisma.question.create({
    data: {
      quizId,
      text: input.text,
      type: input.type,
      order: input.order,
      points: input.points ?? 1,
      answers: {
        create: input.answers.map((a) => ({ text: a.text, isCorrect: a.isCorrect })),
      },
    },
    include: { answers: true },
  });
};

export const deleteQuestion = (id: string) => {
  return prisma.question.delete({ where: { id } });
};

export const createAttempt = (data: {
  userId: string;
  quizId: string;
  score: number;
  passed: boolean;
  answers: Record<string, string[]>;
}) => {
  return prisma.quizAttempt.create({ data });
};

export const findAttemptsForUserAndQuiz = (userId: string, quizId: string) => {
  return prisma.quizAttempt.findMany({
    where: { userId, quizId },
    orderBy: { attemptedAt: 'desc' },
  });
};

// Leaderboard: best score per user for this quiz, ranked descending.
export const findLeaderboardForQuiz = async (quizId: string, limitCount = 10) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    orderBy: { score: 'desc' },
  });

  // Keep only each user's best attempt, preserving score-descending order.
  const bestPerUser = new Map<string, (typeof attempts)[number]>();
  for (const attempt of attempts) {
    const existing = bestPerUser.get(attempt.userId);
    if (!existing || attempt.score > existing.score) {
      bestPerUser.set(attempt.userId, attempt);
    }
  }

  return Array.from(bestPerUser.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limitCount);
};