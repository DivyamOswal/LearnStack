export type QuestionType = 'MCQ' | 'MULTIPLE_ANSWER' | 'TRUE_FALSE' | 'CODING' | 'FILL_IN_BLANK';

export interface AdminAnswer {
  text: string;
  isCorrect: boolean;
}

export interface AdminQuestion {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
  points: number;
  answers: { id: string; text: string; isCorrect: boolean }[];
}

export interface AdminQuizDetail {
  id: string;
  title: string;
  timeLimitMins: number | null;
  negativeMarking: boolean;
  passingScore: number;
  questions: AdminQuestion[];
}

export interface CreateQuizInput {
  title: string;
  courseId: string;
  timeLimitMins?: number;
  negativeMarking?: boolean;
  passingScore?: number;
}

export interface CreateQuestionInput {
  text: string;
  type: QuestionType;
  order: number;
  points?: number;
  answers: AdminAnswer[];
}