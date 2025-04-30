export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTopups: number;
  totalRevenue: number;
  totalDraws: number;
  totalWinners: number;
  totalPrizes: number;
}

export interface UserActivity {
  id: string;
  msisdn: string;
  name?: string;
  topups: number;
  points: number;
  lastActive: string;
}

export interface DrawStats {
  id: string;
  name: string;
  date: string;
  status: string;
  participants: number;
  winners: number;
  totalPrize: number;
}

export interface TimeSeriesData {
  date: string;
  users?: number;
  topups?: number;
  revenue?: number;
  participants?: number;
  winners?: number;
  [key: string]: string | number | undefined;
}

export interface RevenueByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface SubscriberGrowth {
  date: string;
  count: number;
}

export interface TopUpDistribution {
  amount: number;
  count: number;
  percentage: number;
}

export interface RevenueTrend {
  date: string;
  amount: number;
}
