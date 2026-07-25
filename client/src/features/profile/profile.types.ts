export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  socialLinks: Record<string, string> | null;
  role: 'STUDENT' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}