import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const tokenFromCookie = req.cookies?.accessToken as string | undefined;
    const authHeader = req.headers.authorization;
    const tokenFromHeader =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : undefined;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      throw new ApiError(401, 'Authentication required. No token provided.');
    }

    try {
      const decoded = verifyAccessToken(token);
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired access token.');
    }
  }
);