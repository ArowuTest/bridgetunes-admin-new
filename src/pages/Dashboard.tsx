import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUsers, FaMoneyBillWave, FaTrophy, FaChartLine } from 'react-icons/fa';
import StatCard from '../components/dashboard/StatCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import DonutChart from '../components/dashboard/DonutChart';
import RecentDrawsTable from '../components/dashboard/RecentDrawsTable';
import { dashboardService } from '../services/dashboard.service';
import { DashboardStats, TimeSeriesData, DrawStats, RevenueByCategory } from '../types/dashboard.types';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  color: #212529;
  margin: 0 0 0.5rem 0;
`;

const PageDescription = styled.p`
  color: #6c757d;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ErrorContainer = styled.div`
  padding: 1.5rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [recentDraws, setRecentDraws] = useState<DrawStats[]>([]);
  const [revenueByCategory, setRevenueByCategory] = useState<RevenueByCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all dashboard data in parallel
        const [statsData, timeSeriesData, drawsData, revenueData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getTimeSeriesData(timePeriod),
          dashboardService.getRecentDraws(5),
          dashboardService.getRevenueByCategory()
        ]);
        
        setStats(statsData);
        setTimeSeriesData(timeSeriesData);
        setRecentDraws(drawsData);
        setRevenueByCategory(revenueData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [timePeriod]);
  
  // Mock data for development/preview
  const mockTimeSeriesData: TimeSeriesData[] = [
    { date: '2025-04-01', users: 1200, transactions: 3500, revenue: 850000, commission: 42500 },
    { date: '2025-04-02', users: 1250, transactions: 3600, revenue: 870000, commission: 43500 },
    { date: '2025-04-03', users: 1300, transactions: 3700, revenue: 890000, commission: 44500 },
    { date: '2025-04-04', users: 1350, transactions: 3800, revenue: 910000, commission: 45500 },
    { date: '2025-04-05', users: 1400, transactions: 3900, revenue: 930000, commission: 46500 },
    { date: '2025-04-06', users: 1450, transactions: 4000, revenue: 950000, commission: 47500 },
    { date: '2025-04-07', users: 1500, transactions: 4100, revenue: 970000, commission: 48500 },
  ];
  
  const mockRevenueData: RevenueByCategory[] = [
    { category: 'Top-up ≤ ₦199', amount: 250000, percentage: 25 },
    { category: 'Top-up ₦200-₦499', amount: 350000, percentage: 35 },
    { category: 'Top-up ₦500-₦999', amount: 200000, percentage: 20 },
    { category: 'Top-up ≥ ₦1,000', amount: 200000, percentage: 20 },
  ];
  
  const mockDrawsData: DrawStats[] = [
    { drawId: 'DRW001', date: '2025-04-26', participants: 5000, winners: 10, totalPrize: 100000 },
    { drawId: 'DRW002', date: '2025-04-25', participants: 4800, winners: 10, totalPrize: 100000 },
    { drawId: 'DRW003', date: '2025-04-24', participants: 4600, winners: 10, totalPrize: 100000 },
    { drawId: 'DRW004', date: '2025-04-23', participants: 4400, winners: 10, totalPrize: 100000 },
    { drawId: 'DRW005', date: '2025-04-22', participants: 4200, winners: 10, totalPrize: 100000 },
  ];

  return (
    <DashboardContainer>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
        <PageDescription>Overview of the Bridgetunes MTN "MyNumba Don Win" promotion campaign</PageDescription>
      </PageHeader>
      
      {error && (
        <ErrorContainer>
          <strong>Error:</strong> {error}
        </ErrorContainer>
      )}
      
      {loading && !stats ? (
        <LoadingContainer>Loading dashboard data...</LoadingContainer>
      ) : (
        <>
          <StatsGrid>
            <StatCard
              title="Total Users"
              value={stats?.totalUsers.toLocaleString() || '12,500'}
              icon={<FaUsers />}
              change={5.2}
              changeLabel="vs last month"
              color="primary"
            />
            <StatCard
              title="Total Revenue"
              value={`₦${stats?.totalRevenue.toLocaleString() || '9,750,000'}`}
              icon={<FaMoneyBillWave />}
              change={8.7}
              changeLabel="vs last month"
              color="success"
            />
            <StatCard
              title="Commission Earned"
              value={`₦${stats?.commissionEarned.toLocaleString() || '487,500'}`}
              icon={<FaChartLine />}
              change={8.7}
              changeLabel="vs last month"
              color="info"
            />
            <StatCard
              title="Total Draws"
              value={stats?.totalDraws.toLocaleString() || '35'}
              icon={<FaTrophy />}
              change={0}
              changeLabel="vs last month"
              color="warning"
            />
          </StatsGrid>
          
          <ChartsGrid>
            <AnalyticsChart
              title="Performance Overview"
              data={timeSeriesData.length > 0 ? timeSeriesData : mockTimeSeriesData}
              dataKeys={[
                { key: 'users', color: '#FFD100', name: 'Users' },
                { key: 'transactions', color: '#004F9F', name: 'Transactions' }
              ]}
            />
            <DonutChart
              title="Revenue by Category"
              data={revenueByCategory.length > 0 ? revenueByCategory : mockRevenueData}
            />
          </ChartsGrid>
          
          <RecentDrawsTable
            title="Recent Draws"
            data={recentDraws.length > 0 ? recentDraws : mockDrawsData}
          />
        </>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
