import { z } from 'zod';
import { Role } from '@prisma/client';

export const listUsersSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    role: z.nativeEnum(Role).optional(),
  }),
  body: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(Role),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export const categoryIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3, 'Code must be at least 3 characters').max(30).toUpperCase(),
    discountPercent: z.coerce.number().int().min(1).max(100),
    maxUses: z.coerce.number().int().min(1).optional(),
    expiresAt: z.string().datetime().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateCouponSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({}).optional(),
});

export const couponIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
});