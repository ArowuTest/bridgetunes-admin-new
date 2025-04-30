import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { RevenueByCategory } from '../../types/dashboard.types';

// Add a new interface that matches the data structure passed from Dashboard
interface DonutData {
  labels: string[];
  values: number[];
}

interface DonutChartProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  data: RevenueByCategory[] | DonutData; // Accept both data formats
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
  display: flex;
  flex-direction: column;
  align-items: center;
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

// MTN brand colors and complementary colors
const COLORS = ['#FFD100', '#004F9F', '#1EC7E6', '#FF6B00', '#6F2586', '#E30613', '#97D700', '#7C878E', '#00C389'];

const DonutChart: React.FC<DonutChartProps> = ({ data, title, subtitle, icon }) => {
  // Transform data if it's in the DonutData format
  const transformedData = Array.isArray(data)
    ? data
    : data.labels.map((label, index) => ({
        category: label,
        percentage: data.values[index],
        amount: data.values[index] // Assuming value represents amount for tooltip
      }));

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <CustomTooltip>
          <TooltipLabel>{item.name}</TooltipLabel>
          {/* Display percentage from transformed data */}
          <TooltipItem>
            <TooltipColor color={item.payload.fill} />
            Percentage: <TooltipValue>{item.payload.percentage}%</TooltipValue>
          </TooltipItem>
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
          <PieChart>
            <Pie
              data={transformedData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="percentage" // Use percentage as the value for the pie slices
              nameKey="category"
              labelLine={false}
              label={({ category, percentage }) => `${category}: ${percentage}%`}
            >
              {transformedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderCustomTooltip} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContent>
    </ChartContainer>
  );
};

// Add named export alongside default export
export { DonutChart };
export default DonutChart;

