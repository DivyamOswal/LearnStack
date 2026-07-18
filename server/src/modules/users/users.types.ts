export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}