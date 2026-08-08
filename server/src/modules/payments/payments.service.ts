import { OrderStatus, PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';
import stripe from '../../config/stripe';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';
import * as paymentRepo from './payments.repository';
import { CreateCheckoutSessionInput, PricingBreakdown } from './payments.types';
import { notifyUser } from '../notifications/notifications.service';

// 18% GST — India's standard rate for online/digital services (OIDAR).
// Centralized here so the preview endpoint and actual checkout session
// always compute the exact same number — never duplicate this math.
const TAX_RATE = 0.18;

const computePricing = async (
  course: { price: any; discountPrice: any },
  couponCode?: string
): Promise<{ breakdown: PricingBreakdown; couponId?: string }> => {
  const originalPrice = Number(course.price);
  const baseAmount = Number(course.discountPrice ?? course.price);
  const discountAmount = Math.max(0, originalPrice - baseAmount);

  let subtotal = baseAmount;
  let couponId: string | undefined;
  let couponApplied = false;

  if (couponCode) {
    const coupon = await paymentRepo.findActiveCouponByCode(couponCode);
    if (!coupon || !coupon.isActive) {
      throw new ApiError(400, 'Invalid or inactive coupon code.');
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new ApiError(400, 'This coupon has expired.');
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      throw new ApiError(400, 'This coupon has reached its usage limit.');
    }
    subtotal = Math.round((subtotal - (subtotal * coupon.discountPercent) / 100) * 100) / 100;
    couponId = coupon.id;
    couponApplied = true;
  }

  const taxAmount = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;

  return {
    breakdown: {
      baseAmount: originalPrice,
      discountAmount,
      subtotal,
      taxAmount,
      taxRate: TAX_RATE,
      total,
      couponApplied,
      couponCode: couponApplied ? couponCode! : null,
    },
    couponId,
  };
};

export const previewOrderPricing = async (courseId: string, couponCode?: string) => {
  const course = await paymentRepo.findCourseById(courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  const { breakdown } = await computePricing(course, couponCode);
  return breakdown;
};

export const createCheckoutSession = async (
  userId: string,
  input: CreateCheckoutSessionInput
) => {
  const course = await paymentRepo.findCourseById(input.courseId);
  if (!course) throw new ApiError(404, 'Course not found.');
  if (!course.isPublished) throw new ApiError(400, 'This course is not available for purchase.');

  const alreadyOwned = await paymentRepo.findCompletedOrder(userId, input.courseId);
  if (alreadyOwned) throw new ApiError(409, 'You have already purchased this course.');

  const { breakdown, couponId } = await computePricing(course, input.couponCode);

  // The order stores the FULL amount actually charged (tax included) —
  // this is the number that shows up in order history and admin revenue reports.
  const order = await paymentRepo.createOrder({
    userId,
    courseId: input.courseId,
    amount: breakdown.total,
    couponId,
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: course.title,
            description:
              breakdown.taxAmount > 0
                ? `Includes GST (${(breakdown.taxRate * 100).toFixed(0)}%)`
                : undefined,
          },
          unit_amount: Math.round(breakdown.total * 100), // Stripe expects paise
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId: order.id,
      userId,
      courseId: input.courseId,
    },
    success_url: `${env.CLIENT_URL}/payment/success?orderId=${order.id}`,
    cancel_url: `${env.CLIENT_URL}/payment/cancel?orderId=${order.id}`,
  });

  return { checkoutUrl: session.url, orderId: order.id };
};


export const getMyOrders = async (userId: string, query: { page?: number; limit?: number }) => {
  return paymentRepo.findOrdersForUser(userId, query);
};

export const getOrderInvoice = async (orderId: string, userId: string) => {
  const order = await paymentRepo.findOrderById(orderId);
  if (!order) throw new ApiError(404, 'Order not found.');
  if (order.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to access this order.');
  }
  if (!order.payment?.invoiceUrl) {
    throw new ApiError(404, 'No invoice is available for this order yet.');
  }
  return order.payment.invoiceUrl;
};

export const getOrderStatus = async (orderId: string, userId: string) => {
  const order = await paymentRepo.findOrderById(orderId);
  if (!order) throw new ApiError(404, 'Order not found.');
  if (order.userId !== userId) {
    throw new ApiError(403, 'You do not have permission to access this order.');
  }
  return { status: order.status, courseTitle: order.course.title };
};

export const refundOrder = async (orderId: string) => {
  const order = await paymentRepo.findOrderById(orderId);
  if (!order) throw new ApiError(404, 'Order not found.');
  if (order.status !== OrderStatus.COMPLETED || !order.payment) {
    throw new ApiError(400, 'Only completed orders with a successful payment can be refunded.');
  }
  if (order.payment.status === PaymentStatus.REFUNDED) {
    throw new ApiError(409, 'This payment has already been refunded.');
  }

  await stripe.refunds.create({ payment_intent: order.payment.stripePaymentId });

  await paymentRepo.updatePaymentStatus(orderId, PaymentStatus.REFUNDED);
  await paymentRepo.updateOrderStatus(orderId, OrderStatus.REFUNDED);

  await notifyUser(
    order.userId,
    'Refund Processed',
    `Your payment for "${order.course.title}" has been refunded.`
  );

  return { refunded: true };
};

export const getAllOrdersForAdmin = async (query: { page?: number; limit?: number }) => {
  return paymentRepo.findAllOrdersForAdmin(query);
};