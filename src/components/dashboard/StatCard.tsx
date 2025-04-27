import React from 'react';
import styled from 'styled-components';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  changeLabel?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

const CardContainer = styled.div<{ color?: string }>`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid ${({ color }) => 
    color === 'primary' ? '#FFD100' : 
    color === 'success' ? '#28a745' : 
    color === 'warning' ? '#ffc107' : 
    color === 'danger' ? '#dc3545' : 
    color === 'info' ? '#17a2b8' : '#FFD100'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0;
  font-weight: 500;
  text-transform: uppercase;
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 209, 0, 0.1);
  color: #FFD100;
`;

const CardValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.5rem;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
`;

const ChangeIndicator = styled.span<{ positive?: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ positive }) => (positive ? '#28a745' : '#dc3545')};
  margin-right: 0.5rem;
`;

const ChangeLabel = styled.span`
  font-size: 0.875rem;
  color: #6c757d;
`;

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  color = 'primary'
}) => {
  const isPositive = change !== undefined ? change >= 0 : undefined;
  
  return (
    <CardContainer color={color}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {icon && <IconContainer>{icon}</IconContainer>}
      </CardHeader>
      <CardValue>{value}</CardValue>
      {(change !== undefined || changeLabel) && (
        <CardFooter>
          {change !== undefined && (
            <ChangeIndicator positive={isPositive}>
              {isPositive ? '+' : ''}{change}%
            </ChangeIndicator>
          )}
          {changeLabel && <ChangeLabel>{changeLabel}</ChangeLabel>}
        </CardFooter>
      )}
    </CardContainer>
  );
};

export default StatCard;
