import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { LessonDetail, SidebarChapter, ProgressSummary } from './learning.types';

export const useLessonDetail = (lessonId: string) => {
  return useQuery({
    queryKey: ['lessons', 'detail', lessonId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<LessonDetail>>(`/lessons/${lessonId}`);
      return data.data;
    },
    enabled: Boolean(lessonId),
  });
};

export const useChaptersForCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['chapters', 'course', courseId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<SidebarChapter[]>>(`/chapters/course/${courseId}`);
      return data.data;
    },
    enabled: Boolean(courseId),
  });
};

export const useCourseProgress = (courseId: string) => {
  return useQuery({
    queryKey: ['progress', 'summary', courseId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<ProgressSummary>>(`/progress/course/${courseId}/summary`);
      return data.data;
    },
    enabled: Boolean(courseId),
  });
};

export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lessonId: string) => {
      const { data } = await axiosInstance.post<ApiResponse<unknown>>('/progress/complete', { lessonId });
      return data.data;
    },
    onSuccess: (_, lessonId) => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['lessons', 'detail', lessonId] });
    },
  });
};

export interface DetailedProgressEntry {
  lessonId: string;
  completed: boolean;
}

export const useDetailedProgress = (courseId: string) => {
  return useQuery({
    queryKey: ['progress', 'detailed', courseId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<{ lessonId: string; completed: boolean }[]>>(
        `/progress/course/${courseId}/detailed`
      );
      return data.data;
    },
    enabled: Boolean(courseId),
  });
};