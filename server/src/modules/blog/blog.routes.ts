import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { upload } from '../../middlewares/upload.middleware';
import {
  createBlogSchema,
  updateBlogSchema,
  blogIdParamSchema,
  blogSlugParamSchema,
  listBlogsSchema,
} from './blog.validator';
import * as blogController from './blog.controller';

const router = Router();

// ---------- Public routes ----------
router.get('/', validate(listBlogsSchema), blogController.getPublicBlogs);
router.get('/:slug', validate(blogSlugParamSchema), blogController.getBlogBySlug);

// ---------- Admin-only routes ----------
router.get(
  '/admin/all',
  authenticate,
  authorize('ADMIN'),
  validate(listBlogsSchema),
  blogController.getAdminBlogs
);
router.get(
  '/admin/:id',
  authenticate,
  authorize('ADMIN'),
  validate(blogIdParamSchema),
  blogController.getBlogByIdForAdmin
);
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  upload.single('coverImage'),
  validate(createBlogSchema),
  blogController.createBlog
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  upload.single('coverImage'),
  validate(updateBlogSchema),
  blogController.updateBlog
);
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(blogIdParamSchema),
  blogController.deleteBlog
);

export default router;