export interface CreateCheckoutSessionPayload {
  courseId: string;
  couponCode?: string;
}

export interface CheckoutSessionResult {
  checkoutUrl: string;
  orderId: string;
}