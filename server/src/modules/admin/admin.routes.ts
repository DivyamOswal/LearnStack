import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  listUsersSchema,
  updateUserRoleSchema,
  userIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from './admin.validator';
import * as adminController from './admin.controller';

const router = Router();

// every route in this module is admin-only
router.use(authenticate, authorize('ADMIN'));

// Users
router.get('/users', validate(listUsersSchema), adminController.listUsers);
router.get('/users/:id', validate(userIdParamSchema), adminController.getUser);
router.patch('/users/:id/role', validate(updateUserRoleSchema), adminController.updateUserRole);
router.patch('/users/:id/status', validate(userIdParamSchema), adminController.updateUserStatus);
router.delete('/users/:id', validate(userIdParamSchema), adminController.deleteUser);

// Categories
router.post('/categories', validate(createCategorySchema), adminController.createCategory);
router.get('/categories', adminController.getCategories);
router.patch('/categories/:id', validate(updateCategorySchema), adminController.updateCategory);
router.delete('/categories/:id', validate(categoryIdParamSchema), adminController.deleteCategory);

// Analytics / Reports
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/reports/popular-courses', adminController.getPopularCourses);
router.get('/reports/revenue', adminController.getRevenueReport);

router.post('/coupons', validate(createCouponSchema), adminController.createCoupon);
router.get('/coupons', adminController.getCoupons);
router.patch('/coupons/:id', validate(couponIdParamSchema), adminController.updateCouponStatus);

export default router;