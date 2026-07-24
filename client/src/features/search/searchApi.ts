import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { SearchResults } from './search.types';

export const useGlobalSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<SearchResults>>('/courses/search', { params: { q: query } });
      return data.data;
    },
    enabled: query.trim().length >= 2,
  });
};