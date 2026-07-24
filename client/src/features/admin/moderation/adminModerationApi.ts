import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { ReportedComment } from './adminModeration.types';

export const useReportedComments = () => {
  return useQuery({
    queryKey: ['admin', 'moderation', 'reported'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<ReportedComment[]>>('/comments/admin/reported');
      return data.data;
    },
  });
};

export const useDismissReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      const { data } = await axiosInstance.patch<ApiResponse<ReportedComment>>(`/comments/admin/${commentId}/dismiss-report`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation', 'reported'] });
    },
  });
};

export const useDeleteReportedComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      await axiosInstance.delete(`/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation', 'reported'] });
    },
  });
};