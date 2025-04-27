export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalDraws: number;
  pendingDraws: number;
  completedDraws: number;
  totalTransactions: number;
  totalRevenue: number;
  commissionEarned: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TimeSeriesData {
  date: string;
  users?: number;
  transactions?: number;
  revenue?: number;
  commission?: number;
}

export interface DrawStats {
  drawId: string;
  date: string;
  participants: number;
  winners: number;
  totalPrize: number;
}

export interface UserActivity {
  userId: string;
  username: string;
  lastActive: string;
  activityCount: number;
}

export interface RevenueByCategory {
  category: string;
  amount: number;
  percentage: number;
}
