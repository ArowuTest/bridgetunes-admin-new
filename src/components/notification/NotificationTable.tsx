import React from 'react';
import styled from 'styled-components';
import { Notification } from '../../types/notification.types';
import { FaRedo, FaTrash, FaEye } from 'react-icons/fa';

interface NotificationTableProps {
  notifications: Notification[];
  onResend: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (notification: Notification) => void;
}

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
`;

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f8f9fa;
  }
  
  tr:hover {
    background-color: rgba(255, 209, 0, 0.05);
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e9ecef;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #212529;
`;

const NotificationType = styled.span<{ type: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => 
    props.type === 'info' ? '#cfe2ff' : 
    props.type === 'success' ? '#d1e7dd' : 
    props.type === 'warning' ? '#fff3cd' : 
    '#f8d7da'};
  color: ${props => 
    props.type === 'info' ? '#084298' : 
    props.type === 'success' ? '#0f5132' : 
    props.type === 'warning' ? '#856404' : 
    '#721c24'};
`;

const NotificationStatus = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => 
    props.status === 'sent' ? '#d1e7dd' : 
    props.status === 'pending' ? '#fff3cd' : 
    '#f8d7da'};
  color: ${props => 
    props.status === 'sent' ? '#0f5132' : 
    props.status === 'pending' ? '#856404' : 
    '#721c24'};
`;

const NotificationChannel = styled.span<{ channel: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => 
    props.channel === 'email' ? '#e2e3e5' : 
    props.channel === 'sms' ? '#d1e7dd' : 
    '#cfe2ff'};
  color: ${props => 
    props.channel === 'email' ? '#41464b' : 
    props.channel === 'sms' ? '#0f5132' : 
    '#084298'};
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  background-color: transparent;
  color: #6c757d;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
    color: #212529;
  }
  
  &:focus {
    outline: none;
  }
`;

const ActionButtonDanger = styled(ActionButton)`
  &:hover {
    background-color: #f8d7da;
    color: #dc3545;
  }
`;

const ActionButtonPrimary = styled(ActionButton)`
  &:hover {
    background-color: rgba(255, 209, 0, 0.1);
    color: #FFD100;
  }
`;

const ActionButtonInfo = styled(ActionButton)`
  &:hover {
    background-color: #cfe2ff;
    color: #0d6efd;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TruncatedText = styled.div`
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NotificationTable: React.FC<NotificationTableProps> = ({ 
  notifications, 
  onResend, 
  onDelete, 
  onView 
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Title</TableHeader>
            <TableHeader>Recipient</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Channel</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Created At</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {notifications.map(notification => (
            <TableRow key={notification.id}>
              <TableCell>
                <TruncatedText>{notification.title}</TruncatedText>
              </TableCell>
              <TableCell>{notification.recipient}</TableCell>
              <TableCell>
                <NotificationType type={notification.type}>{notification.type}</NotificationType>
              </TableCell>
              <TableCell>
                <NotificationChannel channel={notification.channel}>{notification.channel}</NotificationChannel>
              </TableCell>
              <TableCell>
                <NotificationStatus status={notification.status}>{notification.status}</NotificationStatus>
              </TableCell>
              <TableCell>{new Date(notification.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <ActionsContainer>
                  <ActionButtonInfo onClick={() => onView(notification)} title="View Notification">
                    <FaEye />
                  </ActionButtonInfo>
                  {notification.status !== 'sent' && (
                    <ActionButtonPrimary onClick={() => onResend(notification.id)} title="Resend Notification">
                      <FaRedo />
                    </ActionButtonPrimary>
                  )}
                  <ActionButtonDanger onClick={() => onDelete(notification.id)} title="Delete Notification">
                    <FaTrash />
                  </ActionButtonDanger>
                </ActionsContainer>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NotificationTable;
