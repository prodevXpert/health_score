import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import RoleProtectedRoute from './RoleProtectedRoute';
import { UserRole } from '../types/auth.types';

// admin pages
const AdminDashboard = Loadable(lazy(() => import('pages/Admin/AdminDashboard')));
const UsersManagement = Loadable(lazy(() => import('pages/Admin/UsersManagement')));
const Analytics = Loadable(lazy(() => import('pages/Admin/Analytics')));
const BulkUpload = Loadable(lazy(() => import('pages/Admin/BulkUpload')));
const AdminSettings = Loadable(lazy(() => import('pages/Admin/AdminSettings')));

// ==============================|| ADMIN ROUTES ||============================== //

const AdminRoutes = {
  path: '/admin',
  element: <RoleProtectedRoute element={<DashboardLayout />} allowedRoles={[UserRole.ADMIN]} />,
  children: [
    {
      path: 'dashboard',
      element: <AdminDashboard />
    },
    {
      path: 'users',
      element: <UsersManagement />
    },
    {
      path: 'analytics',
      element: <Analytics />
    },
    {
      path: 'bulk-upload',
      element: <BulkUpload />
    },
    {
      path: 'settings',
      element: <AdminSettings />
    }
  ]
};

export default AdminRoutes;

