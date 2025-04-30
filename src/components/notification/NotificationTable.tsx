import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaEye, FaPaperPlane } from 'react-icons/fa';
import Button from '../Button';
import DataTable from '../DataTable';

// Styled components
const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'draft':
        return `
          background-color: ${props.theme.colors.light};
          color: ${props.theme.colors.gray};
        `;
      case 'scheduled':
        return `
          background-color: ${props.theme.colors.info + '20'};
          color: ${props.theme.colors.info};
        `;
      case 'sending':
        return `
          background-color: ${props.theme.colors.warning + '20'};
          color: ${props.theme.colors.warning};
        `;
      case 'sent':
        return `
          background-color: ${props.theme.colors.success + '20'};
          color: ${props.theme.colors.success};
        `;
      case 'failed':
        return `
          background-color: ${props.theme.colors.danger + '20'};
          color: ${props.theme.colors.danger};
        `;
      default:
        return `
          background-color: ${props.theme.colors.light};
          color: ${props.theme.colors.gray};
        `;
    }
  }}
`;

const TypeBadge = styled.span<{ type: string }>`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  
  ${props => {
    switch (props.type) {
      case 'draw_announcement':
        return `
          background-color: ${props.theme.colors.primary + '20'};
          color: ${props.theme.colors.primary};
        `;
      case 'win_notification':
        return `
          background-color: ${props.theme.colors.success + '20'};
          color: ${props.theme.colors.success};
        `;
      case 'recharge_confirmation':
        return `
          background-color: ${props.theme.colors.info + '20'};
          color: ${props.theme.colors.info};
        `;
      default:
        return `
          background-color: ${props.theme.colors.light};
          color: ${props.theme.colors.gray};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MessagePreview = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.gray};
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Updated Notification interface to match the mock data structure
export interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  status: string;
  segment: string[];
  sentCount: number;
  deliveredCount: number;
  createdAt: string;
  sentAt: string | null;
}

interface NotificationTableProps {
  notifications: Notification[];
  onEdit: (notification: Notification) => void;
  formatDate: (date: string | null) => string;
}

const NotificationTable: React.FC<NotificationTableProps> = ({ 
  notifications,
  onEdit,
  formatDate
}) => {
  // Handle view notification
  const handleViewNotification = (notification: Notification) => {
    console.log(`View notification ${notification.id}`);
    // In a real implementation, this would open a modal or navigate to a detail page
  };
  
  // Handle delete notification
  const handleDeleteNotification = (notification: Notification) => {
    console.log(`Delete notification ${notification.id}`);
    // In a real implementation, this would show a confirmation dialog
  };
  
  // Handle send notification
  const handleSendNotification = (notification: Notification) => {
    console.log(`Send notification ${notification.id}`);
    // In a real implementation, this would show a confirmation dialog
  };
  
  // Table columns
  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (notification: Notification) => (
        <div>
          <div>{notification.title}</div>
          <MessagePreview>{notification.content}</MessagePreview>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (notification: Notification) => (
        <TypeBadge type={notification.type}>
          {notification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </TypeBadge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (notification: Notification) => (
        <StatusBadge status={notification.status}>
          {notification.status}
        </StatusBadge>
      )
    },
    {
      key: 'sentCount',
      header: 'Recipients',
      render: (notification: Notification) => (
        <div>{notification.sentCount.toLocaleString()}</div>
      )
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (notification: Notification) => (
        <div>{formatDate(notification.createdAt)}</div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (notification: Notification) => (
        <ActionButtons>
          <Button 
            variant="info" 
            size="small" 
            outlined
            icon={<FaEye />}
            onClick={() => handleViewNotification(notification)}
          />
          <Button 
            variant="primary" 
            size="small" 
            outlined
            icon={<FaEdit />}
            onClick={() => onEdit(notification)}
          />
          {notification.status === 'draft' && (
            <Button 
              variant="success" 
              size="small" 
              outlined
              icon={<FaPaperPlane />}
              onClick={() => handleSendNotification(notification)}
            />
          )}
          <Button 
            variant="danger" 
            size="small" 
            outlined
            icon={<FaTrash />}
            onClick={() => handleDeleteNotification(notification)}
          />
        </ActionButtons>
      )
    }
  ];
  
  return (
    <DataTable
      columns={columns}
      data={notifications}
      keyExtractor={(item) => item.id}
      emptyMessage="No notifications found. Create a new notification to get started."
      pagination={{
        currentPage: 1,
        totalPages: 1,
        totalItems: notifications.length,
        itemsPerPage: 10,
        onPageChange: (page) => console.log(`Go to page ${page}`)
      }}
    />
  );
};

// Add named export alongside default export
export { NotificationTable };
export default NotificationTable;
