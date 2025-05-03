// /home/ubuntu/bridgetunes-admin-new/src/types/auth.types.ts

// Central definition for the User object
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  name: string; // Added the name property
  createdAt: string;
  updatedAt: string;
}

// Represents the state managed by AuthContext
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Credentials used for logging in
export interface LoginCredentials {
  email: string;
  password: string;
}

// Data used for registration (if applicable)
export interface RegisterData extends LoginCredentials {
  username: string;
  role: 'admin' | 'manager' | 'viewer';
  name: string; // Include name for registration too
}

// Expected structure of the response from the backend /auth/login endpoint
export interface AuthResponse {
  success?: boolean; // Optional success flag
  message?: string; // Optional message from backend
  token: string;
  user: Partial<User>; // Backend might return only a partial User object
}

// Generic API error structure (optional)
export interface ApiError {
  message: string;
  statusCode?: number;
}

