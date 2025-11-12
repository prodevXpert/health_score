import { createBrowserRouter } from 'react-router-dom';

// project imports
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import AdminRoutes from './AdminRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([...LoginRoutes, MainRoutes, AdminRoutes], { basename: import.meta.env.VITE_APP_BASE_NAME });

export default router;
