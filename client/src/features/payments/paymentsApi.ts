import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { CreateCheckoutSessionPayload, CheckoutSessionResult, PricingBreakdown, OrderStatusResult } from './payment.types';

export const usePreviewPricing = () => {
  return useMutation({
    mutationFn: async (payload: CreateCheckoutSessionPayload) => {
      const { data } = await axiosInstance.post<ApiResponse<PricingBreakdown>>('/payments/preview', payload);
      return data.data;
    },
  });
};

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: async (payload: CreateCheckoutSessionPayload) => {
      const { data } = await axiosInstance.post<ApiResponse<CheckoutSessionResult>>('/payments/checkout', payload);
      return data.data;
    },
    // No redirect here anymore — CheckoutPage controls the redirect explicitly,
    // since we want the user to confirm the final price first.
  });
};

export const useOrderStatus = (orderId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['payments', 'order-status', orderId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<OrderStatusResult>>(`/payments/${orderId}/status`);
      return data.data;
    },
    enabled,
    refetchInterval: (query) => (query.state.data?.status === 'PENDING' ? 1500 : false),
  });
};

export const useEnrollmentStatus = (courseId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['payments', 'enrollment', courseId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<{ isEnrolled: boolean }>>(`/payments/enrollment/${courseId}`);
      return data.data;
    },
    enabled,
  });
};
