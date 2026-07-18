import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createCheckoutSessionSchema,
  orderIdParamSchema,
  listOrdersSchema,
} from './payments.validator';
import * as paymentController from './payments.controller';

const router = Router();

// NOTE: /webhook is intentionally NOT here — it's registered directly
// in app.ts (before express.json()) so it can receive the raw body
// Stripe needs for signature verification. See app.ts.

// ---------- Student ----------
router.post(
  '/checkout',
  authenticate,
  validate(createCheckoutSessionSchema),
  paymentController.createCheckoutSession
);
router.get('/my', authenticate, validate(listOrdersSchema), paymentController.getMyOrders);
router.get(
  '/:id/invoice',
  authenticate,
  validate(orderIdParamSchema),
  paymentController.getOrderInvoice
);

// ---------- Admin ----------
router.get(
  '/admin/all',
  authenticate,
  authorize('ADMIN'),
  validate(listOrdersSchema),
  paymentController.getAllOrdersForAdmin
);
router.post(
  '/admin/:id/refund',
  authenticate,
  authorize('ADMIN'),
  validate(orderIdParamSchema),
  paymentController.refundOrder
);

export default router;