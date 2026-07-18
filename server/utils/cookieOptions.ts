import { CookieOptions } from 'express';
import { env } from '../config/env';

const isProd = env.NODE_ENV === 'production';

// Frontend (Vercel) and backend (Render) are different domains,
// so cross-site cookies require sameSite:'none' + secure:true in production.
export const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  maxAge: 15 * 60 * 1000, // 15 min — matches JWT_ACCESS_EXPIRY default
  path: '/',
};

export const refreshTokenCookieOptions = (rememberMe: boolean): CookieOptions => ({
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 30d vs 7d
  path: '/',
});

export const clearCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
};