import { z } from 'zod';

const emptyParams = z.object({}).optional();
const emptyQuery = z.object({}).optional();

export const createCheckoutSessionSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('Invalid course ID'),
    couponCode: z.string().optional(),
  }),
  params: emptyParams,
  query: emptyQuery,
});

export const orderIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const listOrdersSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
  params: emptyParams,
  body: z.object({}).optional(),
});