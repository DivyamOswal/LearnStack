export interface CreateCourseInput {
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  isPublished?: boolean;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  categoryId?: string;
  isPublished?: boolean;
}

export interface CourseListQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isPublished?: string; // comes in as string from query params
}