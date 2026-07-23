import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { AdminCoupon, CreateCouponInput } from './adminCoupon.types';

export const useAdminCoupons = () => {
  return useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<AdminCoupon[]>>('/admin/coupons');
      return data.data;
    },
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCouponInput) => {
      const { data } = await axiosInstance.post<ApiResponse<AdminCoupon>>('/admin/coupons', input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
};

export const useToggleCouponActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data } = await axiosInstance.patch<ApiResponse<AdminCoupon>>(`/admin/coupons/${id}`, { isActive });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
};