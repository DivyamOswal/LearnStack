import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { upload } from '../../middlewares/upload.middleware';
import {
  createCourseSchema,
  updateCourseSchema,
  courseIdParamSchema,
  courseSlugParamSchema,
  listCoursesSchema,
} from './courses.validator';
import * as courseController from './courses.controller';

const router = Router();

// ---------- Public routes ----------
router.get('/', validate(listCoursesSchema), courseController.getPublicCourses);

// ---------- Admin-only routes (must come before /:slug) ----------
router.get(
  '/admin/all',
  authenticate,
  authorize('ADMIN'),
  validate(listCoursesSchema),
  courseController.getAdminCourses
);
router.get(
  '/admin/:id',
  authenticate,
  authorize('ADMIN'),
  validate(courseIdParamSchema),
  courseController.getCourseByIdForAdmin
);
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  upload.single('thumbnail'),
  validate(createCourseSchema),
  courseController.createCourse
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  upload.single('thumbnail'),
  validate(updateCourseSchema),
  courseController.updateCourse
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(courseIdParamSchema),
  courseController.deleteCourse
);

router.get('/search', courseController.searchAll);

// ---------- Public slug route (must come last) ----------
router.get('/:slug', validate(courseSlugParamSchema), courseController.getCourseBySlug);

export default router;