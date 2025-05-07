import React, { useState } from 'react';
import styled from 'styled-components';
import { DataGrid, GridColDef } from '@material-ui/data-grid'; // Removed GridPageChangeParams, GridPageSizeChangeParams

// Define the structure of the 'draws' prop passed from Dashboard
interface Draw {
  id: number | string;
  date: string;
  time: string;
  type: string;
  winners: number;
  prize: string;
  status: string;
}

// Update the props interface to include 'title' and use 'draws'
interface DataTableProps {
  title: string;
  draws: Draw[];
}

const TableWrapper = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TableTitle = styled.h3`
  font-size: 1.25rem;
  color: #212529;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const TableContainer = styled.div`
  height: 400px;
  width: 100%;
`;

const RecentDrawsTable: React.FC<DataTableProps> = ({ title, draws }) => {
  const [page, setPage] = useState(0); // MUI DataGrid page is 0-indexed
  const [pageSize, setPageSize] = useState(5);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 120
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 100
    },
    {
      field: 'type',
      headerName: 'Draw Type',
      flex: 1,
      minWidth: 150
    },
    {
      field: 'winners',
      headerName: 'Winners',
      width: 100,
      type: 'number',
      valueFormatter: (params) => params.value?.toLocaleString() ?? ''
    },
    {
      field: 'prize',
      headerName: 'Prize',
      width: 150,
      valueFormatter: (params) => params.value // Prize is already formatted string
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <div style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          backgroundColor: (() => {
            if (typeof params.value === 'string') {
              const statusValue = params.value.toLowerCase();
              if (statusValue === 'scheduled') return '#e9ecef';
              if (statusValue === 'in-progress') return '#fff3cd';
              if (statusValue === 'completed') return '#d1e7dd';
            }
            return '#f8d7da'; // Default for 'cancelled', non-string values, or other statuses
          })(),
          color: (() => {
            if (typeof params.value === 'string') {
              const statusValue = params.value.toLowerCase();
              if (statusValue === 'scheduled') return '#495057';
              if (statusValue === 'in-progress') return '#856404';
              if (statusValue === 'completed') return '#0f5132';
            }
            return '#721c24'; // Default for 'cancelled', non-string values, or other statuses
          })()
        }}>
          {params.value}
        </div>
      )
    },
  ];

  return (
    <TableWrapper>
      <TableTitle>{title}</TableTitle> {/* Display the title */}
      <TableContainer>
        <DataGrid
          rows={draws} // Use the 'draws' prop
          columns={columns}
          page={page}
          onPageChange={(params) => setPage(params.page)} // params is an object { page: number, pageSize: number, rowCount: number }
          pageSize={pageSize}
          onPageSizeChange={(params) => setPageSize(params.pageSize)} // params is an object { pageSize: number, page: number }
          rowsPerPageOptions={[5]} // This is the v4 equivalent of pageSizeOptions
          pagination // Explicitly add pagination prop as per v4 docs examples
          disableRowSelectionOnClick
          autoHeight
        />
      </TableContainer>
    </TableWrapper>
  );
};

// Add named export alongside default export
export { RecentDrawsTable };
export default RecentDrawsTable;

