import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { CreateCheckoutSessionPayload, CheckoutSessionResult } from './payment.types';

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: async (payload: CreateCheckoutSessionPayload) => {
      const { data } = await axiosInstance.post<ApiResponse<CheckoutSessionResult>>('/payments/checkout', payload);
      return data.data;
    },
    onSuccess: (result) => {
      // Redirect to Stripe's hosted checkout page LearnStack matches the backend's
      // redirect-based flow rather than an embedded payment form.
      window.location.href = result.checkoutUrl;
    },
  });
};