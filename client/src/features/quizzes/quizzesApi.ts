import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { QuizSummary, QuizForAttempt, SubmitAnswerInput, QuizAttemptResult, LeaderboardEntry } from './quiz.types';

export const useQuizzesForCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['quizzes', 'course', courseId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<QuizSummary[]>>(`/quizzes/course/${courseId}`);
      return data.data;
    },
    enabled: Boolean(courseId),
  });
};

export const useQuizForAttempt = (quizId: string) => {
  return useQuery({
    queryKey: ['quizzes', 'attempt', quizId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<QuizForAttempt>>(`/quizzes/${quizId}`);
      return data.data;
    },
    enabled: Boolean(quizId),
  });
};

export const useSubmitQuizAttempt = (quizId: string) => {
  return useMutation({
    mutationFn: async (answers: SubmitAnswerInput[]) => {
      const { data } = await axiosInstance.post<ApiResponse<QuizAttemptResult>>(`/quizzes/${quizId}/submit`, { answers });
      return data.data;
    },
  });
};

export const useQuizLeaderboard = (quizId: string) => {
  return useQuery({
    queryKey: ['quizzes', 'leaderboard', quizId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<LeaderboardEntry[]>>(`/quizzes/${quizId}/leaderboard`);
      return data.data;
    },
    enabled: Boolean(quizId),
  });
};