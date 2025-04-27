import React from 'react';
import styled from 'styled-components';
import { useDemoMode } from '../context/DemoModeContext';
import Papa from 'papaparse';

interface CSVUploaderForDemoProps {
  onUploadComplete?: () => void;
}

const UploaderContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
`;

const Title = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #212529;
`;

const Description = styled.p`
  font-size: 0.875rem;
  margin-bottom: 1rem;
  color: #6c757d;
`;

const FileInput = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #FFD100;
  color: #000;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: #E6BC00;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div<{ isError?: boolean }>`
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: ${props => props.isError ? '#f8d7da' : '#d1e7dd'};
  color: ${props => props.isError ? '#721c24' : '#0f5132'};
  font-size: 0.875rem;
`;

const CSVUploaderForDemo: React.FC<CSVUploaderForDemoProps> = ({ onUploadComplete }) => {
  const { uploadCSVToDemoMode } = useDemoMode();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<{ message: string; isError: boolean } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setStatus(null);
      } else {
        setStatus({
          message: 'Please select a CSV file',
          isError: true
        });
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStatus(null);

    // Parse CSV file
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Check if data has required columns
          const firstRow = results.data[0] as any;
          if (!firstRow || 
              (!firstRow.MSISDN && !firstRow.msisdn) || 
              (!firstRow['Recharge Amount (Naira)'] && !firstRow.rechargeAmount)) {
            setStatus({
              message: 'CSV file must contain MSISDN and Recharge Amount columns',
              isError: true
            });
            setIsUploading(false);
            return;
          }

          // Upload data to demo mode
          uploadCSVToDemoMode(results.data);
          
          setStatus({
            message: `Successfully uploaded ${results.data.length} records to demo mode`,
            isError: false
          });
          
          setSelectedFile(null);
          if (onUploadComplete) {
            onUploadComplete();
          }
        } catch (error) {
          setStatus({
            message: `Error processing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
            isError: true
          });
        } finally {
          setIsUploading(false);
        }
      },
      error: (error) => {
        setStatus({
          message: `Error parsing CSV: ${error.message}`,
          isError: true
        });
        setIsUploading(false);
      }
    });
  };

  return (
    <UploaderContainer>
      <Title>Upload CSV Data to Demo Mode</Title>
      <Description>
        Upload your CSV file to add data directly to the demo mode. The file should contain MSISDN and Recharge Amount columns.
        This data will be stored locally in your browser and will not be sent to any server.
      </Description>
      
      <FileInput 
        type="file" 
        accept=".csv" 
        onChange={handleFileChange}
        disabled={isUploading}
      />
      
      <Button 
        onClick={handleUpload} 
        disabled={!selectedFile || isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload to Demo Mode'}
      </Button>
      
      {status && (
        <StatusMessage isError={status.isError}>
          {status.message}
        </StatusMessage>
      )}
    </UploaderContainer>
  );
};

export default CSVUploaderForDemo;
