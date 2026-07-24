import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import StudentDashboardLayout from '@/layouts/StudentDashboardLayout';
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import AdminRoute from '@/routes/AdminRoute';

import HomePage from '@/pages/HomePage';
import CourseListPage from '@/pages/CourseListPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import StudentDashboardPage from '@/pages/StudentDashboardPage';
import AdminOverviewPage from '@/pages/admin/AdminOverviewPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PlaygroundPage from '@/pages/PlaygroundPage';
import AdminCourseEditorPage from '@/pages/admin/AdminCourseEditorPage';
import AdminCoursesPage from '@/pages/admin/AdminCoursesPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage'
import QuizPage from '@/pages/QuizPage';
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage';
import AdminCouponsPage from '@/pages/admin/AdminCouponsPage';
import LessonPage from '@/pages/LessonPage';
import CertificatesPage from '@/pages/CertificatesPage';
import CertificateVerifyPage from '@/pages/CertificateVerifyPage';
import AdminModerationPage from '@/pages/admin/AdminModerationPage';
import BookmarksPage from '@/pages/BookmarksPage';
import AdminNotificationsPage from '@/pages/admin/AdminNotificationsPage';
import BlogListPage from '@/pages/BlogListPage';
import BlogPostPage from '@/pages/BlogPostPage';
import AdminBlogPage from '@/pages/admin/AdminBlogPage';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/courses', element: <CourseListPage /> },
      { path: '/courses/:slug', element: <CourseDetailPage /> },
      { path: '/playground', element: <PlaygroundPage /> },
      { path: '/verify-certificate/:code', element: <CertificateVerifyPage /> },
      { path: '/blog', element: <BlogListPage /> },
      { path: '/blog/:slug', element: <BlogPostPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <StudentDashboardLayout />,
        children: [
          { path: '/dashboard', element: <StudentDashboardPage /> },
          { path: '/quiz/:quizId', element: <QuizPage /> },
          { path: '/learn/:lessonId', element: <LessonPage /> },
          { path: '/dashboard/certificates', element: <CertificatesPage /> },
          { path: '/dashboard/bookmarks', element: <BookmarksPage /> },
        ],
        
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminDashboardLayout />,
        children: [
          { path: '/admin', element: <AdminOverviewPage /> },
          { path: '/admin/courses/:id', element: <AdminCourseEditorPage /> },
          { path: '/admin/courses', element: <AdminCoursesPage /> },
          { path: '/admin/users', element: <AdminUsersPage /> },
          { path: '/admin/categories', element: <AdminCategoriesPage /> },
          { path: '/admin/coupons', element: <AdminCouponsPage /> },
          { path: '/admin/moderation', element: <AdminModerationPage /> },
          { path: '/admin/notifications', element: <AdminNotificationsPage /> },
          { path: '/admin/blog', element: <AdminBlogPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export const AppRouter = () => <RouterProvider router={router} />;