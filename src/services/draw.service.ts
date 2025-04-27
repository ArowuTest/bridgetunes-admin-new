import axios from 'axios';
import { 
  Draw, 
  DrawParticipant, 
  DrawWinner, 
  DrawCreationParams, 
  DrawUpdateParams 
} from '../types/draw.types';

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

export const drawService = {
  getAllDraws: async (): Promise<Draw[]> => {
    try {
      const response = await api.get<Draw[]>('/draws');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch draws');
      }
      throw new Error('Network error occurred');
    }
  },

  getDrawById: async (id: string): Promise<Draw> => {
    try {
      const response = await api.get<Draw>(`/draws/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch draw');
      }
      throw new Error('Network error occurred');
    }
  },

  createDraw: async (drawData: DrawCreationParams): Promise<Draw> => {
    try {
      const response = await api.post<Draw>('/draws', drawData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to create draw');
      }
      throw new Error('Network error occurred');
    }
  },

  updateDraw: async (id: string, drawData: DrawUpdateParams): Promise<Draw> => {
    try {
      const response = await api.put<Draw>(`/draws/${id}`, drawData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to update draw');
      }
      throw new Error('Network error occurred');
    }
  },

  deleteDraw: async (id: string): Promise<void> => {
    try {
      await api.delete(`/draws/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to delete draw');
      }
      throw new Error('Network error occurred');
    }
  },

  getDrawParticipants: async (drawId: string): Promise<DrawParticipant[]> => {
    try {
      const response = await api.get<DrawParticipant[]>(`/draws/${drawId}/participants`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch draw participants');
      }
      throw new Error('Network error occurred');
    }
  },

  getDrawWinners: async (drawId: string): Promise<DrawWinner[]> => {
    try {
      const response = await api.get<DrawWinner[]>(`/draws/${drawId}/winners`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch draw winners');
      }
      throw new Error('Network error occurred');
    }
  },

  runDraw: async (drawId: string): Promise<DrawWinner[]> => {
    try {
      const response = await api.post<DrawWinner[]>(`/draws/${drawId}/run`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to run draw');
      }
      throw new Error('Network error occurred');
    }
  },

  simulateDraw: async (drawId: string): Promise<DrawWinner[]> => {
    try {
      const response = await api.post<DrawWinner[]>(`/draws/${drawId}/simulate`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to simulate draw');
      }
      throw new Error('Network error occurred');
    }
  }
};

export default drawService;
