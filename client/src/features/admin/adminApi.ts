import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { DashboardStats, PopularCourse, MonthlyRevenue } from './adminDashboard.types';

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
      return data.data;
    },
  });
};

export const usePopularCoursesReport = () => {
  return useQuery({
    queryKey: ['admin', 'reports', 'popular-courses'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<PopularCourse[]>>('/admin/reports/popular-courses');
      return data.data;
    },
  });
};

export const useRevenueReport = () => {
  return useQuery({
    queryKey: ['admin', 'reports', 'revenue'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<MonthlyRevenue[]>>('/admin/reports/revenue');
      return data.data;
    },
  });
};