import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createChapterSchema,
  updateChapterSchema,
  chapterIdParamSchema,
  courseIdParamSchema,
  reorderChaptersSchema,
} from './chapters.validator';
import * as chapterController from './chapters.controller';

const router = Router();

// ---------- Read routes ----------
// Public LearnStack chapter titles/structure are useful as a course "syllabus" preview
// even before purchase. Actual lesson content access is still gated separately.
router.get(
  '/course/:courseId',
  validate(courseIdParamSchema),
  chapterController.getChaptersForCourse
);
router.get('/:id', validate(chapterIdParamSchema), chapterController.getChapter);

// ---------- Admin-only write routes ----------
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createChapterSchema),
  chapterController.createChapter
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateChapterSchema),
  chapterController.updateChapter
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(chapterIdParamSchema),
  chapterController.deleteChapter
);
router.patch(
  '/course/:courseId/reorder',
  authenticate,
  authorize('ADMIN'),
  validate(reorderChaptersSchema),
  chapterController.reorderChapters
);

export default router;