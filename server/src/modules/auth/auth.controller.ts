import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  clearCookieOptions,
} from '../../utils/cookieOptions';
import * as authService from './auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, user, 'Registration successful. Please check your email to verify your account.'));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { rememberMe = false } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res
    .cookie('accessToken', accessToken, accessTokenCookieOptions)
    .cookie('refreshToken', refreshToken, refreshTokenCookieOptions(rememberMe))
    .status(200)
    .json(new ApiResponse(200, { user }, 'Login successful.'));
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.googleLogin(req.body);

  res
    .cookie('accessToken', accessToken, accessTokenCookieOptions)
    .cookie('refreshToken', refreshToken, refreshTokenCookieOptions(true))
    .status(200)
    .json(new ApiResponse(200, { user }, 'Google login successful.'));
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const incoming = req.cookies?.refreshToken as string | undefined;
  if (!incoming) throw new ApiError(401, 'No refresh token provided.');

  const { accessToken, refreshToken } = await authService.refreshAccessToken(incoming);

  res
    .cookie('accessToken', accessToken, accessTokenCookieOptions)
    .cookie('refreshToken', refreshToken, refreshTokenCookieOptions(true))
    .status(200)
    .json(new ApiResponse(200, null, 'Token refreshed.'));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  if (req.user) {
    await authService.logout(req.user.id);
  }

  res
    .clearCookie('accessToken', clearCookieOptions)
    .clearCookie('refreshToken', clearCookieOptions)
    .status(200)
    .json(new ApiResponse(200, null, 'Logged out successfully.'));
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.verifyEmail(req.body.token);
  const message = result.alreadyVerified
    ? 'Email was already verified.'
    : 'Email verified successfully.';
  res.status(200).json(new ApiResponse(200, null, message));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  res
    .status(200)
    .json(new ApiResponse(200, null, 'If an account exists for that email, a reset link has been sent.'));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body.token, req.body.newPassword);
  res.status(200).json(new ApiResponse(200, null, 'Password reset successful. Please log in.'));
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated.');
  res.status(200).json(new ApiResponse(200, req.user, 'Current user fetched.'));
});