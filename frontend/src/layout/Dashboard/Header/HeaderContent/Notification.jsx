import { useRef, useState, useEffect } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

// project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';
import { notificationsService } from 'services';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function Notification() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    if (!open) {
      fetchNotifications();
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsService.markAsRead(id);
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsService.delete(id);
      await fetchNotifications();
      await fetchUnreadCount();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleFilled style={{ color: '#4CAF50' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#FF9800' }} />;
      case 'error':
        return <WarningOutlined style={{ color: '#F44336' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#2196F3' }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return { color: 'success.main', bgcolor: 'success.lighter' };
      case 'warning':
        return { color: 'warning.main', bgcolor: 'warning.lighter' };
      case 'error':
        return { color: 'error.main', bgcolor: 'error.lighter' };
      default:
        return { color: 'primary.main', bgcolor: 'primary.lighter' };
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={(theme) => ({
          color: 'text.primary',
          bgcolor: open ? 'grey.100' : 'transparent'
        })}
        aria-label="open notifications"
        ref={anchorRef}
        aria-controls={open ? 'notification-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={unreadCount} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [downMD ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 320, maxWidth: { xs: 320, md: 450 } })}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notifications"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <>
                      {unreadCount > 0 && (
                        <Tooltip title="Mark all as read">
                          <IconButton color="success" size="small" onClick={handleMarkAllAsRead}>
                            <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress size={30} />
                    </Box>
                  ) : notifications.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                      <BellOutlined style={{ fontSize: '2.5rem', color: '#9E9E9E' }} />
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        No notifications yet
                      </Typography>
                    </Box>
                  ) : (
                    <List
                      component="nav"
                      sx={{
                        p: 0,
                        maxHeight: 400,
                        overflowY: 'auto',
                        '& .MuiListItemButton-root': {
                          py: 1,
                          px: 2,
                          '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                          '& .MuiAvatar-root': avatarSX,
                          '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                        }
                      }}
                    >
                      {notifications.slice(0, 10).map((notification, index) => (
                        <ListItem
                          key={notification.id}
                          component={ListItemButton}
                          divider={index < notifications.length - 1}
                          selected={!notification.isRead}
                          onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                          secondaryAction={
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notification.id);
                                }}
                              >
                                <DeleteOutlined style={{ fontSize: '1rem' }} />
                              </IconButton>
                            </Tooltip>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={getNotificationColor(notification.type)}>{getNotificationIcon(notification.type)}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" sx={{ fontWeight: !notification.isRead ? 600 : 400 }}>
                                {notification.title}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                                  {notification.message}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {formatTime(notification.createdAt)}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                  {notifications.length > 0 && (
                    <>
                      <Divider />
                      <Box sx={{ textAlign: 'center', py: 1.5 }}>
                        <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', fontWeight: 500 }}>
                          View All Notifications
                        </Typography>
                      </Box>
                    </>
                  )}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
