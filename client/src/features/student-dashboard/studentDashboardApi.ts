import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { DashboardSummary } from './studentDashboard.types';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['users', 'dashboard'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<DashboardSummary>>('/users/dashboard');
      return data.data;
    },
  });
};