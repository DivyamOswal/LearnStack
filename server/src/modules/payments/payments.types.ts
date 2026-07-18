export interface CreateCheckoutSessionInput {
  courseId: string;
  couponCode?: string;
}

export interface OrderListQuery {
  page?: number;
  limit?: number;
}