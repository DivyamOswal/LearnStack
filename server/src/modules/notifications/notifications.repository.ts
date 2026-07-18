import { Prisma, Role } from '@prisma/client';
import prisma from '../../config/db';
import { CreateNotificationInput } from './notifications.types';

export const createNotification = (input: CreateNotificationInput) => {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      message: input.message,
    },
  });
};

export const createManyNotifications = (userIds: string[], title: string, message: string) => {
  return prisma.notification.createMany({
    data: userIds.map((userId) => ({ userId, title, message })),
  });
};

export const findUserIdsByRole = async (targetRole: 'STUDENT' | 'ADMIN' | 'ALL') => {
  const where: Prisma.UserWhereInput =
    targetRole === 'ALL' ? {} : { role: targetRole as Role };

  const users = await prisma.user.findMany({ where, select: { id: true } });
  return users.map((u) => u.id);
};

export const findNotificationsForUser = async (
  userId: string,
  { page = 1, limit = 20, unreadOnly = false }: { page?: number; limit?: number; unreadOnly?: boolean }
) => {
  const skip = (page - 1) * limit;
  const where: Prisma.NotificationWhereInput = {
    userId,
    ...(unreadOnly ? { isRead: false } : {}),
  };

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return { notifications, total, page, limit, totalPages: Math.ceil(total / limit), unreadCount };
};

export const findNotificationById = (id: string) => {
  return prisma.notification.findUnique({ where: { id } });
};

export const markAsRead = (id: string) => {
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
};

export const markAllAsReadForUser = (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

export const deleteNotification = (id: string) => {
  return prisma.notification.delete({ where: { id } });
};