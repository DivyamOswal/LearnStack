export interface CreateReviewInput {
  courseId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export interface ReviewListQuery {
  page?: number;
  limit?: number;
}