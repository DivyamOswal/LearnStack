import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { AdminUserListItem, AdminUserListParams, Role } from './adminUser.types';

export const useAdminUserList = (params: AdminUserListParams) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<{ users: AdminUserListItem[] } & PaginatedResponse<AdminUserListItem>>>(
        '/admin/users',
        { params }
      );
      return data.data;
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: Role }) => {
      const { data } = await axiosInstance.patch<ApiResponse<AdminUserListItem>>(`/admin/users/${id}/role`, { role });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};