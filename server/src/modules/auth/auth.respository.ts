import { Prisma, Role, AuthProvider } from '@prisma/client';
import prisma from '../../config/db';

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const createUser = (data: {
  name: string;
  email: string;
  password?: string;
  provider?: AuthProvider;
  isVerified?: boolean;
  avatarUrl?: string;
}) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      provider: data.provider ?? AuthProvider.LOCAL,
      isVerified: data.isVerified ?? false,
      avatarUrl: data.avatarUrl,
      role: Role.STUDENT,
    },
  });
};

export const updateRefreshToken = (id: string, refreshToken: string | null) => {
  return prisma.user.update({ where: { id }, data: { refreshToken } });
};

export const markEmailVerified = (id: string) => {
  return prisma.user.update({ where: { id }, data: { isVerified: true } });
};

export const setResetToken = (id: string, resetToken: string, expiry: Date) => {
  return prisma.user.update({
    where: { id },
    data: { resetToken, resetTokenExpiry: expiry },
  });
};

export const clearResetToken = (id: string) => {
  return prisma.user.update({
    where: { id },
    data: { resetToken: null, resetTokenExpiry: null },
  });
};

export const updatePassword = (id: string, hashedPassword: string) => {
  return prisma.user.update({ where: { id }, data: { password: hashedPassword } });
};