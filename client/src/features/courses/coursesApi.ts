import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { CourseDetail, CourseListParams, CourseListResult } from './course.types'

export const useCourseList = (params: CourseListParams) => {
  return useQuery({
    queryKey: ['courses', 'list', params],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<CourseListResult>>('/courses', { params });
      return data.data;
    },
  });
};

export const useCourseBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['courses', 'detail', slug],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<CourseDetail>>(`/courses/${slug}`);
      return data.data;
    },
    enabled: Boolean(slug),
  });
};