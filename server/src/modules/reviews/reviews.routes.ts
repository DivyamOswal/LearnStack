import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createReviewSchema,
  updateReviewSchema,
  reviewIdParamSchema,
  courseIdParamSchema,
  listReviewsSchema,
} from './reviews.validator';
import * as reviewController from './reviews.controller';

const router = Router();

// ---------- Public reads LearnStack reviews are part of a course's public sales page ----------
router.get(
  '/course/:courseId',
  validate(listReviewsSchema),
  reviewController.getReviewsForCourse
);
router.get(
  '/course/:courseId/distribution',
  validate(courseIdParamSchema),
  reviewController.getRatingDistribution
);

// ---------- Authenticated student actions ----------
router.post('/', authenticate, validate(createReviewSchema), reviewController.createReview);
router.patch('/:id', authenticate, validate(updateReviewSchema), reviewController.updateReview);
router.delete('/:id', authenticate, validate(reviewIdParamSchema), reviewController.deleteReview);

export default router;