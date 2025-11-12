import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute';

// render - Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - My Health Score
const MyHealthScorePage = Loadable(lazy(() => import('pages/MyHealthScore/MyHealthScorePage')));

// render - Trends
const TrendsPage = Loadable(lazy(() => import('pages/Trends/TrendsPage')));

// render - Reports
const ReportsPage = Loadable(lazy(() => import('pages/Reports/ReportsPage')));

// render - Recommendations
const RecommendationsPage = Loadable(lazy(() => import('pages/Recommendations/RecommendationsPage')));

// render - Settings
const SettingsPage = Loadable(lazy(() => import('pages/Settings/SettingsPage')));

// render - Health Data Form
const HealthDataForm = Loadable(lazy(() => import('pages/HealthDataForm')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <ProtectedRoute element={<DashboardLayout />} />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'my-health-score',
      element: <MyHealthScorePage />
    },
    {
      path: 'trends',
      element: <TrendsPage />
    },
    {
      path: 'reports',
      element: <ReportsPage />
    },
    {
      path: 'recommendations',
      element: <RecommendationsPage />
    },
    {
      path: 'settings',
      element: <SettingsPage />
    },
    {
      path: 'health-data',
      element: <HealthDataForm />
    }
  ]
};

export default MainRoutes;
