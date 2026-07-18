import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  notificationIdParamSchema,
  broadcastNotificationSchema,
  listNotificationsSchema,
} from './notifications.validator';
import * as notificationController from './notifications.controller';

const router = Router();

// ---------- Student ----------
router.get('/my', authenticate, validate(listNotificationsSchema), notificationController.getMyNotifications);
router.patch(
  '/:id/read',
  authenticate,
  validate(notificationIdParamSchema),
  notificationController.markAsRead
);
router.patch('/mark-all-read', authenticate, notificationController.markAllAsRead);
router.delete(
  '/:id',
  authenticate,
  validate(notificationIdParamSchema),
  notificationController.deleteNotification
);

// ---------- Admin ----------
router.post(
  '/broadcast',
  authenticate,
  authorize('ADMIN'),
  validate(broadcastNotificationSchema),
  notificationController.broadcastNotification
);

export default router;