import React from 'react';
import styled from 'styled-components';
import { User } from '../../types/user.types';
import { FaEdit, FaTrash, FaKey, FaHistory } from 'react-icons/fa';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onResetPassword: (id: string) => void;
  onViewActivity: (id: string) => void;
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

const UserStatus = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => 
    props.status === 'active' ? '#d1e7dd' : 
    props.status === 'inactive' ? '#f8d7da' : 
    '#fff3cd'};
  color: ${props => 
    props.status === 'active' ? '#0f5132' : 
    props.status === 'inactive' ? '#721c24' : 
    '#856404'};
`;

const UserRole = styled.span<{ role: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => 
    props.role === 'admin' ? '#cfe2ff' : 
    props.role === 'manager' ? '#d1e7dd' : 
    '#e2e3e5'};
  color: ${props => 
    props.role === 'admin' ? '#084298' : 
    props.role === 'manager' ? '#0f5132' : 
    '#41464b'};
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

const UserTable: React.FC<UserTableProps> = ({ 
  users, 
  onEdit, 
  onDelete, 
  onResetPassword,
  onViewActivity 
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Username</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Last Login</TableHeader>
            <TableHeader>Created At</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <UserRole role={user.role}>{user.role}</UserRole>
              </TableCell>
              <TableCell>
                <UserStatus status={user.status}>{user.status}</UserStatus>
              </TableCell>
              <TableCell>{user.lastLogin || 'Never'}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <ActionsContainer>
                  <ActionButtonPrimary onClick={() => onEdit(user)} title="Edit User">
                    <FaEdit />
                  </ActionButtonPrimary>
                  <ActionButtonDanger onClick={() => onDelete(user.id)} title="Delete User">
                    <FaTrash />
                  </ActionButtonDanger>
                  <ActionButton onClick={() => onResetPassword(user.id)} title="Reset Password">
                    <FaKey />
                  </ActionButton>
                  <ActionButtonInfo onClick={() => onViewActivity(user.id)} title="View Activity">
                    <FaHistory />
                  </ActionButtonInfo>
                </ActionsContainer>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
