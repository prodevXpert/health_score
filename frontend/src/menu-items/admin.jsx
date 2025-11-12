// assets
import {
  DashboardOutlined,
  TeamOutlined,
  BarChartOutlined,
  UploadOutlined,
  SettingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  TeamOutlined,
  BarChartOutlined,
  UploadOutlined,
  SettingOutlined
};

// ==============================|| MENU ITEMS - ADMIN ||============================== //

const admin = {
  id: 'group-admin',
  title: 'Admin Portal',
  type: 'group',
  children: [
    {
      id: 'admin-dashboard',
      title: 'Admin Dashboard',
      type: 'item',
      url: '/admin/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'users-management',
      title: 'Users Management',
      type: 'item',
      url: '/admin/users',
      icon: icons.TeamOutlined,
      breadcrumbs: false
    },
    {
      id: 'analytics',
      title: 'Analytics',
      type: 'item',
      url: '/admin/analytics',
      icon: icons.BarChartOutlined,
      breadcrumbs: false
    },
    {
      id: 'bulk-upload',
      title: 'Bulk Upload',
      type: 'item',
      url: '/admin/bulk-upload',
      icon: icons.UploadOutlined,
      breadcrumbs: false
    },
    {
      id: 'admin-settings',
      title: 'Settings',
      type: 'item',
      url: '/admin/settings',
      icon: icons.SettingOutlined,
      breadcrumbs: false
    }
  ]
};

export default admin;

