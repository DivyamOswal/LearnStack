import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
// import StudentDashboardLayout from '@/layouts/StudentDashboardLayout';
// import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';
// import ProtectedRoute from '@/routes/ProtectedRoute';
// import AdminRoute from '@/routes/AdminRoute';

import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
// import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
// import ResetPasswordPage from '@/pages/ResetPasswordPage';
// import StudentDashboardPage from '@/pages/StudentDashboardPage';
// import AdminOverviewPage from '@/pages/admin/AdminOverviewPage';
// import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      // { path: '/forgot-password', element: <ForgotPasswordPage /> },
      // { path: '/reset-password', element: <ResetPasswordPage /> },
    ],
  },
  // {
  //   element: <ProtectedRoute />,
  //   children: [
  //     {
  //       element: <StudentDashboardLayout />,
  //       children: [{ path: '/dashboard', element: <StudentDashboardPage /> }],
  //     },
  //   ],
  // },
  // {
  //   element: <AdminRoute />,
  //   children: [
  //     {
  //       element: <AdminDashboardLayout />,
  //       children: [{ path: '/admin', element: <AdminOverviewPage /> }],
  //     },
  //   ],
  // },
  // { path: '*', element: <NotFoundPage /> },
]);

export const AppRouter = () => <RouterProvider router={router} />;