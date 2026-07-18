import { Role } from '@prisma/client';

export interface UserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
}

export interface DashboardStats {
  totalStudents: number;
  totalAdmins: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
}

export interface PopularCourse {
  courseId: string;
  title: string;
  enrollments: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}