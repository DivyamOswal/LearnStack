import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createQuizSchema,
  updateQuizSchema,
  createQuestionSchema,
  quizIdParamSchema,
  questionIdParamSchema,
  courseIdParamSchema,
  submitQuizAttemptSchema,
} from './quizzes.validator';
import * as quizController from './quizzes.controller';

const router = Router();

// ---------- Student ----------
router.get(
  '/course/:courseId',
  authenticate,
  validate(courseIdParamSchema),
  quizController.getQuizzesForCourse
);
router.get('/:id', authenticate, validate(quizIdParamSchema), quizController.getQuizForStudent);
router.post(
  '/:id/submit',
  authenticate,
  validate(submitQuizAttemptSchema),
  quizController.submitAttempt
);
router.get('/:id/my-attempts', authenticate, validate(quizIdParamSchema), quizController.getMyAttempts);
router.get('/:id/leaderboard', authenticate, validate(quizIdParamSchema), quizController.getLeaderboard);

// ---------- Admin ----------
router.get(
  '/admin/:id',
  authenticate,
  authorize('ADMIN'),
  validate(quizIdParamSchema),
  quizController.getQuizForAdmin
);
router.post('/', authenticate, authorize('ADMIN'), validate(createQuizSchema), quizController.createQuiz);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateQuizSchema),
  quizController.updateQuiz
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(quizIdParamSchema),
  quizController.deleteQuiz
);
router.post(
  '/:quizId/questions',
  authenticate,
  authorize('ADMIN'),
  validate(createQuestionSchema),
  quizController.createQuestion
);
router.delete(
  '/questions/:id',
  authenticate,
  authorize('ADMIN'),
  validate(questionIdParamSchema),
  quizController.deleteQuestion
);

export default router;