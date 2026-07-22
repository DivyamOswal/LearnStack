export type Role = 'STUDENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  avatarUrl?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface GoogleLoginPayload {
  idToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}