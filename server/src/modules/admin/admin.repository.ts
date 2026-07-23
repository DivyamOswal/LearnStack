import { Prisma, Role } from '@prisma/client';
import prisma from '../../config/db';
import { UserListQuery } from './admin.types';

// Find Users
export const findUsers = async ({ page = 1, limit = 20, search, role }: UserListQuery) => {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    ...(role ? { role } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        avatarUrl: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// Find user by id
export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      avatarUrl: true,
      bio: true,
      createdAt: true,
      _count: {
        select: { orders: true, certificates: true, reviews: true },
      },
    },
  });
};

// Update the user role
export const updateUserRole = async (id: string, role: Role) => {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
};

// Requires the isActive migration mentioned above.
export const toggleUserActiveStatus = async (id: string, isActive: boolean) => {
  return prisma.user.update({
    where: { id },
    data: { isActive } as Prisma.UserUpdateInput,
    select: { id: true, name: true, email: true },
  });
};

// Delete User
export const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};

// ---------- CATEGORIES ----------
// Create category
export const createCategory = async (name: string) => {
  const slug = name.toLowerCase().trim().replace(/[.\s]+/g, '-');
  return prisma.category.create({ data: { name, slug } });
};

// List of category
export const listCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { courses: true } } },
  });
};

// Update Category
export const updateCategory = async (id: string, name: string) => {
  const slug = name.toLowerCase().trim().replace(/[.\s]+/g, '-');
  return prisma.category.update({ where: { id }, data: { name, slug } });
};

// Delete Category
export const deleteCategory = async (id: string) => {
  return prisma.category.delete({ where: { id } });
};

// ---------- ANALYTICS ----------

// Get dashboard Stats
export const getDashboardStats = async () => {
  const [totalStudents, totalAdmins, totalCourses, publishedCourses, totalEnrollments, revenueAgg] =
    await Promise.all([
      prisma.user.count({ where: { role: Role.STUDENT } }),
      prisma.user.count({ where: { role: Role.ADMIN } }),
      prisma.course.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

  return {
    totalStudents,
    totalAdmins,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    totalRevenue: Number(revenueAgg._sum.amount ?? 0),
  };
};

// Get popular courses
export const getPopularCourses = async (limitCount = 5) => {
  const results = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      _count: { select: { orders: true } },
    },
    orderBy: {
      orders: { _count: 'desc' },
    },
    take: limitCount,
  });

  return results.map((c) => ({
    courseId: c.id,
    title: c.title,
    enrollments: c._count.orders,
  }));
};

// Get monthly revenue
export const getMonthlyRevenue = async () => {
  // raw query: group completed orders by month for the last 12 months
  const rows = await prisma.$queryRaw<{ month: string; revenue: string }[]>`
    SELECT TO_CHAR("createdAt", 'YYYY-MM') as month,
           SUM(amount)::text as revenue
    FROM "Order"
    WHERE status = 'COMPLETED'
      AND "createdAt" >= NOW() - INTERVAL '12 months'
    GROUP BY month
    ORDER BY month ASC;
  `;

  return rows.map((r) => ({ month: r.month, revenue: Number(r.revenue) }));
};

export const createCoupon = (data: { code: string; discountPercent: number; maxUses?: number; expiresAt?: Date }) => {
  return prisma.coupon.create({ data });
};

export const listCoupons = () => {
  return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
};

export const updateCouponStatus = (id: string, isActive: boolean) => {
  return prisma.coupon.update({ where: { id }, data: { isActive } });
};