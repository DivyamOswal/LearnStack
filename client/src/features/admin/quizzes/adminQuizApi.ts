import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { AdminQuizDetail, CreateQuizInput, CreateQuestionInput } from './adminQuiz.types';

export const useAdminQuizDetail = (quizId: string) => {
  return useQuery({
    queryKey: ['admin', 'quizzes', quizId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<AdminQuizDetail>>(`/quizzes/admin/${quizId}`);
      return data.data;
    },
    enabled: Boolean(quizId),
  });
};

export const useCreateQuiz = () => {
  return useMutation({
    mutationFn: async (input: CreateQuizInput) => {
      const { data } = await axiosInstance.post<ApiResponse<AdminQuizDetail>>('/quizzes', input);
      return data.data;
    },
  });
};

export const useCreateQuestion = (quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateQuestionInput) => {
      const { data } = await axiosInstance.post<ApiResponse<AdminQuizDetail['questions'][number]>>(
        `/quizzes/${quizId}/questions`,
        input
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quizzes', quizId] });
    },
  });
};

export const useDeleteQuestion = (quizId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (questionId: string) => {
      await axiosInstance.delete(`/quizzes/questions/${questionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quizzes', quizId] });
    },
  });
};