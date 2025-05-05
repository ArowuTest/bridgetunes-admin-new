import React from 'react';
import styled from 'styled-components';

interface StatusBadgeProps {
  status: string;
  children: React.ReactNode;
}

const Badge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #fff;
  background-color: ${props => {
    switch (props.status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return '#28a745'; // Green
      case 'scheduled':
      case 'pending':
        return '#ffc107'; // Yellow
      case 'failed':
      case 'cancelled':
        return '#dc3545'; // Red
      default:
        return '#6c757d'; // Gray
    }
  }};
`;

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  return <Badge status={status}>{children}</Badge>;
};

export default StatusBadge;



