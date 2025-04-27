import axios from 'axios';
import { DashboardStats, TimeSeriesData, DrawStats, UserActivity, RevenueByCategory } from '../types/dashboard.types';

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

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<DashboardStats>('/dashboard/stats');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch dashboard stats');
      }
      throw new Error('Network error occurred');
    }
  },

  getTimeSeriesData: async (period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<TimeSeriesData[]> => {
    try {
      const response = await api.get<TimeSeriesData[]>(`/dashboard/timeseries?period=${period}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch time series data');
      }
      throw new Error('Network error occurred');
    }
  },

  getRecentDraws: async (limit: number = 5): Promise<DrawStats[]> => {
    try {
      const response = await api.get<DrawStats[]>(`/dashboard/draws?limit=${limit}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch recent draws');
      }
      throw new Error('Network error occurred');
    }
  },

  getActiveUsers: async (limit: number = 5): Promise<UserActivity[]> => {
    try {
      const response = await api.get<UserActivity[]>(`/dashboard/users/active?limit=${limit}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch active users');
      }
      throw new Error('Network error occurred');
    }
  },

  getRevenueByCategory: async (): Promise<RevenueByCategory[]> => {
    try {
      const response = await api.get<RevenueByCategory[]>('/dashboard/revenue/categories');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch revenue by category');
      }
      throw new Error('Network error occurred');
    }
  }
};

export default dashboardService;
