// /home/ubuntu/bridgetunes-admin-new/src/services/user.service.ts
import axios from "axios";
import {
  UserCreationParams,
  UserUpdateParams,
  PasswordChangeParams,
  PasswordResetParams,
  UserActivity,
  UserStats,
} from "../types/user.types"; // Keep these specific types
import { User } from "../types/auth.types"; // Import User from the central location

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Use the correct key 'authToken' as established previously
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>("/users");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to fetch users");
      }
      throw new Error("Network error occurred");
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to fetch user");
      }
      throw new Error("Network error occurred");
    }
  },

  createUser: async (userData: UserCreationParams): Promise<User> => {
    try {
      const response = await api.post<User>("/users", userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to create user");
      }
      throw new Error("Network error occurred");
    }
  },

  updateUser: async (id: string, userData: UserUpdateParams): Promise<User> => {
    try {
      const response = await api.put<User>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to update user");
      }
      throw new Error("Network error occurred");
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to delete user");
      }
      throw new Error("Network error occurred");
    }
  },

  changePassword: async (
    id: string,
    passwordData: PasswordChangeParams
  ): Promise<void> => {
    try {
      await api.post(`/users/${id}/change-password`, passwordData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to change password"
        );
      }
      throw new Error("Network error occurred");
    }
  },

  resetPassword: async (resetData: PasswordResetParams): Promise<void> => {
    try {
      await api.post("/users/reset-password", resetData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Failed to reset password");
      }
      throw new Error("Network error occurred");
    }
  },

  getUserActivity: async (userId: string): Promise<UserActivity[]> => {
    try {
      const response = await api.get<UserActivity[]>(`/users/${userId}/activity`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch user activity"
        );
      }
      throw new Error("Network error occurred");
    }
  },

  getUserStats: async (): Promise<UserStats> => {
    try {
      const response = await api.get<UserStats>("/users/stats");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch user statistics"
        );
      }
      throw new Error("Network error occurred");
    }
  },
};

export default userService;


