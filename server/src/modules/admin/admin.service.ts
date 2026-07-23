import { Role } from '@prisma/client';
import { ApiError } from '../../utils/ApiError';
import { UserListQuery } from './admin.types';
import * as adminRepo from './admin.repository';

export const getUsers = async (query: UserListQuery) => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 20;
  return adminRepo.findUsers({ ...query, page, limit });
};

export const getUserDetail = async (id: string) => {
  const user = await adminRepo.findUserById(id);
  if (!user) throw new ApiError(404, 'User not found.');
  return user;
};

export const changeUserRole = async (
  id: string,
  role: Role,
  requestingAdminId: string
) => {
  if (id === requestingAdminId && role !== Role.ADMIN) {
    throw new ApiError(400, 'You cannot demote your own account.');
  }
  const user = await adminRepo.findUserById(id);
  if (!user) throw new ApiError(404, 'User not found.');
  return adminRepo.updateUserRole(id, role);
};

export const setUserActiveStatus = async (
  id: string,
  isActive: boolean,
  requestingAdminId: string
) => {
  if (id === requestingAdminId && !isActive) {
    throw new ApiError(400, 'You cannot deactivate your own account.');
  }
  return adminRepo.toggleUserActiveStatus(id, isActive);
};

export const removeUser = async (id: string, requestingAdminId: string) => {
  if (id === requestingAdminId) {
    throw new ApiError(400, 'You cannot delete your own account.');
  }
  const user = await adminRepo.findUserById(id);
  if (!user) throw new ApiError(404, 'User not found.');
  return adminRepo.deleteUser(id);
};

// ---------- CATEGORIES ----------

export const addCategory = async (name: string) => {
  return adminRepo.createCategory(name);
};

export const getCategories = async () => {
  return adminRepo.listCategories();
};

export const editCategory = async (id: string, name: string) => {
  return adminRepo.updateCategory(id, name);
};

export const removeCategory = async (id: string) => {
  return adminRepo.deleteCategory(id);
};

// ---------- ANALYTICS ----------

export const getStats = async () => {
  return adminRepo.getDashboardStats();
};

export const getPopularCoursesReport = async () => {
  return adminRepo.getPopularCourses();
};

export const getRevenueReport = async () => {
  return adminRepo.getMonthlyRevenue();
};

export const addCoupon = async (input: {
  code: string;
  discountPercent: number;
  maxUses?: number;
  expiresAt?: string;
}) => {
  const existing = await adminRepo.findCouponByCode(input.code);
  if (existing) {
    throw new ApiError(409, 'A coupon with this code already exists.');
  }

  return adminRepo.createCoupon({
    code: input.code,
    discountPercent: input.discountPercent,
    maxUses: input.maxUses,
    expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
  });
};

export const getCoupons = async () => {
  return adminRepo.listCoupons();
};

export const setCouponStatus = async (id: string, isActive: boolean) => {
  return adminRepo.updateCouponStatus(id, isActive);
};