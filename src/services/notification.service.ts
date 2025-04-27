import axios from 'axios';
import { 
  Notification, 
  NotificationTemplate,
  NotificationCreationParams,
  NotificationTemplateCreationParams,
  NotificationStats
} from '../types/notification.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const notificationService = {
  getAllNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await api.get<Notification[]>('/notifications');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch notifications');
      }
      throw new Error('Network error occurred');
    }
  },

  getNotificationById: async (id: string): Promise<Notification> => {
    try {
      const response = await api.get<Notification>(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch notification');
      }
      throw new Error('Network error occurred');
    }
  },

  createNotification: async (notificationData: NotificationCreationParams): Promise<Notification> => {
    try {
      const response = await api.post<Notification>('/notifications', notificationData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to create notification');
      }
      throw new Error('Network error occurred');
    }
  },

  deleteNotification: async (id: string): Promise<void> => {
    try {
      await api.delete(`/notifications/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to delete notification');
      }
      throw new Error('Network error occurred');
    }
  },

  resendNotification: async (id: string): Promise<Notification> => {
    try {
      const response = await api.post<Notification>(`/notifications/${id}/resend`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to resend notification');
      }
      throw new Error('Network error occurred');
    }
  },

  getAllTemplates: async (): Promise<NotificationTemplate[]> => {
    try {
      const response = await api.get<NotificationTemplate[]>('/notifications/templates');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch notification templates');
      }
      throw new Error('Network error occurred');
    }
  },

  getTemplateById: async (id: string): Promise<NotificationTemplate> => {
    try {
      const response = await api.get<NotificationTemplate>(`/notifications/templates/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch notification template');
      }
      throw new Error('Network error occurred');
    }
  },

  createTemplate: async (templateData: NotificationTemplateCreationParams): Promise<NotificationTemplate> => {
    try {
      const response = await api.post<NotificationTemplate>('/notifications/templates', templateData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to create notification template');
      }
      throw new Error('Network error occurred');
    }
  },

  updateTemplate: async (id: string, templateData: NotificationTemplateCreationParams): Promise<NotificationTemplate> => {
    try {
      const response = await api.put<NotificationTemplate>(`/notifications/templates/${id}`, templateData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to update notification template');
      }
      throw new Error('Network error occurred');
    }
  },

  deleteTemplate: async (id: string): Promise<void> => {
    try {
      await api.delete(`/notifications/templates/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to delete notification template');
      }
      throw new Error('Network error occurred');
    }
  },

  getNotificationStats: async (): Promise<NotificationStats> => {
    try {
      const response = await api.get<NotificationStats>('/notifications/stats');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch notification statistics');
      }
      throw new Error('Network error occurred');
    }
  }
};

export default notificationService;
