import React from 'react';
import styled from 'styled-components';

// Styled components
const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: white;
`;

const TableHead = styled.thead`
  background-color: ${props => props.theme.colors.light};
`;

const TableHeadCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.gray};
  border-bottom: 2px solid ${props => props.theme.colors.light};
  white-space: nowrap;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.light};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.light};
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: ${props => props.theme.colors.dark};
  font-size: 0.95rem;
  vertical-align: middle;
`;

const EmptyState = styled.div`
  padding: 3rem 1rem;
  text-align: center;
  color: ${props => props.theme.colors.gray};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid ${props => props.theme.colors.light};
`;

const PageInfo = styled.div`
  color: ${props => props.theme.colors.gray};
  font-size: 0.875rem;
`;

const PageButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.light};
  background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'black' : props.theme.colors.gray};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.light};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface DataTableProps<T> {
  columns: {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
}

function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
  pagination
}: DataTableProps<T>) {
  return (
    <TableContainer>
      <StyledTable>
        <TableHead>
          <tr>
            {columns.map(column => (
              <TableHeadCell key={column.key}>
                {column.header}
              </TableHeadCell>
            ))}
          </tr>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map(item => (
              <TableRow key={keyExtractor(item)}>
                {columns.map(column => (
                  <TableCell key={`${keyExtractor(item)}-${column.key}`}>
                    {column.render 
                      ? column.render(item) 
                      : (item as any)[column.key]
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <tr>
              <TableCell colSpan={columns.length}>
                <EmptyState>{emptyMessage}</EmptyState>
              </TableCell>
            </tr>
          )}
        </TableBody>
      </StyledTable>
      
      {pagination && (
        <Pagination>
          <PageInfo>
            Showing {Math.min(pagination.currentPage * pagination.itemsPerPage - pagination.itemsPerPage + 1, pagination.totalItems)} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} entries
          </PageInfo>
          <PageButtons>
            <PageButton 
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </PageButton>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === pagination.totalPages || 
                (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
              )
              .map((page, index, array) => {
                // Add ellipsis
                if (index > 0 && page - array[index - 1] > 1) {
                  return (
                    <React.Fragment key={`ellipsis-${page}`}>
                      <PageButton disabled>...</PageButton>
                      <PageButton 
                        active={page === pagination.currentPage}
                        onClick={() => pagination.onPageChange(page)}
                      >
                        {page}
                      </PageButton>
                    </React.Fragment>
                  );
                }
                
                return (
                  <PageButton 
                    key={page}
                    active={page === pagination.currentPage}
                    onClick={() => pagination.onPageChange(page)}
                  >
                    {page}
                  </PageButton>
                );
              })}
            
            <PageButton 
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </PageButton>
          </PageButtons>
        </Pagination>
      )}
    </TableContainer>
  );
}

export default DataTable;
