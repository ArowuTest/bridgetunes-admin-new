import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { RevenueByCategory } from '../../types/dashboard.types';

interface DonutChartProps {
  data: RevenueByCategory[];
  title: string;
}

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  color: #212529;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
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

const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <CustomTooltip>
          <TooltipLabel>{item.name}</TooltipLabel>
          <TooltipItem>
            <TooltipColor color={item.color} />
            Amount: <TooltipValue>₦{item.value.toLocaleString()}</TooltipValue>
          </TooltipItem>
          <TooltipItem>
            <TooltipColor color={item.color} />
            Percentage: <TooltipValue>{item.payload.percentage}%</TooltipValue>
          </TooltipItem>
        </CustomTooltip>
      );
    }
    return null;
  };

  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>
      <ChartContent>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="amount"
              nameKey="category"
              label={({ category, percentage }) => `${category}: ${percentage}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
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

export default DonutChart;
