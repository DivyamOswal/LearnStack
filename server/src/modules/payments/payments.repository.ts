import { Prisma, OrderStatus, PaymentStatus } from '@prisma/client';
import prisma from '../../config/db';

export const findCourseById = (courseId: string) => {
  return prisma.course.findUnique({ where: { id: courseId } });
};

export const findActiveCouponByCode = (code: string) => {
  return prisma.coupon.findUnique({ where: { code } });
};

export const incrementCouponUsage = (id: string) => {
  return prisma.coupon.update({
    where: { id },
    data: { usedCount: { increment: 1 } },
  });
};

// Has this user already completed a purchase for this course?
export const findCompletedOrder = (userId: string, courseId: string) => {
  return prisma.order.findFirst({
    where: { userId, courseId, status: OrderStatus.COMPLETED },
  });
};

export const createOrder = (data: {
  userId: string;
  courseId: string;
  amount: number;
  couponId?: string;
}) => {
  return prisma.order.create({
    data: {
      userId: data.userId,
      courseId: data.courseId,
      amount: data.amount,
      couponId: data.couponId,
      status: OrderStatus.PENDING,
    },
  });
};

export const findOrderById = (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: { course: true, payment: true, coupon: true },
  });
};

export const updateOrderStatus = (id: string, status: OrderStatus) => {
  return prisma.order.update({ where: { id }, data: { status } });
};

export const createPayment = (data: {
  orderId: string;
  stripePaymentId: string;
  status: PaymentStatus;
  invoiceUrl?: string;
  paidAt?: Date;
}) => {
  return prisma.payment.create({ data });
};

export const findPaymentByStripeId = (stripePaymentId: string) => {
  return prisma.payment.findUnique({ where: { stripePaymentId } });
};

export const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
  return prisma.payment.update({ where: { orderId }, data: { status } });
};

export const findOrdersForUser = async (
  userId: string,
  { page = 1, limit = 10 }: { page?: number; limit?: number }
) => {
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = { userId };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        course: { select: { id: true, title: true, thumbnailUrl: true } },
        payment: { select: { status: true, invoiceUrl: true, paidAt: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const findAllOrdersForAdmin = async ({ page = 1, limit = 20 }: { page?: number; limit?: number }) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count(),
  ]);

  return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
};