import { QuestionType } from '@prisma/client';

export interface CreateQuizInput {
  title: string;
  courseId: string;
  timeLimitMins?: number;
  negativeMarking?: boolean;
  passingScore?: number;
}

export interface UpdateQuizInput {
  title?: string;
  timeLimitMins?: number;
  negativeMarking?: boolean;
  passingScore?: number;
}

export interface CreateQuestionInput {
  quizId: string;
  text: string;
  type: QuestionType;
  order: number;
  points?: number;
  answers: { text: string; isCorrect: boolean }[];
}

export interface UpdateQuestionInput {
  text?: string;
  type?: QuestionType;
  order?: number;
  points?: number;
  answers?: { text: string; isCorrect: boolean }[];
}

export interface SubmitQuizInput {
  quizId: string;
  answers: {
    questionId: string;
    selectedAnswerIds: string[]; // supports MCQ (1), multi-answer (many), true/false (1)
  }[];
}