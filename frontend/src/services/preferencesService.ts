import api from './api';

interface UserPreferences {
  id: string;
  userId: string;
  targetHealthScore: number;
  targetBMI: number;
  targetWeight: number;
  enableHealthReminders: boolean;
  reminderFrequency: string;
  nextCheckupDate: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  labUploadReminders: boolean;
  scoreUpdateNotifications: boolean;
  healthInsightsNotifications: boolean;
  recommendationsNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

class PreferencesService {
  async get(): Promise<UserPreferences> {
    const response = await api.get<UserPreferences>('/users/preferences');
    return response.data;
  }

  async update(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const response = await api.post<UserPreferences>('/users/preferences', preferences);
    return response.data;
  }
}

export default new PreferencesService();

