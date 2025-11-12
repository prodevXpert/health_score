import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// project imports
import { useAuth } from 'contexts/AuthContext';

// assets
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import HeartOutlined from '@ant-design/icons/HeartOutlined';
import LineChartOutlined from '@ant-design/icons/LineChartOutlined';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab({ handleClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    handleClose?.();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    handleClose?.();
    navigate(path);
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton onClick={() => handleNavigation('/dashboard')}>
        <ListItemIcon>
          <DashboardOutlined />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton onClick={() => handleNavigation('/my-health-score')}>
        <ListItemIcon>
          <HeartOutlined />
        </ListItemIcon>
        <ListItemText primary="My Health Score" />
      </ListItemButton>
      <ListItemButton onClick={() => handleNavigation('/trends')}>
        <ListItemIcon>
          <LineChartOutlined />
        </ListItemIcon>
        <ListItemText primary="Trends" />
      </ListItemButton>
      <ListItemButton onClick={() => handleNavigation('/settings')}>
        <ListItemIcon>
          <SettingOutlined />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = { handleClose: PropTypes.func };
