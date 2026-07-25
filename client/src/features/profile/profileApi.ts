import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { UserProfile, UpdateProfileInput, ChangePasswordInput } from './profile.types';

export const useProfile = () => {
  return useQuery({
    queryKey: ['users', 'profile'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<UserProfile>>('/users/profile');
      return data.data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ input, avatarFile }: { input: UpdateProfileInput; avatarFile?: File }) => {
      const formData = new FormData();
      if (input.name) formData.append('name', input.name);
      if (input.bio !== undefined) formData.append('bio', input.bio);
      if (input.socialLinks) formData.append('socialLinks', JSON.stringify(input.socialLinks));
      if (avatarFile) formData.append('avatar', avatarFile);

      const { data } = await axiosInstance.patch<ApiResponse<UserProfile>>('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (input: ChangePasswordInput) => {
      const { data } = await axiosInstance.patch<ApiResponse<null>>('/users/change-password', input);
      return data.message;
    },
  });
};