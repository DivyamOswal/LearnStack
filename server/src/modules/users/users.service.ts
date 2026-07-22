import bcrypt from 'bcryptjs';
import { ApiError } from '../../utils/ApiError';
import * as userRepo from './users.respository';
import { UpdateProfileInput, ChangePasswordInput } from './users.types';

export const getProfile = async (userId: string) => {
  const user = await userRepo.findUserById(userId);
  if (!user) throw new ApiError(404, 'User not found.');
  return user;
};

export const editProfile = async (
  userId: string,
  input: UpdateProfileInput,
  avatarUrl?: string
) => {
  return userRepo.updateProfile(userId, input, avatarUrl);
};

export const changePassword = async (userId: string, input: ChangePasswordInput) => {
  const user = await userRepo.findUserWithPassword(userId);
  if (!user || !user.password) {
    throw new ApiError(400, 'Password change is not available for accounts signed in via Google.');
  }

  const isMatch = await bcrypt.compare(input.currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect.');
  }

  const hashedPassword = await bcrypt.hash(input.newPassword, 10);
  await userRepo.updatePassword(userId, hashedPassword);
  // Refresh token cleared inside the repository update LearnStack forces re-login
  // on every other device once the password changes, which is the
  // expected security behavior after a password change.
};

export const getDashboardSummary = async (userId: string) => {
  const [purchasedCourses, certificateCount, bookmarkCount, recentProgress, recentQuizAttempts] =
    await Promise.all([
      userRepo.getPurchasedCourses(userId),
      userRepo.getCertificateCount(userId),
      userRepo.getBookmarkCount(userId),
      userRepo.getRecentProgress(userId),
      userRepo.getRecentQuizAttempts(userId),
    ]);

  return {
    purchasedCourses,
    stats: {
      totalCoursesPurchased: purchasedCourses.length,
      totalCertificates: certificateCount,
      totalBookmarks: bookmarkCount,
    },
    recentLessons: recentProgress,
    recentQuizResults: recentQuizAttempts,
  };
};

// ---------- Bookmarks ----------

export const toggleBookmark = async (userId: string, courseId: string) => {
  const course = await userRepo.findCourseById(courseId);
  if (!course) throw new ApiError(404, 'Course not found.');

  const existing = await userRepo.findBookmark(userId, courseId);
  if (existing) {
    await userRepo.removeBookmark(userId, courseId);
    return { bookmarked: false };
  }

  await userRepo.addBookmark(userId, courseId);
  return { bookmarked: true };
};

export const getMyBookmarks = async (userId: string) => {
  return userRepo.getBookmarks(userId);
};