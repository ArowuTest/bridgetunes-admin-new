import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';

// Define the key used to store the auth token in localStorage
const AUTH_TOKEN_KEY = 'authToken';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1'; // Use the same base URL as auth.service.ts

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
    // Retrieve the token using the consistent key
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Note: The authService object defined here seems redundant as auth logic is primarily in auth.service.ts
// It might be better to remove this or ensure it uses the functions from auth.service.ts
// For now, just ensuring the interceptor uses the correct key.

// Example of how other services might use the configured 'api' instance:
/*
export const someOtherService = {
  getData: async () => {
    try {
      const response = await api.get('/some-protected-endpoint');
      return response.data;
    } catch (error) {
      // Handle error (the interceptor should handle 401 automatically if token is invalid/expired)
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch data');
      }
      throw new Error('Network error occurred');
    }
  }
};
*/

export default api;



