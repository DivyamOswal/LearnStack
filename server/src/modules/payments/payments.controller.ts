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

export const previewPricing = asyncHandler(async (req: Request, res: Response) => {
  const breakdown = await paymentService.previewOrderPricing(req.body.courseId, req.body.couponCode);
  res.status(200).json(new ApiResponse(200, breakdown, 'Pricing calculated.'));
});

export const getOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.getOrderStatus(req.params.id, req.user!.id);
  res.status(200).json(new ApiResponse(200, result, 'Order status fetched.'));
});