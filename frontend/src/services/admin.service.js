import api from './api';

/**
 * Admin Service
 * Handles all admin-related API calls
 */
class AdminService {
  /**
   * Get all users with pagination and filters
   */
  async getAllUsers(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.city) params.append('city', filters.city);

    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  }

  /**
   * Get specific user with all health data
   */
  async getUserDetails(userId) {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  }

  /**
   * Get all health data for a specific user
   */
  async getUserHealthData(userId) {
    const response = await api.get(`/admin/users/${userId}/health-data`);
    return response.data;
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  }

  /**
   * Update user role
   */
  async updateUserRole(userId, role) {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  }

  /**
   * Get system-wide statistics
   */
  async getSystemStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  }

  /**
   * Get analytics data
   */
  async getAnalytics(query = {}) {
    const params = new URLSearchParams();
    
    if (query.groupBy) params.append('groupBy', query.groupBy);
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);

    const response = await api.get(`/admin/analytics?${params.toString()}`);
    return response.data;
  }

  /**
   * Upload CSV file for bulk health data creation
   */
  async uploadCsv(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/admin/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Get admin settings
   */
  async getAdminSettings() {
    const response = await api.get('/admin/settings');
    return response.data;
  }

  /**
   * Update admin settings
   */
  async updateAdminSettings(settings) {
    const response = await api.patch('/admin/settings', settings);
    return response.data;
  }

  /**
   * Export all data
   */
  async exportAllData() {
    const response = await api.post('/admin/export-data');
    return response.data;
  }

  /**
   * Clear cache
   */
  async clearCache() {
    const response = await api.post('/admin/clear-cache');
    return response.data;
  }

  /**
   * Archive old records
   */
  async archiveOldRecords() {
    const response = await api.post('/admin/archive-records');
    return response.data;
  }
}

export default new AdminService();

