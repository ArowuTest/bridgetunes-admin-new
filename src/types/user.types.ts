export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreationParams {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'viewer';
}

export interface UserUpdateParams {
  username?: string;
  email?: string;
  role?: 'admin' | 'manager' | 'viewer';
  status?: 'active' | 'inactive';
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
