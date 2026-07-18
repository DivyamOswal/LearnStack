export interface CreateBlogInput {
  title: string;
  content: string;
  coverImage?: string;
  isPublished?: boolean;
}

export interface UpdateBlogInput {
  title?: string;
  content?: string;
  coverImage?: string;
  isPublished?: boolean;
}

export interface BlogListQuery {
  page?: number;
  limit?: number;
  search?: string;
}