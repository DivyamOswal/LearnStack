import { z } from 'zod';

const emptyParams = z.object({}).optional();
const emptyQuery = z.object({}).optional();

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
    bio: z.string().max(500).optional(),
    socialLinks: z.record(z.string().url('Each social link must be a valid URL')).optional(),
  }),
  params: emptyParams,
  query: emptyQuery,
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters')
        .regex(/[A-Z]/, 'New password must contain an uppercase letter')
        .regex(/[0-9]/, 'New password must contain a number'),
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: 'New password must be different from the current password',
      path: ['newPassword'],
    }),
  params: emptyParams,
  query: emptyQuery,
});

export const courseIdParamSchema = z.object({
  params: z.object({
    courseId: z.string().uuid('Invalid course ID'),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});