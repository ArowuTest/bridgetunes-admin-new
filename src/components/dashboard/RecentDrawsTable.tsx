import React, { useState } from 'react';
import styled from 'styled-components';
import { DataGrid, GridColDef } from '@material-ui/data-grid'; // Changed from @mui/x-data-grid

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
  // Use state for pagination instead of the deprecated pageSize prop
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

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
          backgroundColor:
            params.value?.toLowerCase() === 'scheduled'
              ? '#e9ecef'
              : params.value?.toLowerCase() === 'in-progress'
              ? '#fff3cd'
              : params.value?.toLowerCase() === 'completed'
              ? '#d1e7dd'
              : '#f8d7da',
          color:
            params.value?.toLowerCase() === 'scheduled'
              ? '#495057'
              : params.value?.toLowerCase() === 'in-progress'
              ? '#856404'
              : params.value?.toLowerCase() === 'completed'
              ? '#0f5132'
              : '#721c24'
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
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5]}
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


