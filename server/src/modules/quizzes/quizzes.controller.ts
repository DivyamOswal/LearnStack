import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import * as quizService from './quizzes.service';

export const createQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await quizService.addQuiz(req.body);
  res.status(201).json(new ApiResponse(201, quiz, 'Quiz created successfully.'));
});

export const getQuizzesForCourse = asyncHandler(async (req: Request, res: Response) => {
  const quizzes = await quizService.getQuizzesForCourse(req.params.courseId);
  res.status(200).json(new ApiResponse(200, quizzes, 'Quizzes fetched.'));
});

export const getQuizForStudent = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await quizService.getQuizForStudent(req.params.id);
  res.status(200).json(new ApiResponse(200, quiz, 'Quiz fetched.'));
});

export const getQuizForAdmin = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await quizService.getQuizForAdmin(req.params.id);
  res.status(200).json(new ApiResponse(200, quiz, 'Quiz fetched.'));
});

export const updateQuiz = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await quizService.editQuiz(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, quiz, 'Quiz updated.'));
});

export const deleteQuiz = asyncHandler(async (req: Request, res: Response) => {
  await quizService.removeQuiz(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Quiz deleted.'));
});

export const createQuestion = asyncHandler(async (req: Request, res: Response) => {
  const question = await quizService.addQuestion(req.params.quizId, req.body);
  res.status(201).json(new ApiResponse(201, question, 'Question added successfully.'));
});

export const deleteQuestion = asyncHandler(async (req: Request, res: Response) => {
  await quizService.removeQuestion(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Question deleted.'));
});

export const submitAttempt = asyncHandler(async (req: Request, res: Response) => {
  const result = await quizService.submitAttempt(req.user!.id, req.params.id, req.body);
  res.status(201).json(new ApiResponse(201, result, 'Quiz submitted successfully.'));
});

export const getMyAttempts = asyncHandler(async (req: Request, res: Response) => {
  const attempts = await quizService.getMyAttempts(req.user!.id, req.params.id);
  res.status(200).json(new ApiResponse(200, attempts, 'Your attempts fetched.'));
});

export const getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
  const leaderboard = await quizService.getLeaderboard(req.params.id);
  res.status(200).json(new ApiResponse(200, leaderboard, 'Leaderboard fetched.'));
});