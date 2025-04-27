import React from 'react';
import styled from 'styled-components';
import { NotificationTemplate } from '../../types/notification.types';
import { FaEdit, FaTrash, FaClone } from 'react-icons/fa';

interface TemplateTableProps {
  templates: NotificationTemplate[];
  onEdit: (template: NotificationTemplate) => void;
  onDelete: (id: string) => void;
  onClone: (template: NotificationTemplate) => void;
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

const TemplateTable: React.FC<TemplateTableProps> = ({ 
  templates, 
  onEdit, 
  onDelete, 
  onClone 
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Title</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Channel</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {templates.map(template => (
            <TableRow key={template.id}>
              <TableCell>{template.name}</TableCell>
              <TableCell>
                <TruncatedText>{template.title}</TruncatedText>
              </TableCell>
              <TableCell>
                <NotificationType type={template.type}>{template.type}</NotificationType>
              </TableCell>
              <TableCell>
                <NotificationChannel channel={template.channel}>{template.channel}</NotificationChannel>
              </TableCell>
              <TableCell>
                <ActionsContainer>
                  <ActionButtonPrimary onClick={() => onEdit(template)} title="Edit Template">
                    <FaEdit />
                  </ActionButtonPrimary>
                  <ActionButtonInfo onClick={() => onClone(template)} title="Clone Template">
                    <FaClone />
                  </ActionButtonInfo>
                  <ActionButtonDanger onClick={() => onDelete(template.id)} title="Delete Template">
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

export default TemplateTable;
