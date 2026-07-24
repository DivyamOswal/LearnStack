import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { DashboardSummary } from './studentDashboard.types';
import { BookmarkedCourse } from './studentDashboard.types';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['users', 'dashboard'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<DashboardSummary>>('/users/dashboard');
      return data.data;
    },
  });
};

export const useMyBookmarks = () => {
  return useQuery({
    queryKey: ['bookmarks', 'my'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<BookmarkedCourse[]>>('/users/bookmarks');
      return data.data;
    },
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await axiosInstance.patch<ApiResponse<{ bookmarked: boolean }>>(`/users/bookmarks/${courseId}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks', 'my'] });
    },
  });
};