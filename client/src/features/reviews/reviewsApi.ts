import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { ReviewListResult, RatingDistribution } from './review.types';

export const useReviewsForCourse = (courseId: string, page: number) => {
  return useQuery({
    queryKey: ['reviews', 'course', courseId, page],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<ReviewListResult>>(`/reviews/course/${courseId}`, {
        params: { page, limit: 10 },
      });
      return data.data;
    },
    enabled: Boolean(courseId),
  });
};

export const useRatingDistribution = (courseId: string) => {
  return useQuery({
    queryKey: ['reviews', 'distribution', courseId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<RatingDistribution>>(`/reviews/course/${courseId}/distribution`);
      return data.data;
    },
    enabled: Boolean(courseId),
  });
};

export const useCreateReview = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment?: string }) => {
      const { data } = await axiosInstance.post<ApiResponse<unknown>>('/reviews', { courseId, rating, comment });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'distribution', courseId] });
    },
  });
};