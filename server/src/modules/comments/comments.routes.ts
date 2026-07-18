import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createCommentSchema,
  updateCommentSchema,
  commentIdParamSchema,
  lessonIdParamSchema,
} from './comments.validator';
import * as commentController from './comments.controller';

const router = Router();

// ---------- Student (authenticated) ----------
router.post('/', authenticate, validate(createCommentSchema), commentController.createComment);
router.get(
  '/lesson/:lessonId',
  authenticate,
  validate(lessonIdParamSchema),
  commentController.getCommentsForLesson
);
router.patch('/:id/like', authenticate, validate(commentIdParamSchema), commentController.likeComment);
router.post('/:id/report', authenticate, validate(commentIdParamSchema), commentController.reportComment);
router.patch('/:id', authenticate, validate(updateCommentSchema), commentController.updateComment);
router.delete('/:id', authenticate, validate(commentIdParamSchema), commentController.deleteComment);

// ---------- Admin moderation ----------
router.get(
  '/admin/reported',
  authenticate,
  authorize('ADMIN'),
  commentController.getReportedComments
);
router.patch(
  '/admin/:id/dismiss-report',
  authenticate,
  authorize('ADMIN'),
  validate(commentIdParamSchema),
  commentController.dismissReport
);

export default router;