import React from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TimeSeriesData } from '../../types/dashboard.types';

// Add a new interface that matches the data structure passed from Dashboard
interface ChartData {
  labels: string[];
  rechargeAmounts: number[];
  participantCounts: number[];
}

interface ChartProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  data: TimeSeriesData[] | ChartData; // Accept both data formats
}

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const IconContainer = styled.div`
  margin-right: 1rem;
  color: ${props => props.theme.colors.primary};
  font-size: 1.5rem;
`;

const TitleContainer = styled.div``;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  color: #212529;
  margin: 0;
  font-weight: 600;
`;

const ChartSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray600};
  margin: 0.25rem 0 0 0;
`;

const ChartContent = styled.div`
  height: 300px;
  width: 100%;
`;

const CustomTooltip = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TooltipLabel = styled.p`
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #212529;
`;

const TooltipItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
`;

const TooltipColor = styled.span<{ color: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: ${props => props.color};
  margin-right: 0.5rem;
  border-radius: 50%;
`;

const TooltipValue = styled.span`
  font-weight: 500;
`;

const AnalyticsChart: React.FC<ChartProps> = ({ data, title, subtitle, icon }) => {
  // Transform data if it's in the ChartData format
  const transformedData = Array.isArray(data) 
    ? data 
    : data.labels.map((label, index) => ({
        date: label,
        revenue: data.rechargeAmounts[index],
        users: data.participantCounts[index]
      }));

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <CustomTooltip>
          <TooltipLabel>{label}</TooltipLabel>
          {payload.map((entry: any, index: number) => (
            <TooltipItem key={index}>
              <TooltipColor color={entry.color} />
              {entry.name}: <TooltipValue>{entry.value.toLocaleString()}</TooltipValue>
            </TooltipItem>
          ))}
        </CustomTooltip>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      <ChartHeader>
        {icon && <IconContainer>{icon}</IconContainer>}
        <TitleContainer>
          <ChartTitle>{title}</ChartTitle>
          {subtitle && <ChartSubtitle>{subtitle}</ChartSubtitle>}
        </TitleContainer>
      </ChartHeader>
      <ChartContent>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={transformedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#e0e0e0' }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={renderCustomTooltip} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#FFD100"
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="users"
              name="Users"
              stroke="#004F9F"
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContent>
    </ChartContainer>
  );
};

// Add named export alongside default export
export { AnalyticsChart };
export default AnalyticsChart;
