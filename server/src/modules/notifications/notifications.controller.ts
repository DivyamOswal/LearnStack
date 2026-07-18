import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import * as notificationService from './notifications.service';

export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const result = await notificationService.getMyNotifications(req.user!.id, req.query as any);
  res.status(200).json(new ApiResponse(200, result, 'Notifications fetched.'));
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await notificationService.markNotificationRead(req.params.id, req.user!.id);
  res.status(200).json(new ApiResponse(200, notification, 'Notification marked as read.'));
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markAllNotificationsRead(req.user!.id);
  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read.'));
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.deleteMyNotification(req.params.id, req.user!.id);
  res.status(200).json(new ApiResponse(200, null, 'Notification deleted.'));
});

export const broadcastNotification = asyncHandler(async (req: Request, res: Response) => {
  const result = await notificationService.broadcastNotification(req.body);
  res.status(201).json(new ApiResponse(201, result, `Notification sent to ${result.notifiedCount} user(s).`));
});