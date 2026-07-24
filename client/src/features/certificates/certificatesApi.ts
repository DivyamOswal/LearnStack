import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { CertificateListItem, CertificateVerifyResult } from './certificate.types';

export const useMyCertificates = () => {
  return useQuery({
    queryKey: ['certificates', 'my'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<CertificateListItem[]>>('/certificates/my');
      return data.data;
    },
  });
};

export const useGenerateCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await axiosInstance.post<ApiResponse<CertificateListItem>>('/certificates/generate', { courseId });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates', 'my'] });
    },
  });
};

export const useVerifyCertificate = (code: string) => {
  return useQuery({
    queryKey: ['certificates', 'verify', code],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ApiResponse<CertificateVerifyResult>>(`/certificates/verify/${code}`);
      return data.data;
    },
    enabled: Boolean(code),
    retry: false,
  });
};