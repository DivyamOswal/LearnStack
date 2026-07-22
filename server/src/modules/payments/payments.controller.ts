import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import * as paymentService from './payments.service';

export const createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.createCheckoutSession(req.user!.id, req.body);
  res.status(201).json(new ApiResponse(201, result, 'Checkout session created.'));
});

// NOTE: this handler receives a raw Buffer body (see app.ts), not parsed JSON LearnStack
// do not use req.body as an object here.
export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    return res.status(400).json({ success: false, message: 'Missing Stripe signature header.' });
  }

  try {
    await paymentService.handleStripeWebhook(req.body as Buffer, signature);
    res.status(200).json({ received: true });
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'Webhook handling failed.';
    res.status(400).json({ success: false, message });
  }
};

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.getMyOrders(req.user!.id, req.query as any);
  res.status(200).json(new ApiResponse(200, result, 'Orders fetched.'));
});

export const getOrderInvoice = asyncHandler(async (req: Request, res: Response) => {
  const invoiceUrl = await paymentService.getOrderInvoice(req.params.id, req.user!.id);
  res.status(200).json(new ApiResponse(200, { invoiceUrl }, 'Invoice fetched.'));
});

export const refundOrder = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.refundOrder(req.params.id);
  res.status(200).json(new ApiResponse(200, result, 'Order refunded successfully.'));
});

export const getAllOrdersForAdmin = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.getAllOrdersForAdmin(req.query as any);
  res.status(200).json(new ApiResponse(200, result, 'All orders fetched.'));
});