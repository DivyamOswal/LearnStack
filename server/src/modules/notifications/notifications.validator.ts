import { z } from 'zod';

const emptyParams = z.object({}).optional();
const emptyQuery = z.object({}).optional();

export const notificationIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: emptyQuery,
});

export const broadcastNotificationSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Title must be at least 2 characters').max(150),
    message: z.string().min(2, 'Message must be at least 2 characters').max(1000),
    targetRole: z.enum(['STUDENT', 'ADMIN', 'ALL']).default('ALL'),
  }),
  params: emptyParams,
  query: emptyQuery,
});

export const listNotificationsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    unreadOnly: z.string().optional(),
  }),
  params: emptyParams,
  body: z.object({}).optional(),
});