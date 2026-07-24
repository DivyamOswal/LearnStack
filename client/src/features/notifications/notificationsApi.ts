import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { NotificationListResult } from './notification.types';

export const useMyNotifications = () => {
  return useQuery({
    queryKey: ['notifications', 'my'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<NotificationListResult>>('/notifications/my', {
        params: { limit: 10 },
      });
      return data.data;
    },
    refetchInterval: 30000, // poll every 30s for new notifications
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'my'] });
    },
  });
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.patch('/notifications/mark-all-read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'my'] });
    },
  });
};