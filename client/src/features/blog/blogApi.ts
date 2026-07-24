import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { BlogListResult, BlogPost, CreateBlogInput } from './blog.types';

export const usePublicBlogs = (page: number) => {
  return useQuery({
    queryKey: ['blog', 'public', page],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<BlogListResult>>('/blog', { params: { page, limit: 9 } });
      return data.data;
    },
  });
};

export const useBlogBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['blog', 'detail', slug],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<BlogPost>>(`/blog/${slug}`);
      return data.data;
    },
    enabled: Boolean(slug),
  });
};

export const useAdminBlogs = (page: number) => {
  return useQuery({
    queryKey: ['admin', 'blog', page],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<BlogListResult>>('/blog/admin/all', { params: { page, limit: 15 } });
      return data.data;
    },
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ input, coverImage }: { input: CreateBlogInput; coverImage?: File }) => {
      const formData = new FormData();
      formData.append('title', input.title);
      formData.append('content', input.content);
      if (input.isPublished !== undefined) formData.append('isPublished', String(input.isPublished));
      if (coverImage) formData.append('coverImage', coverImage);

      const { data } = await axiosInstance.post<ApiResponse<BlogPost>>('/blog', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'public'] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
    },
  });
};

export const useTogglePublishBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const formData = new FormData();
      formData.append('isPublished', String(isPublished));
      const { data } = await axiosInstance.patch<ApiResponse<BlogPost>>(`/blog/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'public'] });
    },
  });
};