import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

// Used for role based access (Admin / User)
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        'You do not have permission to perform this action.'
      );
    }

    next();
  };
};