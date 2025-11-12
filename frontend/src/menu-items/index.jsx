// project import
import dashboard from './dashboard';
import admin from './admin';
import { UserRole } from '../types/auth.types';

// ==============================|| MENU ITEMS ||============================== //

// User menu items
const userMenuItems = {
  items: [dashboard]
};

// Admin menu items
const adminMenuItems = {
  items: [admin]
};

/**
 * Get menu items based on user role
 */
export const getMenuItems = (userRole) => {
  if (userRole === UserRole.ADMIN) {
    return adminMenuItems;
  }
  return userMenuItems;
};

// Default export for backward compatibility
export default userMenuItems;
