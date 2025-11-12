// assets
import {
  DashboardOutlined,
  HeartOutlined,
  LineChartOutlined,
  FileTextOutlined,
  BulbOutlined,
  SettingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  HeartOutlined,
  LineChartOutlined,
  FileTextOutlined,
  BulbOutlined,
  SettingOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Health Score Bureau',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'my-health-score',
      title: 'My Health Score',
      type: 'item',
      url: '/my-health-score',
      icon: icons.HeartOutlined,
      breadcrumbs: false
    },
    {
      id: 'trends',
      title: 'Trends',
      type: 'item',
      url: '/trends',
      icon: icons.LineChartOutlined,
      breadcrumbs: false
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/reports',
      icon: icons.FileTextOutlined,
      breadcrumbs: false
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      type: 'item',
      url: '/recommendations',
      icon: icons.BulbOutlined,
      breadcrumbs: false
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/settings',
      icon: icons.SettingOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
