import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { upload } from '../../middlewares/upload.middleware';
import {
  createLessonSchema,
  updateLessonSchema,
  lessonIdParamSchema,
  chapterIdParamSchema,
  reorderLessonsSchema,
} from './lessons.validator';
import * as lessonController from './lessons.controller';

const router = Router();

const lessonFileUpload = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]);

// ---------- Read routes (authenticated students + admin) ----------
// NOTE: currently just requires login — gating by course purchase belongs
// in the payments phase, flagged here rather than silently skipped.
router.get(
  '/chapter/:chapterId',
  authenticate,
  validate(chapterIdParamSchema),
  lessonController.getLessonsForChapter
);
router.get('/:id', authenticate, validate(lessonIdParamSchema), lessonController.getLesson);

// ---------- Admin-only write routes ----------
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  lessonFileUpload,
  validate(createLessonSchema),
  lessonController.createLesson
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  lessonFileUpload,
  validate(updateLessonSchema),
  lessonController.updateLesson
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(lessonIdParamSchema),
  lessonController.deleteLesson
);
router.patch(
  '/chapter/:chapterId/reorder',
  authenticate,
  authorize('ADMIN'),
  validate(reorderLessonsSchema),
  lessonController.reorderLessons
);

export default router;