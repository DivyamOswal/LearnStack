import { ApiError } from '../../utils/ApiError';
import * as quizRepo from './quizzes.repository';
import {
  CreateQuizInput,
  UpdateQuizInput,
  CreateQuestionInput,
  SubmitQuizAttemptInput,
} from './quiz.types';

export const addQuiz = async (input: CreateQuizInput) => {
  const course = await quizRepo.findCourseById(input.courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  return quizRepo.createQuiz(input);
};

export const getQuizzesForCourse = async (courseId: string) => {
  const course = await quizRepo.findCourseById(courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  return quizRepo.findQuizzesByCourse(courseId);
};

export const getQuizForStudent = async (id: string) => {
  const quiz = await quizRepo.findQuizForAttempt(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found.');
  if (quiz.questions.length === 0) {
    throw new ApiError(400, 'This quiz has no questions yet.');
  }
  return quiz;
};

export const getQuizForAdmin = async (id: string) => {
  const quiz = await quizRepo.findQuizForAdmin(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found.');
  return quiz;
};

export const editQuiz = async (id: string, input: UpdateQuizInput) => {
  const quiz = await quizRepo.findQuizForAdmin(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found.');
  return quizRepo.updateQuiz(id, input);
};

export const removeQuiz = async (id: string) => {
  const quiz = await quizRepo.findQuizForAdmin(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found.');
  return quizRepo.deleteQuiz(id);
};

export const addQuestion = async (quizId: string, input: CreateQuestionInput) => {
  const quiz = await quizRepo.findQuizForAdmin(quizId);
  if (!quiz) throw new ApiError(404, 'Quiz not found.');
  return quizRepo.createQuestion(quizId, input);
};

export const removeQuestion = async (id: string) => {
  return quizRepo.deleteQuestion(id);
};

// ---------- Scoring ----------

export const submitAttempt = async (
  userId: string,
  quizId: string,
  input: SubmitQuizAttemptInput
) => {
  const quiz = await quizRepo.findQuizWithCorrectAnswers(quizId);
  if (!quiz) throw new ApiError(404, 'Quiz not found.');
  if (quiz.questions.length === 0) {
    throw new ApiError(400, 'This quiz has no questions.');
  }

  let totalScore = 0;
  const answersMap: Record<string, string[]> = {};

  for (const submitted of input.answers) {
    const question = quiz.questions.find((q) => q.id === submitted.questionId);
    if (!question) continue; // ignore answers for questions not in this quiz

    answersMap[submitted.questionId] = submitted.selectedAnswerIds;

    const correctAnswerIds = question.answers.filter((a) => a.isCorrect).map((a) => a.id);
    const selectedIds = submitted.selectedAnswerIds;

    const isExactMatch =
      selectedIds.length === correctAnswerIds.length &&
      selectedIds.every((id) => correctAnswerIds.includes(id));

    if (isExactMatch) {
      totalScore += question.points;
    } else if (quiz.negativeMarking && selectedIds.length > 0) {
      // Negative marking only applies to an attempted-but-wrong answer,
      // never to a question left blank.
      totalScore -= question.points;
    }
  }

  // Score can't go negative overall even with negative marking enabled.
  totalScore = Math.max(0, totalScore);

  const maxPossibleScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const percentageScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  const passed = percentageScore >= quiz.passingScore;

  const attempt = await quizRepo.createAttempt({
    userId,
    quizId,
    score: percentageScore,
    passed,
    answers: answersMap,
  });

  return { ...attempt, maxPossibleScore, rawScore: totalScore };
};

export const getMyAttempts = async (userId: string, quizId: string) => {
  return quizRepo.findAttemptsForUserAndQuiz(userId, quizId);
};

export const getLeaderboard = async (quizId: string) => {
  const quiz = await quizRepo.findQuizForAdmin(quizId);
  if (!quiz) throw new ApiError(404, 'Quiz not found.');
  return quizRepo.findLeaderboardForQuiz(quizId);
};