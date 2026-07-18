import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { authLimiter } from '../../middlewares/rateLimiter.middleware';
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from './auth.validator';
import * as authController from './auth.controller';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/google', authLimiter, validate(googleLoginSchema), authController.googleLogin);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;

