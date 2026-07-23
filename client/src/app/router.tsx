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

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/courses', element: <CourseListPage /> },
      { path: '/courses/:slug', element: <CourseDetailPage /> },
      { path: '/playground', element: <PlaygroundPage /> },
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
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export const AppRouter = () => <RouterProvider router={router} />;