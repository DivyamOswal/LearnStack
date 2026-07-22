import { ApiError } from '../../utils/ApiError';
import * as notificationRepo from './notifications.repository';
import { BroadcastNotificationInput } from './notifications.types';

// ---------- Internal API LearnStack called by OTHER modules, not exposed as a route ----------
// e.g. certificate.service.ts calling this after issuing a certificate,
// comment.service.ts calling this after a reply is posted, etc.
export const notifyUser = async (userId: string, title: string, message: string) => {
  return notificationRepo.createNotification({ userId, title, message });
};

// ---------- Admin-facing ----------
export const broadcastNotification = async (input: BroadcastNotificationInput) => {
  const targetRole = input.targetRole ?? 'ALL';
  const userIds = await notificationRepo.findUserIdsByRole(targetRole);

  if (userIds.length === 0) {
    throw new ApiError(400, 'No users match the selected target audience.');
  }

  await notificationRepo.createManyNotifications(userIds, input.title, input.message);
  return { notifiedCount: userIds.length };
};

// ---------- Student-facing ----------
export const getMyNotifications = async (
  userId: string,
  query: { page?: number; limit?: number; unreadOnly?: string }
) => {
  return notificationRepo.findNotificationsForUser(userId, {
    page: query.page,
    limit: query.limit,
    unreadOnly: query.unreadOnly === 'true',
  });
};

export const markNotificationRead = async (id: string, userId: string) => {
  const notification = await notificationRepo.findNotificationById(id);
  if (!notification) throw new ApiError(404, 'Notification not found.');
  if (notification.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to access this notification.');
  }
  return notificationRepo.markAsRead(id);
};

export const markAllNotificationsRead = async (userId: string) => {
  return notificationRepo.markAllAsReadForUser(userId);
};

export const deleteMyNotification = async (id: string, userId: string) => {
  const notification = await notificationRepo.findNotificationById(id);
  if (!notification) throw new ApiError(404, 'Notification not found.');
  if (notification.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to delete this notification.');
  }
  return notificationRepo.deleteNotification(id);
};