import api from './api';

interface Recommendation {
  id: string;
  userId: string;
  category: string;
  title: string;
  description: string;
  priority: string;
  relatedMetric: string;
  currentValue: string;
  isCompleted: boolean;
  isDismissed: boolean;
  createdAt: string;
  updatedAt: string;
}

class RecommendationsService {
  async getAll(): Promise<Recommendation[]> {
    const response = await api.get<Recommendation[]>('/recommendations');
    return response.data;
  }

  async generate(): Promise<Recommendation[]> {
    const response = await api.post<Recommendation[]>('/recommendations/generate');
    return response.data;
  }

  async markAsCompleted(id: string): Promise<Recommendation> {
    const response = await api.post<Recommendation>(`/recommendations/${id}/complete`);
    return response.data;
  }

  async dismiss(id: string): Promise<Recommendation> {
    const response = await api.post<Recommendation>(`/recommendations/${id}/dismiss`);
    return response.data;
  }
}

export default new RecommendationsService();

