import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import UsersListPage from '@/pages/admin/UsersListPage';
import UserCreatePage from '@/pages/admin/UserCreatePage';
import UserEditPage from '@/pages/admin/UserEditPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';

export const router = createBrowserRouter([
  // Public routes with RootLayout (navbar)
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },

  // Login route (standalone, no layout navbar)
  {
    path: '/login',
    element: <LoginPage />,
  },

  // Protected dashboard routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // Admin routes (nested under dashboard)
      {
        path: 'admin/users',
        element: (
          <AdminRoute>
            <UsersListPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/users/new',
        element: (
          <AdminRoute>
            <UserCreatePage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/users/:id',
        element: (
          <AdminRoute>
            <UserEditPage />
          </AdminRoute>
        ),
      },
    ],
  },

  // Redirect /app to /dashboard for convenience
  {
    path: '/app',
    element: <Navigate to="/dashboard" replace />,
  },

  // 404 catch-all
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
