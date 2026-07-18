import { z } from 'zod';

const emptyParams = z.object({}).optional();
const emptyQuery = z.object({}).optional();

export const generateCertificateSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('Invalid course ID'),
  }),
  params: emptyParams,
  query: emptyQuery,
});

export const certificateIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const certificateCodeParamSchema = z.object({
  params: z.object({
    code: z.string().min(1, 'Certificate code is required'),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});