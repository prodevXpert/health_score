import api from './api';
import { User, UpdateUserProfileDto } from '../types';

/**
 * User Service
 * Handles user profile-related API calls
 */
class UserService {
  /**
   * Get current user details
   * GET /users/me
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/users/me');
    
    // Update stored user data
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  }

  /**
   * Update user profile
   * PATCH /users/me
   */
  async updateProfile(data: UpdateUserProfileDto): Promise<User> {
    const response = await api.patch<User>('/users/me', data);
    
    // Update stored user data
    localStorage.setItem('user', JSON.stringify(response.data));
    
    return response.data;
  }
}

export default new UserService();

