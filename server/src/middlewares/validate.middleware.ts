import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validate = (schema: z.AnyZodObject) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors = err.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        return next(new ApiError(400, 'Validation failed', formattedErrors));
      }

      next(err);
    }
  };
};