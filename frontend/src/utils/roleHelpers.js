import { UserRole } from '../types/auth.types';

/**
 * Check if user has admin role
 */
export const isAdmin = (user) => {
  return user?.role === UserRole.ADMIN;
};

/**
 * Check if user has user role
 */
export const isUser = (user) => {
  return user?.role === UserRole.USER;
};

/**
 * Check if user has insurer role
 */
export const isInsurer = (user) => {
  return user?.role === UserRole.INSURER;
};

/**
 * Check if user has any of the specified roles
 */
export const hasRole = (user, roles) => {
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};

