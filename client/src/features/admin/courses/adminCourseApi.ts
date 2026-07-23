import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { AdminCourseListItem, CreateCourseInput, AdminCourseDetail, AdminChapter, Category } from './adminCourse.types';

export const useAdminCourseList = (page: number) => {
  return useQuery({
    queryKey: ['admin', 'courses', page],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<{ courses: AdminCourseListItem[] } & PaginatedResponse<AdminCourseListItem>>>(
        '/courses/admin/all',
        { params: { page, limit: 10 } }
      );
      return data.data;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<Category[]>>('/admin/categories');
      return data.data;
    },
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCourseInput) => {
      const formData = new FormData();
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, String(value));
      });

      const { data } = await axiosInstance.post<ApiResponse<AdminCourseDetail>>('/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
};

export const useAdminCourseDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'courses', 'detail', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<AdminCourseDetail>>(`/courses/admin/${id}`);
      return data.data;
    },
    enabled: Boolean(id),
  });
};

export const useChaptersForCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['admin', 'chapters', courseId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<AdminChapter[]>>(`/chapters/course/${courseId}`);
      return data.data;
    },
    enabled: Boolean(courseId),
  });
};

export const useCreateChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { title: string; order: number; courseId: string }) => {
      const { data } = await axiosInstance.post<ApiResponse<AdminChapter>>('/chapters', input);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'chapters', variables.courseId] });
    },
  });
};

export const useTogglePublish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const { data } = await axiosInstance.patch<ApiResponse<AdminCourseDetail>>(`/courses/${id}`, { isPublished });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      input,
      videoFile,
      pdfFile,
    }: {
      input: CreateLessonInput;
      videoFile?: File;
      pdfFile?: File;
    }) => {
      const formData = new FormData();
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, String(value));
      });
      if (videoFile) formData.append('video', videoFile);
      if (pdfFile) formData.append('pdf', pdfFile);

      const { data } = await axiosInstance.post<ApiResponse<AdminLesson>>('/lessons', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the chapter list for the course this lesson's chapter belongs to —
      // we don't have courseId here directly, so the caller passes chapterId's parent
      // course invalidation explicitly (handled by the component below).
      queryClient.invalidateQueries({ queryKey: ['admin', 'chapters'] });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/lessons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'chapters'] });
    },
  });
};