export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
}