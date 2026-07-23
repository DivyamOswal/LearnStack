import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import * as adminService from './admin.service';

// Get user in the form of list
export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.getUsers(req.query as any);
  res.status(200).json(new ApiResponse(200, result, 'Users fetched successfully.'));
});

// Get the user
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await adminService.getUserDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully.'));
});

// Udate the user role
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const updated = await adminService.changeUserRole(
    req.params.id,
    req.body.role,
    req.user!.id
  );
  res.status(200).json(new ApiResponse(200, updated, 'User role updated.'));
});

// Update the user status
export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const updated = await adminService.setUserActiveStatus(
    req.params.id,
    req.body.isActive,
    req.user!.id
  );
  res.status(200).json(new ApiResponse(200, updated, 'User status updated.'));
});

// Delete the user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await adminService.removeUser(req.params.id, req.user!.id);
  res.status(200).json(new ApiResponse(200, null, 'User deleted.'));
});

// Create Category
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await adminService.addCategory(req.body.name);
  res.status(201).json(new ApiResponse(201, category, 'Category created.'));
});

// Get Category
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await adminService.getCategories();
  res.status(200).json(new ApiResponse(200, categories, 'Categories fetched.'));
});

// Update the category
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await adminService.editCategory(req.params.id, req.body.name);
  res.status(200).json(new ApiResponse(200, category, 'Category updated.'));
});

// Delete the category
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await adminService.removeCategory(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Category deleted.'));
});

// Get the dashboard stats
export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getStats();
  res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats fetched.'));
});

// Filter popular courses
export const getPopularCourses = asyncHandler(async (_req: Request, res: Response) => {
  const data = await adminService.getPopularCoursesReport();
  res.status(200).json(new ApiResponse(200, data, 'Popular courses report fetched.'));
});

// Get the revenue report
export const getRevenueReport = asyncHandler(async (_req: Request, res: Response) => {
  const data = await adminService.getRevenueReport();
  res.status(200).json(new ApiResponse(200, data, 'Revenue report fetched.'));
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await adminService.addCoupon(req.body);
  res.status(201).json(new ApiResponse(201, coupon, 'Coupon created.'));
});

export const getCoupons = asyncHandler(async (_req: Request, res: Response) => {
  const coupons = await adminService.getCoupons();
  res.status(200).json(new ApiResponse(200, coupons, 'Coupons fetched.'));
});

export const updateCouponStatus = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await adminService.setCouponStatus(req.params.id, req.body.isActive);
  res.status(200).json(new ApiResponse(200, coupon, 'Coupon status updated.'));
});