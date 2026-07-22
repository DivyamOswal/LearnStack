import { OrderStatus, PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';
import stripe from '../../config/stripe';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';
import * as paymentRepo from './payments.repository';
import { CreateCheckoutSessionInput } from './payments.types';
import { notifyUser } from '../notifications/notifications.service';

const calculateDiscountedAmount = (price: number, discountPercent: number) => {
  const discounted = price - (price * discountPercent) / 100;
  return Math.round(discounted * 100) / 100; // round to 2 decimals
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

  let finalAmount = Number(course.discountPrice ?? course.price);
  let couponId: string | undefined;

  if (input.couponCode) {
    const coupon = await paymentRepo.findActiveCouponByCode(input.couponCode);
    if (!coupon || !coupon.isActive) {
      throw new ApiError(400, 'Invalid or inactive coupon code.');
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new ApiError(400, 'This coupon has expired.');
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      throw new ApiError(400, 'This coupon has reached its usage limit.');
    }
    finalAmount = calculateDiscountedAmount(finalAmount, coupon.discountPercent);
    couponId = coupon.id;
  }

  const order = await paymentRepo.createOrder({
    userId,
    courseId: input.courseId,
    amount: finalAmount,
    couponId,
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: course.title },
          unit_amount: Math.round(finalAmount * 100), // Stripe expects cents
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

export const handleStripeWebhook = async (rawBody: Buffer, signature: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new ApiError(400, `Webhook signature verification failed: ${(err as Error).message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (!orderId) break;

      const order = await paymentRepo.findOrderById(orderId);
      if (!order || order.status === OrderStatus.COMPLETED) break; // idempotency guard

      await paymentRepo.updateOrderStatus(orderId, OrderStatus.COMPLETED);
      await paymentRepo.createPayment({
        orderId,
        stripePaymentId: (session.payment_intent as string) ?? session.id,
        status: PaymentStatus.SUCCEEDED,
        invoiceUrl: session.invoice ? String(session.invoice) : undefined,
        paidAt: new Date(),
      });

      if (order.couponId) {
        await paymentRepo.incrementCouponUsage(order.couponId);
      }

      await notifyUser(
        order.userId,
        'Payment Successful',
        `Your purchase of "${order.course.title}" is complete. Happy learning!`
      );
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (!orderId) break;

      const order = await paymentRepo.findOrderById(orderId);
      if (!order || order.status !== OrderStatus.PENDING) break;

      await paymentRepo.updateOrderStatus(orderId, OrderStatus.FAILED);
      break;
    }

    default:
      // Unhandled event types are ignored intentionally LearnStack Stripe sends many
      // event types we don't act on; silently ignoring is correct, not a bug.
      break;
  }
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