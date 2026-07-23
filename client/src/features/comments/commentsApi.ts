import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { CommentThread } from './comment.types';

export const useCommentsForLesson = (lessonId: string) => {
  return useQuery({
    queryKey: ['comments', 'lesson', lessonId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<CommentThread[]>>(`/comments/lesson/${lessonId}`);
      return data.data;
    },
    enabled: Boolean(lessonId),
  });
};

export const useCreateComment = (lessonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ content, parentId }: { content: string; parentId?: string }) => {
      const { data } = await axiosInstance.post<ApiResponse<CommentThread>>('/comments', { content, lessonId, parentId });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'lesson', lessonId] });
    },
  });
};

export const useLikeComment = (lessonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      await axiosInstance.patch(`/comments/${commentId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'lesson', lessonId] });
    },
  });
};

export const useReportComment = () => {
  return useMutation({
    mutationFn: async (commentId: string) => {
      await axiosInstance.post(`/comments/${commentId}/report`);
    },
  });
};

export const useDeleteComment = (lessonId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      await axiosInstance.delete(`/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'lesson', lessonId] });
    },
  });
};