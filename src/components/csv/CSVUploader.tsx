import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUpload, FaFileAlt, FaCheck, FaTimes, FaDownload } from 'react-icons/fa';
import { CSVUploadSummary } from '../../types/csv.types';

interface CSVUploaderProps {
  onUpload: (file: File) => Promise<void>;
  onValidate: (file: File) => Promise<CSVUploadSummary>;
  onDownloadTemplate: () => void;
  isUploading: boolean;
  isValidating: boolean;
}

const UploaderContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const UploadArea = styled.div<{ isDragActive: boolean }>`
  border: 2px dashed ${props => props.isDragActive ? '#FFD100' : '#dee2e6'};
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  background-color: ${props => props.isDragActive ? 'rgba(255, 209, 0, 0.05)' : '#f8f9fa'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #FFD100;
    background-color: rgba(255, 209, 0, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: #6c757d;
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  font-size: 1.25rem;
  color: #495057;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
`;

const FileInput = styled.input`
  display: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ variant?: string }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => 
    props.variant === 'primary' ? '#FFD100' : 
    props.variant === 'secondary' ? '#f8f9fa' : 
    props.variant === 'success' ? '#28a745' : 
    '#f8f9fa'};
  color: ${props => 
    props.variant === 'primary' ? '#000' : 
    props.variant === 'secondary' ? '#212529' : 
    props.variant === 'success' ? '#fff' : 
    '#212529'};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => 
      props.variant === 'primary' ? '#E6BC00' : 
      props.variant === 'secondary' ? '#e2e6ea' : 
      props.variant === 'success' ? '#218838' : 
      '#e2e6ea'};
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SelectedFileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-top: 1.5rem;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FileIcon = styled.div`
  font-size: 1.5rem;
  color: #6c757d;
`;

const FileName = styled.div`
  font-weight: 500;
  color: #212529;
`;

const FileSize = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
`;

const FileActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
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

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #FFD100;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const ValidationSummary = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const SummaryTitle = styled.h3`
  font-size: 1.25rem;
  color: #212529;
  margin: 0 0 1rem 0;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const SummaryItem = styled.div`
  padding: 1rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
`;

const SummaryValue = styled.div<{ isNegative?: boolean }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.isNegative ? '#dc3545' : '#212529'};
`;

const DistributionContainer = styled.div`
  margin-top: 1.5rem;
`;

const DistributionTitle = styled.h4`
  font-size: 1rem;
  color: #212529;
  margin: 0 0 0.75rem 0;
`;

const DistributionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
`;

const DistributionItem = styled.div`
  padding: 0.75rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
`;

const DistributionLabel = styled.div`
  font-size: 0.875rem;
  color: #212529;
`;

const DistributionValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #212529;
`;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const CSVUploader: React.FC<CSVUploaderProps> = ({ 
  onUpload, 
  onValidate, 
  onDownloadTemplate, 
  isUploading, 
  isValidating 
}) => {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationSummary, setValidationSummary] = useState<CSVUploadSummary | null>(null);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setValidationSummary(null);
      } else {
        alert('Please upload a CSV file');
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setValidationSummary(null);
      } else {
        alert('Please upload a CSV file');
      }
    }
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationSummary(null);
  };
  
  const handleValidateFile = async () => {
    if (!selectedFile) return;
    
    try {
      const summary = await onValidate(selectedFile);
      setValidationSummary(summary);
    } catch (error) {
      console.error('Validation error:', error);
      alert('Failed to validate file');
    }
  };
  
  const handleUploadFile = async () => {
    if (!selectedFile) return;
    
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      setValidationSummary(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  };
  
  return (
    <UploaderContainer>
      <UploadArea
        isDragActive={isDragActive}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <UploadIcon>
          <FaUpload />
        </UploadIcon>
        <UploadText>
          {isDragActive ? 'Drop your CSV file here' : 'Drag & Drop your CSV file here'}
        </UploadText>
        <UploadSubtext>
          or click to browse files
        </UploadSubtext>
        <FileInput
          id="file-input"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </UploadArea>
      
      {selectedFile && (
        <SelectedFileContainer>
          <FileInfo>
            <FileIcon>
              <FaFileAlt />
            </FileIcon>
            <div>
              <FileName>{selectedFile.name}</FileName>
              <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
            </div>
          </FileInfo>
          <FileActions>
            <ActionButton onClick={handleRemoveFile} title="Remove file">
              <FaTimes />
            </ActionButton>
          </FileActions>
        </SelectedFileContainer>
      )}
      
      <ButtonGroup>
        <Button
          variant="secondary"
          onClick={onDownloadTemplate}
        >
          <FaDownload /> Download Template
        </Button>
        
        {selectedFile && (
          <>
            <div>
              <Button
                variant="secondary"
                onClick={handleValidateFile}
                disabled={isValidating || !selectedFile}
                style={{ marginRight: '0.75rem' }}
              >
                {isValidating ? <LoadingSpinner /> : <FaCheck />} Validate
              </Button>
              <Button
                variant="primary"
                onClick={handleUploadFile}
                disabled={isUploading || !selectedFile}
              >
                {isUploading ? <LoadingSpinner /> : <FaUpload />} Upload
              </Button>
            </div>
          </>
        )}
      </ButtonGroup>
      
      {validationSummary && (
        <ValidationSummary>
          <SummaryTitle>Validation Summary</SummaryTitle>
          <SummaryGrid>
            <SummaryItem>
              <SummaryLabel>Total Records</SummaryLabel>
              <SummaryValue>{validationSummary.totalRecords}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Valid Records</SummaryLabel>
              <SummaryValue>{validationSummary.validRecords}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Invalid Records</SummaryLabel>
              <SummaryValue isNegative={validationSummary.invalidRecords > 0}>
                {validationSummary.invalidRecords}
              </SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Duplicate Records</SummaryLabel>
              <SummaryValue isNegative={validationSummary.duplicateRecords > 0}>
                {validationSummary.duplicateRecords}
              </SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Opt-In Records</SummaryLabel>
              <SummaryValue>{validationSummary.optInRecords}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Opt-Out Records</SummaryLabel>
              <SummaryValue>{validationSummary.optOutRecords}</SummaryValue>
            </SummaryItem>
          </SummaryGrid>
          
          <DistributionContainer>
            <DistributionTitle>Recharge Amount Distribution</DistributionTitle>
            <DistributionGrid>
              {Object.entries(validationSummary.rechargeAmountDistribution).map(([amount, count]) => (
                <DistributionItem key={amount}>
                  <DistributionLabel>₦{amount}</DistributionLabel>
                  <DistributionValue>{count}</DistributionValue>
                </DistributionItem>
              ))}
            </DistributionGrid>
          </DistributionContainer>
          
          <DistributionContainer>
            <DistributionTitle>Date Distribution</DistributionTitle>
            <DistributionGrid>
              {Object.entries(validationSummary.dateDistribution).map(([date, count]) => (
                <DistributionItem key={date}>
                  <DistributionLabel>{date}</DistributionLabel>
                  <DistributionValue>{count}</DistributionValue>
                </DistributionItem>
              ))}
            </DistributionGrid>
          </DistributionContainer>
        </ValidationSummary>
      )}
    </UploaderContainer>
  );
};

export default CSVUploader;
