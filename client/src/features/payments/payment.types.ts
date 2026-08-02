export interface CreateCheckoutSessionPayload {
  courseId: string;
  couponCode?: string;
}

export interface CheckoutSessionResult {
  checkoutUrl: string;
  orderId: string;
}

export interface PricingBreakdown {
  baseAmount: number;
  discountAmount: number;
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  total: number;
  couponApplied: boolean;
  couponCode: string | null;
}

export interface OrderStatusResult {
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  courseTitle: string;
}