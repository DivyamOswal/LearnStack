import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  markLessonCompleteSchema,
  courseIdParamSchema,
  lessonIdParamSchema,
} from './progress.validator';
import * as progressController from './progress.controller';

const router = Router();

// Every route here requires a logged-in student.
router.use(authenticate);

router.post('/complete', validate(markLessonCompleteSchema), progressController.markLessonComplete);
router.patch(
  '/lesson/:lessonId/incomplete',
  validate(lessonIdParamSchema),
  progressController.markLessonIncomplete
);

router.get(
  '/course/:courseId/summary',
  validate(courseIdParamSchema),
  progressController.getCourseProgressSummary
);
router.get(
  '/course/:courseId/detailed',
  validate(courseIdParamSchema),
  progressController.getDetailedProgress
);
router.get(
  '/course/:courseId/continue',
  validate(courseIdParamSchema),
  progressController.getContinueLearning
);

router.get('/in-progress', progressController.getInProgressCourses);

export default router;