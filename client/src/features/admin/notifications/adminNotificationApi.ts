import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { BroadcastNotificationInput, BroadcastResult } from '../../admin/notifications/adminNotifications.types';

export const useBroadcastNotification = () => {
  return useMutation({
    mutationFn: async (input: BroadcastNotificationInput) => {
      const { data } = await axiosInstance.post<ApiResponse<BroadcastResult>>('/notifications/broadcast', input);
      return data.data;
    },
  });
};