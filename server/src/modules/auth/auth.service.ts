import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { AuthProvider } from '@prisma/client';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../config/env';
import { resend } from '../../config/resend';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generatePurposeToken,
  verifyPurposeToken,
} from '../../utils/jwt';
import * as authRepo from './auth.respository';
import { RegisterInput, LoginInput, GoogleLoginInput } from './auth.types';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const buildTokens = (id: string, role: 'STUDENT' | 'ADMIN') => {
  const accessToken = generateAccessToken({ id, role: role as any });
  const refreshToken = generateRefreshToken({ id, role: role as any });
  return { accessToken, refreshToken };
};

export const register = async (input: RegisterInput) => {
  const existing = await authRepo.findUserByEmail(input.email);
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const user = await authRepo.createUser({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  const verifyToken = generatePurposeToken(user.id, 'EMAIL_VERIFY', '24h');
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${verifyToken}`;

  await resend.emails.send({
    from: 'LearnStack<onboarding@resend.dev>',
    to: user.email,
    subject: 'Verify your LearnStack account',
    html: `<p>Hi ${user.name},</p><p>Click below to verify your email. This link expires in 24 hours.</p><p><a href="${verifyUrl}">Verify Email</a></p>`,
  });

  return { id: user.id, name: user.name, email: user.email };
};

export const login = async (input: LoginInput) => {
  const user = await authRepo.findUserByEmail(input.email);

  if (!user || !user.password) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (user.provider !== AuthProvider.LOCAL) {
    throw new ApiError(400, `This account uses ${user.provider} sign-in. Please use that instead.`);
  }

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const { accessToken, refreshToken } = buildTokens(user.id, user.role);
  await authRepo.updateRefreshToken(user.id, refreshToken);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
    accessToken,
    refreshToken,
  };
};

export const googleLogin = async (input: GoogleLoginInput) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: input.idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new ApiError(401, 'Invalid Google token.');
  }

  let user = await authRepo.findUserByEmail(payload.email);

  if (!user) {
    user = await authRepo.createUser({
      name: payload.name ?? payload.email.split('@')[0],
      email: payload.email,
      provider: AuthProvider.GOOGLE,
      isVerified: true,
      avatarUrl: payload.picture,
    });
  } else if (user.provider !== AuthProvider.GOOGLE) {
    throw new ApiError(
      400,
      'This email is already registered with a password. Please log in with your password instead.'
    );
  }

  const { accessToken, refreshToken } = buildTokens(user.id, user.role);
  await authRepo.updateRefreshToken(user.id, refreshToken);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (incomingRefreshToken: string) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token. Please log in again.');
  }

  const user = await authRepo.findUserById(decoded.id);
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token mismatch. Please log in again.');
  }

  const { accessToken, refreshToken } = buildTokens(user.id, user.role);
  await authRepo.updateRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken, role: user.role };
};

export const logout = async (userId: string) => {
  await authRepo.updateRefreshToken(userId, null);
};

export const verifyEmail = async (token: string) => {
  let decoded;
  try {
    decoded = verifyPurposeToken(token, 'EMAIL_VERIFY');
  } catch {
    throw new ApiError(400, 'Invalid or expired verification link.');
  }

  const user = await authRepo.findUserById(decoded.id);
  if (!user) throw new ApiError(404, 'User not found.');
  if (user.isVerified) return { alreadyVerified: true };

  await authRepo.markEmailVerified(user.id);
  return { alreadyVerified: false };
};

export const forgotPassword = async (email: string) => {
  const user = await authRepo.findUserByEmail(email);
  // Always respond success-shaped, regardless of whether the user exists —
  // prevents leaking which emails are registered.
  if (!user) return;

  const resetToken = generatePurposeToken(user.id, 'PASSWORD_RESET', '15m');
  const expiry = new Date(Date.now() + 15 * 60 * 1000);
  await authRepo.setResetToken(user.id, resetToken, expiry);

  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await resend.emails.send({
    from: 'LearnStack<onboarding@resend.dev>',
    to: user.email,
    subject: 'Reset your LearnStack password',
    html: `<p>Hi ${user.name},</p><p>Click below to reset your password. This link expires in 15 minutes.</p><p><a href="${resetUrl}">Reset Password</a></p>`,
  });
};

export const resetPassword = async (token: string, newPassword: string) => {
  let decoded;
  try {
    decoded = verifyPurposeToken(token, 'PASSWORD_RESET');
  } catch {
    throw new ApiError(400, 'Invalid or expired reset link.');
  }

  const user = await authRepo.findUserById(decoded.id);
  if (!user || user.resetToken !== token) {
    throw new ApiError(400, 'This reset link has already been used or is invalid.');
  }
  if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    throw new ApiError(400, 'This reset link has expired.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await authRepo.updatePassword(user.id, hashedPassword);
  await authRepo.clearResetToken(user.id);
  await authRepo.updateRefreshToken(user.id, null); // force re-login everywhere
};