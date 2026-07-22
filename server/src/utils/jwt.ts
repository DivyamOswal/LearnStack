import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env';

export type TokenPurpose = 'EMAIL_VERIFY' | 'PASSWORD_RESET';

interface PurposePayload {
  id: string;
  purpose: TokenPurpose;
}

export interface JwtPayload {
  id: string;
  role: Role;
}

export const generatePurposeToken = (
  id: string,
  purpose: TokenPurpose,
  expiresIn: string
): string => {
  return jwt.sign({ id, purpose }, env.EMAIL_TOKEN_SECRET, { expiresIn } as SignOptions);
};

export const verifyPurposeToken = (
  token: string,
  expectedPurpose: TokenPurpose
): PurposePayload => {
  const decoded = jwt.verify(token, env.EMAIL_TOKEN_SECRET) as PurposePayload;
  if (decoded.purpose !== expectedPurpose) {
    throw new Error('Token purpose mismatch.');
  }
  return decoded;
};

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  } as SignOptions);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  } as SignOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
};