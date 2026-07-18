import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import * as adminService from './admin.service';

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.getUsers(req.query as any);
  res.status(200).json(new ApiResponse(200, result, 'Users fetched successfully.'));
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await adminService.getUserDetail(req.params.id);
  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully.'));
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const updated = await adminService.changeUserRole(
    req.params.id,
    req.body.role,
    req.user!.id
  );
  res.status(200).json(new ApiResponse(200, updated, 'User role updated.'));
});

export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const updated = await adminService.setUserActiveStatus(
    req.params.id,
    req.body.isActive,
    req.user!.id
  );
  res.status(200).json(new ApiResponse(200, updated, 'User status updated.'));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await adminService.removeUser(req.params.id, req.user!.id);
  res.status(200).json(new ApiResponse(200, null, 'User deleted.'));
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await adminService.addCategory(req.body.name);
  res.status(201).json(new ApiResponse(201, category, 'Category created.'));
});

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await adminService.getCategories();
  res.status(200).json(new ApiResponse(200, categories, 'Categories fetched.'));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await adminService.editCategory(req.params.id, req.body.name);
  res.status(200).json(new ApiResponse(200, category, 'Category updated.'));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await adminService.removeCategory(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Category deleted.'));
});

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getStats();
  res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats fetched.'));
});

export const getPopularCourses = asyncHandler(async (_req: Request, res: Response) => {
  const data = await adminService.getPopularCoursesReport();
  res.status(200).json(new ApiResponse(200, data, 'Popular courses report fetched.'));
});

export const getRevenueReport = asyncHandler(async (_req: Request, res: Response) => {
  const data = await adminService.getRevenueReport();
  res.status(200).json(new ApiResponse(200, data, 'Revenue report fetched.'));
});