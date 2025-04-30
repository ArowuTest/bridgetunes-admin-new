import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUsers, FaMoneyBillWave, FaCalendarAlt, FaBullhorn, FaChartBar, FaChartPie } from 'react-icons/fa';
import { useDemoMode } from '../context/DemoModeContext';
import dashboardService from '../services/dashboard.service';
import PageLayout from '../components/PageLayout';
import StatsCard from '../components/StatsCard';
import Card from '../components/Card';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import DonutChart from '../components/dashboard/DonutChart';
import RecentDrawsTable from '../components/dashboard/RecentDrawsTable';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WelcomeBanner = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  border-radius: 12px;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const Dashboard: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [revenueByCategory, setRevenueByCategory] = useState<any[]>([]);
  const [recentDraws, setRecentDraws] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Use existing service methods
        const dashboardStats = await dashboardService.getDashboardStats();
        const timeSeriesData = await dashboardService.getTimeSeriesData('month');
        const revenueCategories = await dashboardService.getRevenueByCategory();
        const draws = await dashboardService.getRecentDraws(5);
        
        setStats(dashboardStats);
        setTimeSeriesData(timeSeriesData);
        setRevenueByCategory(revenueCategories);
        setRecentDraws(draws);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [isDemoMode]);
  
  if (isLoading) {
    return (
      <PageLayout title="Dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <LoadingSpinner size={60} />
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="Dashboard">
      <DashboardContainer>
        <WelcomeBanner>
          <h1>Welcome to Bridgetunes MTN Admin Portal</h1>
          <p>Monitor your promotion performance, manage draws, and send notifications to participants.</p>
        </WelcomeBanner>
        
        <StatsGrid>
          <StatsCard 
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<FaUsers />}
            color="primary"
          />
          <StatsCard 
            title="Total Revenue"
            value={stats?.totalRevenue || 0}
            icon={<FaMoneyBillWave />}
            color="success"
            isCurrency
          />
          <StatsCard 
            title="Total Draws"
            value={stats?.totalDraws || 0}
            icon={<FaCalendarAlt />}
            color="info"
          />
          <StatsCard 
            title="Total Winners"
            value={stats?.totalWinners || 0}
            icon={<FaBullhorn />}
            color="warning"
          />
        </StatsGrid>
        
        <ChartsContainer>
          <AnalyticsChart 
            title="Activity Trends"
            subtitle="User activity and revenue over time"
            data={{
              labels: timeSeriesData.map(item => item.date),
              rechargeAmounts: timeSeriesData.map(item => item.revenue || 0),
              participantCounts: timeSeriesData.map(item => item.users || 0)
            }}
            icon={<FaChartBar />}
          />
          
          <DonutChart 
            title="Revenue by Category"
            subtitle="Distribution of revenue across categories"
            data={{
              labels: revenueByCategory.map(item => item.category),
              values: revenueByCategory.map(item => item.percentage)
            }}
            icon={<FaChartPie />}
          />
        </ChartsContainer>
        
        <Card>
          <RecentDrawsTable 
            title="Recent Draws"
            draws={recentDraws.map(draw => ({
              id: draw.id,
              date: new Date(draw.date).toLocaleDateString(),
              time: new Date(draw.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              type: draw.name,
              winners: draw.winners,
              prize: `₦${draw.totalPrize.toLocaleString()}`,
              status: draw.status
            }))}
          />
        </Card>
      </DashboardContainer>
    </PageLayout>
  );
};

export default Dashboard;
