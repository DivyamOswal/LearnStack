export type QuestionType = 'MCQ' | 'MULTIPLE_ANSWER' | 'TRUE_FALSE' | 'CODING' | 'FILL_IN_BLANK';

export interface QuizSummary {
  id: string;
  title: string;
  timeLimitMins: number | null;
  negativeMarking: boolean;
  passingScore: number;
  _count: { questions: number };
}

export interface AnswerOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
  points: number;
  answers: AnswerOption[];
}

export interface QuizForAttempt {
  id: string;
  title: string;
  timeLimitMins: number | null;
  negativeMarking: boolean;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface SubmitAnswerInput {
  questionId: string;
  selectedAnswerIds: string[];
}

export interface QuizAttemptResult {
  id: string;
  score: number;
  passed: boolean;
  rawScore: number;
  maxPossibleScore: number;
  attemptedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  score: number;
  passed: boolean;
  attemptedAt: string;
  user: { id: string; name: string; avatarUrl: string | null };
}