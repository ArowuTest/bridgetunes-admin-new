import React from 'react';
import styled from 'styled-components';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DrawStats } from '../../types/dashboard.types';

interface DataTableProps {
  data: DrawStats[];
  title: string;
}

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const TableTitle = styled.h3`
  font-size: 1.25rem;
  color: #212529;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const StyledDataGrid = styled(DataGrid)`
  border: none;
  
  .MuiDataGrid-columnHeaders {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }
  
  .MuiDataGrid-cell {
    border-bottom: 1px solid #e9ecef;
  }
  
  .MuiDataGrid-row:hover {
    background-color: rgba(255, 209, 0, 0.05);
  }
`;

const RecentDrawsTable: React.FC<DataTableProps> = ({ data, title }) => {
  const columns: GridColDef[] = [
    { 
      field: 'drawId', 
      headerName: 'Draw ID', 
      flex: 1,
      minWidth: 120 
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      flex: 1,
      minWidth: 150 
    },
    { 
      field: 'participants', 
      headerName: 'Participants', 
      flex: 1,
      minWidth: 120,
      type: 'number',
      valueFormatter: (params) => params.value.toLocaleString()
    },
    { 
      field: 'winners', 
      headerName: 'Winners', 
      flex: 1,
      minWidth: 100,
      type: 'number',
      valueFormatter: (params) => params.value.toLocaleString()
    },
    { 
      field: 'totalPrize', 
      headerName: 'Total Prize', 
      flex: 1,
      minWidth: 150,
      type: 'number',
      valueFormatter: (params) => `₦${params.value.toLocaleString()}`
    }
  ];

  // Add id field for DataGrid if not present
  const rowsWithId = data.map((row, index) => ({
    ...row,
    id: row.drawId || index.toString()
  }));

  return (
    <TableContainer>
      <TableTitle>{title}</TableTitle>
      <div style={{ height: 400, width: '100%' }}>
        <StyledDataGrid
          rows={rowsWithId}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          density="standard"
        />
      </div>
    </TableContainer>
  );
};

export default RecentDrawsTable;
