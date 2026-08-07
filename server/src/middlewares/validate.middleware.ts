import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validate = (
  schema: z.ZodObject<any, any>
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body;

      // Express 5 made req.query a getter-only property -it can't be
      // reassigned directly. Clear its existing keys and copy the parsed
      // (coerced/transformed) values onto the same object instead.
      Object.keys(req.query).forEach((key) => delete (req.query as any)[key]);
      Object.assign(req.query, parsed.query);

      Object.keys(req.params).forEach((key) => delete (req.params as any)[key]);
      Object.assign(req.params, parsed.params);

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