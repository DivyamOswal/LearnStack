export type Role = 'STUDENT' | 'ADMIN';

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
}