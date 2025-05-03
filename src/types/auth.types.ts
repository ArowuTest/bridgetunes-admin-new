// /home/ubuntu/bridgetunes-admin-new/src/types/auth.types.ts

// Central User definition - Single Source of Truth
export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  name: string; // Added based on component needs
  status?: "active" | "inactive" | "pending"; // Added from user.types.ts (optional)
  lastLogin?: string; // Added from user.types.ts (optional)
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Interface for the expected response from the backend /auth/login endpoint
export interface AuthResponse {
  token: string;
  user: Partial<User>; // Backend might only return partial user data on login
}


