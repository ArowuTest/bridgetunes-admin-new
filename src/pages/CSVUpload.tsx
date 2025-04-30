import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaUpload, FaFileAlt, FaCheck, FaTimes, FaDownload, FaTable } from 'react-icons/fa';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import DataTable from '../components/DataTable';
import { useDemoMode } from '../context/DemoModeContext';
import CSVUploader from '../components/csv/CSVUploader';
import CSVUploaderForDemo from '../components/csv/CSVUploaderForDemo';

// Styled components
const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TemplateSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.light};
`;

const TemplateTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.dark};
`;

const TemplateDescription = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.gray};
  margin-bottom: 1.5rem;
`;

interface CSVRecord {
  msisdn: string;
  rechargeAmount: string;
  optInStatus: string;
  rechargeDate: string;
  [key: string]: string;
}

const CSVUploadPage: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const [uploadedData, setUploadedData] = useState<CSVRecord[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  
  // Handle successful upload
  const handleUploadSuccess = (data: any[]) => {
    setUploadedData(data);
    setUploadSuccess(true);
    setUploadMessage(`Successfully uploaded ${data.length} records.`);
    setIsUploading(false);
  };
  
  // Handle upload error
  const handleUploadError = (error: string) => {
    setUploadSuccess(false);
    setUploadMessage(error);
    setIsUploading(false);
  };
  
  // Handle upload start
  const handleUploadStart = () => {
    setIsUploading(true);
    setUploadSuccess(null);
    setUploadMessage('');
  };
  
  // Download CSV template
  const handleDownloadTemplate = () => {
    const templateContent = 'MSISDN,Recharge Amount (Naira),Opt-In Status,Recharge Date\n08036785165,200,Yes,11/04/2025\n08033724661,100,Yes,11/04/2025\n08037954885,100,Yes,12/04/2025';
    
    const blob = new Blob([templateContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bridgetunes_csv_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <PageLayout 
      title="CSV Upload" 
      description="Upload CSV files with user data for the MyNumba Don Win promotion."
    >
      <UploadContainer>
        <Card 
          title="Upload User Data" 
          icon={<FaUpload />}
        >
          {isDemoMode ? (
            <CSVUploaderForDemo 
              onUploadStart={handleUploadStart}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          ) : (
            <CSVUploader 
              onUploadStart={handleUploadStart}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          )}
          
          {uploadSuccess !== null && (
            <div style={{ marginTop: '1rem' }}>
              {uploadSuccess ? (
                <div style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                  <FaCheck style={{ marginRight: '0.5rem' }} />
                  {uploadMessage}
                </div>
              ) : (
                <div style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                  <FaTimes style={{ marginRight: '0.5rem' }} />
                  {uploadMessage}
                </div>
              )}
            </div>
          )}
          
          <TemplateSection>
            <TemplateTitle>CSV Template</TemplateTitle>
            <TemplateDescription>
              Download the CSV template to ensure your data is formatted correctly. The template includes the required columns: MSISDN, Recharge Amount, Opt-In Status, and Recharge Date.
            </TemplateDescription>
            <Button 
              variant="secondary" 
              outlined 
              icon={<FaDownload />}
              onClick={handleDownloadTemplate}
            >
              Download Template
            </Button>
          </TemplateSection>
        </Card>
        
        {uploadedData.length > 0 && (
          <Card 
            title="Uploaded Data Preview" 
            icon={<FaTable />}
          >
            <DataTable
              columns={[
                {
                  key: 'msisdn',
                  header: 'MSISDN',
                  render: (item: CSVRecord) => <div>{item.msisdn}</div>
                },
                {
                  key: 'rechargeAmount',
                  header: 'Recharge Amount',
                  render: (item: CSVRecord) => <div>₦{item.rechargeAmount}</div>
                },
                {
                  key: 'optInStatus',
                  header: 'Opt-In Status',
                  render: (item: CSVRecord) => (
                    <div style={{ 
                      color: item.optInStatus === 'Yes' ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {item.optInStatus}
                    </div>
                  )
                },
                {
                  key: 'rechargeDate',
                  header: 'Recharge Date',
                  render: (item: CSVRecord) => <div>{item.rechargeDate}</div>
                }
              ]}
              data={uploadedData.slice(0, 10)} // Show only first 10 rows as preview
              keyExtractor={(item: CSVRecord) => `${item.msisdn}-${item.rechargeDate}`}
              emptyMessage="No data to display."
              pagination={{
                currentPage: 1,
                totalPages: 1,
                totalItems: uploadedData.length,
                itemsPerPage: 10,
                onPageChange: () => {}
              }}
            />
            
            {uploadedData.length > 10 && (
              <div style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
                Showing 10 of {uploadedData.length} records.
              </div>
            )}
          </Card>
        )}
      </UploadContainer>
    </PageLayout>
  );
};

export default CSVUploadPage;
