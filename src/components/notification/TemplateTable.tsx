import React from 'react';
import styled from 'styled-components';
import { FaEnvelope, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Button from '../Button';

interface Template {
  id: string;
  name: string;
  type: string;
  subject?: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateTableProps {
  templates: Template[];
}

const TableContainer = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.gray200};
  }
  
  th {
    font-weight: 600;
    color: ${props => props.theme.colors.gray700};
    background-color: ${props => props.theme.colors.gray50};
  }
  
  tr:hover td {
    background-color: ${props => props.theme.colors.gray50};
  }
`;

const TypeBadge = styled.span<{ type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch (props.type.toLowerCase()) {
      case 'sms':
        return `
          background-color: ${props.theme.colors.primary}15;
          color: ${props.theme.colors.primary};
        `;
      case 'email':
        return `
          background-color: ${props.theme.colors.info}15;
          color: ${props.theme.colors.info};
        `;
      case 'push':
        return `
          background-color: ${props.theme.colors.success}15;
          color: ${props.theme.colors.success};
        `;
      default:
        return `
          background-color: ${props.theme.colors.gray}15;
          color: ${props.theme.colors.gray};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TemplateTable: React.FC<TemplateTableProps> = ({ templates }) => {
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Subject</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map(template => (
            <tr key={template.id}>
              <td>{template.name}</td>
              <td>
                <TypeBadge type={template.type}>
                  <FaEnvelope />
                  {template.type}
                </TypeBadge>
              </td>
              <td>{template.subject || '-'}</td>
              <td>{new Date(template.createdAt).toLocaleDateString()}</td>
              <td>{new Date(template.updatedAt).toLocaleDateString()}</td>
              <td>
                <ActionButtons>
                  <Button variant="icon" title="View">
                    <FaEye />
                  </Button>
                  <Button variant="icon" title="Edit">
                    <FaEdit />
                  </Button>
                  <Button variant="icon" title="Delete">
                    <FaTrash />
                  </Button>
                </ActionButtons>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default TemplateTable;
