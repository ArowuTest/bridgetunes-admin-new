// /home/ubuntu/bridgetunes-admin-new/src/types/user.types.ts

// NOTE: The main User interface is now defined in ./auth.types.ts
// This file contains types specific to user management actions.

export interface UserCreationParams {
  username: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "viewer";
  name: string; // Ensure name is included for creation if needed by backend
}

export interface UserUpdateParams {
  username?: string;
  email?: string;
  role?: "admin" | "manager" | "viewer";
  status?: "active" | "inactive";
  name?: string; // Allow updating name
}

export interface PasswordChangeParams {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetParams {
  email: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  pendingUsers: number;
  adminCount: number;
  managerCount: number;
  viewerCount: number;
}

