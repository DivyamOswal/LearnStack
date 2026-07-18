import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  generateCertificateSchema,
  certificateIdParamSchema,
  certificateCodeParamSchema,
} from './certifications.validator';
import * as certificateController from './certifications.controller';

const router = Router();

// ---------- Public ----------
router.get(
  '/verify/:code',
  validate(certificateCodeParamSchema),
  certificateController.verifyCertificate
);

// ---------- Student ----------
router.post(
  '/generate',
  authenticate,
  validate(generateCertificateSchema),
  certificateController.generateCertificate
);
router.get('/my', authenticate, certificateController.getMyCertificates);
router.get(
  '/:id/download',
  authenticate,
  validate(certificateIdParamSchema),
  certificateController.downloadCertificate
);

// ---------- Admin ----------
router.get(
  '/admin/all',
  authenticate,
  authorize('ADMIN'),
  certificateController.getAllCertificatesForAdmin
);

export default router;