import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaUpload, FaFileAlt, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import Button from '../Button';

// Styled components
const UploaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DropZone = styled.div<{ isDragActive: boolean; isError: boolean }>`
  border: 2px dashed ${props => {
    if (props.isError) return props.theme.colors.danger;
    return props.isDragActive ? props.theme.colors.primary : props.theme.colors.light;
  }};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.isDragActive ? props.theme.colors.primary + '10' : 'transparent'};
  
  &:hover {
    border-color: ${props => props.isError ? props.theme.colors.danger : props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary + '05'};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const UploadText = styled.div`
  font-size: 1.1rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.dark};
`;

const UploadSubtext = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray};
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.light};
  margin-top: 1rem;
`;

const FileIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.primary};
  margin-right: 1rem;
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: ${props => props.theme.fontWeights.medium};
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.dark};
`;

const FileSize = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.gray};
`;

const ValidationResults = styled.div`
  margin-top: 1rem;
`;

const ValidationTitle = styled.div`
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.dark};
`;

const ValidationItem = styled.div<{ isValid: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: ${props => props.isValid ? props.theme.colors.success : props.theme.colors.danger};
  
  svg {
    margin-right: 0.5rem;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

interface CSVUploaderProps {
  onUploadStart: () => void;
  onUploadSuccess: (data: any[]) => void;
  onUploadError: (error: string) => void;
}

interface CSVRecord {
  msisdn: string;
  rechargeAmount: string;
  optInStatus: string;
  rechargeDate: string;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({
  onUploadStart,
  onUploadSuccess,
  onUploadError
}) => {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResults, setValidationResults] = useState<{ field: string; isValid: boolean; message: string }[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (!file) return;
    
    // Check file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      onUploadError('Please upload a CSV file.');
      setIsError(true);
      return;
    }
    
    setSelectedFile(file);
    setIsError(false);
    validateFile(file);
  };
  
  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  // Handle drag events
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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  // Open file dialog
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Validate CSV file
  const validateFile = (file: File) => {
    setIsValidating(true);
    onUploadStart();
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        
        // Check if file has content
        if (lines.length < 2) {
          onUploadError('The CSV file is empty or has no data rows.');
          setIsValidating(false);
          return;
        }
        
        // Check header row
        const header = lines[0].split(',');
        const expectedHeaders = ['MSISDN', 'Recharge Amount (Naira)', 'Opt-In Status', 'Recharge Date'];
        const headerValidation = expectedHeaders.every(expectedHeader => 
          header.some(h => h.trim() === expectedHeader)
        );
        
        if (!headerValidation) {
          onUploadError('CSV header does not match the expected format. Please use the template provided.');
          setIsValidating(false);
          return;
        }
        
        // Validate data rows
        const validationResults = [
          { field: 'Header format', isValid: headerValidation, message: 'CSV headers match expected format' },
          { field: 'Data rows', isValid: lines.length > 1, message: `Found ${lines.length - 1} data rows` }
        ];
        
        // Parse and validate each row
        const data: CSVRecord[] = [];
        let hasErrors = false;
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue; // Skip empty lines
          
          const values = line.split(',');
          
          if (values.length !== 4) {
            validationResults.push({
              field: `Row ${i}`,
              isValid: false,
              message: `Row ${i} does not have the expected number of columns`
            });
            hasErrors = true;
            continue;
          }
          
          const [msisdn, rechargeAmount, optInStatus, rechargeDate] = values;
          
          // Validate MSISDN (phone number)
          const isValidMSISDN = /^0[0-9]{10}$/.test(msisdn.trim());
          if (!isValidMSISDN) {
            validationResults.push({
              field: `MSISDN in row ${i}`,
              isValid: false,
              message: `Invalid phone number format in row ${i}`
            });
            hasErrors = true;
          }
          
          // Validate Recharge Amount
          const isValidAmount = !isNaN(Number(rechargeAmount.trim()));
          if (!isValidAmount) {
            validationResults.push({
              field: `Recharge Amount in row ${i}`,
              isValid: false,
              message: `Invalid recharge amount in row ${i}`
            });
            hasErrors = true;
          }
          
          // Validate Opt-In Status
          const isValidOptIn = ['Yes', 'No'].includes(optInStatus.trim());
          if (!isValidOptIn) {
            validationResults.push({
              field: `Opt-In Status in row ${i}`,
              isValid: false,
              message: `Invalid opt-in status in row ${i} (should be 'Yes' or 'No')`
            });
            hasErrors = true;
          }
          
          // Validate Recharge Date
          const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
          const isValidDate = dateRegex.test(rechargeDate.trim());
          if (!isValidDate) {
            validationResults.push({
              field: `Recharge Date in row ${i}`,
              isValid: false,
              message: `Invalid date format in row ${i} (should be DD/MM/YYYY)`
            });
            hasErrors = true;
          }
          
          // Add valid row to data
          if (isValidMSISDN && isValidAmount && isValidOptIn && isValidDate) {
            data.push({
              msisdn: msisdn.trim(),
              rechargeAmount: rechargeAmount.trim(),
              optInStatus: optInStatus.trim(),
              rechargeDate: rechargeDate.trim()
            });
          }
        }
        
        setValidationResults(validationResults);
        
        if (hasErrors) {
          onUploadError('CSV file contains validation errors. Please fix them and try again.');
        } else {
          // In production mode, this would call an API to upload the data
          // For now, we'll simulate an API call with a timeout
          setTimeout(() => {
            onUploadSuccess(data);
            setIsValidating(false);
          }, 1500);
        }
      } catch (error) {
        onUploadError('Error parsing CSV file. Please check the file format.');
        setIsValidating(false);
      }
    };
    
    reader.onerror = () => {
      onUploadError('Error reading the file. Please try again.');
      setIsValidating(false);
    };
    
    reader.readAsText(file);
  };
  
  // Handle upload button click
  const handleUpload = () => {
    if (!selectedFile) {
      onUploadError('Please select a file to upload.');
      return;
    }
    
    // In a real implementation, this would call an API to upload the file
    // For now, we'll just validate the file again
    validateFile(selectedFile);
  };
  
  return (
    <UploaderContainer>
      <DropZone
        isDragActive={isDragActive}
        isError={isError}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <FileInput
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={handleFileInputChange}
        />
        
        <UploadIcon>
          <FaUpload />
        </UploadIcon>
        
        <UploadText>
          {isDragActive ? 'Drop your CSV file here' : 'Drag & Drop your CSV file here'}
        </UploadText>
        
        <UploadSubtext>
          or click to browse files
        </UploadSubtext>
      </DropZone>
      
      {selectedFile && (
        <FilePreview>
          <FileIcon>
            <FaFileAlt />
          </FileIcon>
          
          <FileDetails>
            <FileName>{selectedFile.name}</FileName>
            <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
          </FileDetails>
          
          <Button
            variant="primary"
            size="small"
            onClick={handleUpload}
            disabled={isValidating}
          >
            {isValidating ? 'Validating...' : 'Upload'}
          </Button>
        </FilePreview>
      )}
      
      {isValidating && (
        <LoadingSpinner>
          <FaSpinner size={24} />
          <span style={{ marginLeft: '0.5rem' }}>Validating and processing file...</span>
        </LoadingSpinner>
      )}
      
      {validationResults.length > 0 && (
        <ValidationResults>
          <ValidationTitle>Validation Results:</ValidationTitle>
          
          {validationResults.map((result, index) => (
            <ValidationItem key={index} isValid={result.isValid}>
              {result.isValid ? <FaCheck /> : <FaTimes />}
              {result.message}
            </ValidationItem>
          ))}
        </ValidationResults>
      )}
    </UploaderContainer>
  );
};

export default CSVUploader;
