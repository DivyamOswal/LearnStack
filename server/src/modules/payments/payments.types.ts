export interface CreateCheckoutSessionInput {
  courseId: string;
  couponCode?: string;
}

export interface OrderListQuery {
  page?: number;
  limit?: number;
}

export interface CreateCheckoutSessionInput {
  courseId: string;
  couponCode?: string;
}

export interface OrderListQuery {
  page?: number;
  limit?: number;
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

export interface PreviewPricingInput {
  courseId: string;
  couponCode?: string;
}