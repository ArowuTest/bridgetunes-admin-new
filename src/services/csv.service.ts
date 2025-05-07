import axios from 'axios';
import { 
  CSVData, 
  CSVUploadResponse, 
  CSVUploadStats,
  CSVUploadHistory,
  CSVUploadSummary
} from '../types/csv.types';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

export const csvService = {
  uploadCSV: async (file: File): Promise<CSVUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<CSVUploadResponse>('/csv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to upload CSV file');
      }
      throw new Error('Network error occurred');
    }
  },
  
  getUploadStats: async (): Promise<CSVUploadStats> => {
    try {
      const response = await api.get<CSVUploadStats>('/csv/stats');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch CSV upload statistics');
      }
      throw new Error('Network error occurred');
    }
  },
  
  getUploadHistory: async (): Promise<CSVUploadHistory[]> => {
    try {
      const response = await api.get<CSVUploadHistory[]>('/csv/history');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch CSV upload history');
      }
      throw new Error('Network error occurred');
    }
  },
  
  getUploadSummary: async (uploadId: string): Promise<CSVUploadSummary> => {
    try {
      const response = await api.get<CSVUploadSummary>(`/csv/summary/${uploadId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch CSV upload summary');
      }
      throw new Error('Network error occurred');
    }
  },
  
  downloadTemplate: async (): Promise<Blob> => {
    try {
      const response = await api.get('/csv/template', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to download CSV template');
      }
      throw new Error('Network error occurred');
    }
  },
  
  validateCSV: async (file: File): Promise<CSVUploadSummary> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<CSVUploadSummary>('/csv/validate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to validate CSV file');
      }
      throw new Error('Network error occurred');
    }
  }
};

export default csvService;
