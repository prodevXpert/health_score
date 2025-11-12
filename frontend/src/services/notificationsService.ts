import api from './api';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

class NotificationsService {
  async getAll(): Promise<Notification[]> {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await api.get<{ count: number }>('/notifications/unread');
    return response.data.count;
  }

  async markAsRead(id: string): Promise<Notification> {
    const response = await api.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  }
}

export default new NotificationsService();

