import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { useAppDispatch } from '@/app/hooks';
import { setUser, clearUser } from './authSlice';
import {
  User,
  LoginPayload,
  RegisterPayload,
  GoogleLoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from './auth.types';

// ---------- Queries ----------
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<User>>('/auth/me');
      return data.data;
    },
    retry: false,
  });
};

// ---------- Mutations ----------

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await axiosInstance.post<ApiResponse<{ user: User }>>('/auth/login', payload);
      return data.data.user;
    },
    onSuccess: (user) => {
      dispatch(setUser(user));
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await axiosInstance.post<ApiResponse<{ id: string; name: string; email: string }>>(
        '/auth/register',
        payload
      );
      return data.data;
    },
  });
};

export const useGoogleLogin = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: GoogleLoginPayload) => {
      const { data } = await axiosInstance.post<ApiResponse<{ user: User }>>('/auth/google', payload);
      return data.data.user;
    },
    onSuccess: (user) => {
      dispatch(setUser(user));
      queryClient.setQueryData(['auth', 'me'], user);
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post('/auth/logout');
    },
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.clear(); // wipe every cached query — a new user shouldn't see the old user's cached data
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      const { data } = await axiosInstance.post<ApiResponse<null>>('/auth/forgot-password', payload);
      return data.message;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const { data } = await axiosInstance.post<ApiResponse<null>>('/auth/reset-password', payload);
      return data.message;
    },
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (token: string) => {
      const { data } = await axiosInstance.post<ApiResponse<null>>('/auth/verify-email', { token });
      return data.message;
    },
  });
};