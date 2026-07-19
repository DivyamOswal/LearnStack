import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { z } from 'zod';
import {
  createTopicSchema,
  updateTopicSchema,
  topicIdParamSchema,
  lessonIdParamSchema,
} from './topic.validator';
import * as topicController from './topic.controller';

const router = Router();

const reorderTopicsSchema = z.object({
  body: z.object({
    topics: z
      .array(z.object({ topicId: z.string().uuid(), order: z.number().int().min(1) }))
      .min(1),
  }),
  params: z.object({ lessonId: z.string().uuid() }),
  query: z.object({}).optional(),
});

// ---------- Read (same access rule as lessons — logged in required) ----------
router.get(
  '/lesson/:lessonId',
  authenticate,
  validate(lessonIdParamSchema),
  topicController.getTopicsForLesson
);
router.get('/:id', authenticate, validate(topicIdParamSchema), topicController.getTopic);

// ---------- Admin-only writes ----------
router.post('/', authenticate, authorize('ADMIN'), validate(createTopicSchema), topicController.createTopic);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateTopicSchema),
  topicController.updateTopic
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(topicIdParamSchema),
  topicController.deleteTopic
);
router.patch(
  '/lesson/:lessonId/reorder',
  authenticate,
  authorize('ADMIN'),
  validate(reorderTopicsSchema),
  topicController.reorderTopics
);

export default router;