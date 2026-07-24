export interface BlogAuthor {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  isPublished: boolean;
  createdAt: string;
  author: BlogAuthor;
}

export interface BlogPost extends BlogListItem {
  content: string;
}

export interface BlogListResult {
  blogs: BlogListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateBlogInput {
  title: string;
  content: string;
  isPublished?: boolean;
}