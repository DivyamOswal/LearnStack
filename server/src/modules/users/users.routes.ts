import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { upload } from '../../middlewares/upload.middleware';
import {
  updateProfileSchema,
  changePasswordSchema,
  courseIdParamSchema,
} from './users.validator';
import * as userController from './users.controller';

const router = Router();

// Every route here requires a logged-in user.
router.use(authenticate);

router.get('/profile', userController.getProfile);
router.patch(
  '/profile',
  upload.single('avatar'),
  validate(updateProfileSchema),
  userController.updateProfile
);
router.patch('/change-password', validate(changePasswordSchema), userController.changePassword);

router.get('/dashboard', userController.getDashboard);

router.get('/bookmarks', userController.getMyBookmarks);
router.patch(
  '/bookmarks/:courseId',
  validate(courseIdParamSchema),
  userController.toggleBookmark
);

export default router;