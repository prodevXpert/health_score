import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';

// auth
const LoginPage = Loadable(lazy(() => import('pages/Login/LoginPage')));
const RegisterPage = Loadable(lazy(() => import('pages/Register/RegisterPage')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = [
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  }
];

export default LoginRoutes;
