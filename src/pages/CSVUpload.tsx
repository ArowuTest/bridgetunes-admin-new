import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUpload, FaHistory, FaDownload, FaChartBar, FaDatabase } from 'react-icons/fa';
import CSVUploader from '../components/csv/CSVUploader';
import CSVUploaderForDemo from '../components/csv/CSVUploaderForDemo';
import { csvService } from '../services/csv.service';
import { CSVUploadHistory, CSVUploadStats, CSVUploadSummary } from '../types/csv.types';
import { useDemoMode } from '../context/DemoModeContext';

const CSVUploadContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  color: #212529;
  margin: 0;
`;

const DemoModeIndicator = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #FFD100;
  color: black;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  text-transform: uppercase;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#212529' : '#6c757d'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#FFD100' : 'transparent'};
  font-size: 1rem;
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${props => props.active ? '#212529' : '#495057'};
    border-bottom-color: ${props => props.active ? '#FFD100' : '#dee2e6'};
  }
  
  &:focus {
    outline: none;
  }
`;

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

const UploadStatus = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => 
    props.status === 'completed' ? '#d1e7dd' : 
    props.status === 'processing' ? '#fff3cd' : 
    '#f8d7da'};
  color: ${props => 
    props.status === 'completed' ? '#0f5132' : 
    props.status === 'processing' ? '#856404' : 
    '#721c24'};
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background-color: transparent;
  color: #6c757d;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #f8f9fa;
    color: #212529;
  }
  
  &:focus {
    outline: none;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #212529;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #212529;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SummaryItem = styled.div`
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
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

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.div`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const EmptyStateSubtext = styled.div`
  font-size: 0.875rem;
`;

const CSVUploadPage: React.FC = () => {
  const { isDemoMode, demoData, updateDemoData } = useDemoMode();
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [uploadHistory, setUploadHistory] = useState<CSVUploadHistory[]>([]);
  const [uploadStats, setUploadStats] = useState<CSVUploadStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [currentUploadSummary, setCurrentUploadSummary] = useState<CSVUploadSummary | null>(null);
  const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);
  
  // Fetch upload history and stats on component mount or when demo mode changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (isDemoMode) {
          // Use demo data
          setUploadHistory(demoData.csvUploads);
          setUploadStats({
            totalUploads: demoData.csvUploads.length,
            totalRecordsProcessed: demoData.csvUploads.reduce((sum, upload) => sum + upload.processedRecords, 0),
            lastUploadDate: demoData.csvUploads.length > 0 ? 
              demoData.csvUploads.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())[0].uploadDate : 
              undefined,
            averageRecordsPerUpload: demoData.csvUploads.length > 0 ? 
              Math.round(demoData.csvUploads.reduce((sum, upload) => sum + upload.processedRecords, 0) / demoData.csvUploads.length) : 
              0
          });
        } else {
          // In a real implementation, this would fetch from the API
          const [historyData, statsData] = await Promise.all([
            csvService.getUploadHistory(),
            csvService.getUploadStats()
          ]);
          setUploadHistory(historyData);
          setUploadStats(statsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load CSV upload data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isDemoMode, demoData.csvUploads]);
  
  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      if (isDemoMode) {
        // Simulate upload in demo mode
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        
        // Create a new upload history entry
        const newUpload: CSVUploadHistory = {
          id: `csv_${demoData.csvUploads.length + 1}`,
          fileName: file.name,
          uploadedBy: 'admin@bridgetunes.com',
          uploadDate: new Date().toISOString(),
          totalRecords: 500,
          processedRecords: 495,
          failedRecords: 5,
          status: 'completed'
        };
        
        // Update demo data
        const updatedUploads = [newUpload, ...demoData.csvUploads];
        updateDemoData('csvUploads', updatedUploads);
        
        setUploadHistory(updatedUploads);
        
        // Update stats
        if (uploadStats) {
          setUploadStats({
            totalUploads: uploadStats.totalUploads + 1,
            totalRecordsProcessed: uploadStats.totalRecordsProcessed + 495,
            lastUploadDate: new Date().toISOString(),
            averageRecordsPerUpload: Math.round((uploadStats.totalRecordsProcessed + 495) / (uploadStats.totalUploads + 1))
          });
        }
      } else {
        // In a real implementation, this would call the API
        const response = await csvService.uploadCSV(file);
        
        // Refresh data after upload
        const [historyData, statsData] = await Promise.all([
          csvService.getUploadHistory(),
          csvService.getUploadStats()
        ]);
        setUploadHistory(historyData);
        setUploadStats(statsData);
      }
      
      alert('File uploaded successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload CSV file');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleValidate = async (file: File): Promise<CSVUploadSummary> => {
    try {
      setIsValidating(true);
      
      if (isDemoMode) {
        // Simulate validation in demo mode
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        // Return mock validation summary
        return {
          totalRecords: 500,
          validRecords: 495,
          invalidRecords: 5,
          duplicateRecords: 2,
          optInRecords: 450,
          optOutRecords: 50,
          rechargeAmountDistribution: {
            '100': 125,
            '200': 150,
            '500': 125,
            '1000': 100
          },
          dateDistribution: {
            '07/04/2025': 75,
            '08/04/2025': 80,
            '09/04/2025': 70,
            '10/04/2025': 85,
            '11/04/2025': 65,
            '12/04/2025': 75,
            '13/04/2025': 50
          }
        };
      } else {
        // In a real implementation, this would call the API
        const summary = await csvService.validateCSV(file);
        return summary;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate CSV file');
      throw err;
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleDownloadTemplate = () => {
    try {
      // Create CSV template content
      const csvContent = 'MSISDN,Recharge Amount (Naira),Opt-In Status,Recharge Date\n08036785165,200,Yes,11/04/2025\n08033724661,100,Yes,11/04/2025';
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'subscriber_data_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download template');
    }
  };
  
  const handleViewSummary = async (id: string) => {
    try {
      setLoading(true);
      
      if (isDemoMode) {
        // Simulate API call in demo mode
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
        
        // Return mock summary
        setCurrentUploadSummary({
          totalRecords: 500,
          validRecords: 495,
          invalidRecords: 5,
          duplicateRecords: 2,
          optInRecords: 450,
          optOutRecords: 50,
          rechargeAmountDistribution: {
            '100': 125,
            '200': 150,
            '500': 125,
            '1000': 100
          },
          dateDistribution: {
            '07/04/2025': 75,
            '08/04/2025': 80,
            '09/04/2025': 70,
            '10/04/2025': 85,
            '11/04/2025': 65,
            '12/04/2025': 75,
            '13/04/2025': 50
          }
        });
      } else {
        // In a real implementation, this would call the API
        const summary = await csvService.getUploadSummary(id);
        setCurrentUploadSummary(summary);
      }
      
      setCurrentUploadId(id);
      setShowSummaryModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch upload summary');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDemoDataUpdate = () => {
    // Refresh data after demo data update
    setUploadHistory(demoData.csvUploads);
    if (uploadStats) {
      setUploadStats({
        totalUploads: demoData.csvUploads.length,
        totalRecordsProcessed: demoData.csvUploads.reduce((sum, upload) => sum + upload.processedRecords, 0),
        lastUploadDate: demoData.csvUploads.length > 0 ? 
          demoData.csvUploads.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())[0].uploadDate : 
          undefined,
        averageRecordsPerUpload: demoData.csvUploads.length > 0 ? 
          Math.round(demoData.csvUploads.reduce((sum, upload) => sum + upload.processedRecords, 0) / demoData.csvUploads.length) : 
          0
      });
    }
  };
  
  return (
    <CSVUploadContainer>
      <PageHeader>
        <PageTitle>CSV Data Management</PageTitle>
        {isDemoMode && (
          <DemoModeIndicator>
            <FaDatabase /> Demo Mode Active
          </DemoModeIndicator>
        )}
      </PageHeader>
      
      {uploadStats && (
        <StatsGrid>
          <StatCard>
            <StatTitle>Total Uploads</StatTitle>
            <StatValue>{uploadStats.totalUploads}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Records Processed</StatTitle>
            <StatValue>{uploadStats.totalRecordsProcessed}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Avg. Records Per Upload</StatTitle>
            <StatValue>{uploadStats.averageRecordsPerUpload}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Last Upload</StatTitle>
            <StatValue>
              {uploadStats.lastUploadDate 
                ? new Date(uploadStats.lastUploadDate).toLocaleDateString() 
                : 'Never'}
            </StatValue>
          </StatCard>
        </StatsGrid>
      )}
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'upload'} 
          onClick={() => setActiveTab('upload')}
        >
          <FaUpload /> Upload
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          <FaHistory /> Upload History
        </Tab>
      </TabsContainer>
      
      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}
      
      {loading && !uploadHistory.length ? (
        <LoadingContainer>Loading...</LoadingContainer>
      ) : (
        <>
          {activeTab === 'upload' ? (
            <>
              {isDemoMode && (
                <CSVUploaderForDemo onUploadComplete={handleDemoDataUpdate} />
              )}
              <CSVUploader
                onUpload={handleUpload}
                onValidate={handleValidate}
                onDownloadTemplate={handleDownloadTemplate}
                isUploading={isUploading}
                isValidating={isValidating}
              />
            </>
          ) : (
            <>
              {uploadHistory.length === 0 ? (
                <EmptyState>
                  <EmptyStateIcon>
                    <FaHistory />
                  </EmptyStateIcon>
                  <EmptyStateText>No upload history found</EmptyStateText>
                  <EmptyStateSubtext>
                    Upload a CSV file to see the history here
                  </EmptyStateSubtext>
                </EmptyState>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>File Name</TableHeader>
                        <TableHeader>Uploaded By</TableHeader>
                        <TableHeader>Upload Date</TableHeader>
                        <TableHeader>Total Records</TableHeader>
                        <TableHeader>Processed</TableHeader>
                        <TableHeader>Failed</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Actions</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {uploadHistory.map(upload => (
                        <TableRow key={upload.id}>
                          <TableCell>{upload.fileName}</TableCell>
                          <TableCell>{upload.uploadedBy}</TableCell>
                          <TableCell>{new Date(upload.uploadDate).toLocaleString()}</TableCell>
                          <TableCell>{upload.totalRecords}</TableCell>
                          <TableCell>{upload.processedRecords}</TableCell>
                          <TableCell>{upload.failedRecords}</TableCell>
                          <TableCell>
                            <UploadStatus status={upload.status}>
                              {upload.status}
                            </UploadStatus>
                          </TableCell>
                          <TableCell>
                            <ActionButton 
                              onClick={() => handleViewSummary(upload.id)}
                              title="View Summary"
                            >
                              <FaChartBar />
                            </ActionButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </>
      )}
      
      {/* Upload Summary Modal */}
      {showSummaryModal && currentUploadSummary && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowSummaryModal(false)}
        >
          <ModalContent
            onClick={e => e.stopPropagation()}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <ModalHeader>
              <ModalTitle>
                Upload Summary
                {uploadHistory.find(u => u.id === currentUploadId)?.fileName && (
                  <>: {uploadHistory.find(u => u.id === currentUploadId)?.fileName}</>
                )}
              </ModalTitle>
              <CloseButton onClick={() => setShowSummaryModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <SummaryGrid>
              <SummaryItem>
                <SummaryLabel>Total Records</SummaryLabel>
                <SummaryValue>{currentUploadSummary.totalRecords}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Valid Records</SummaryLabel>
                <SummaryValue>{currentUploadSummary.validRecords}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Invalid Records</SummaryLabel>
                <SummaryValue isNegative={currentUploadSummary.invalidRecords > 0}>
                  {currentUploadSummary.invalidRecords}
                </SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Duplicate Records</SummaryLabel>
                <SummaryValue isNegative={currentUploadSummary.duplicateRecords > 0}>
                  {currentUploadSummary.duplicateRecords}
                </SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Opt-In Records</SummaryLabel>
                <SummaryValue>{currentUploadSummary.optInRecords}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Opt-Out Records</SummaryLabel>
                <SummaryValue>{currentUploadSummary.optOutRecords}</SummaryValue>
              </SummaryItem>
            </SummaryGrid>
            
            <DistributionContainer>
              <DistributionTitle>Recharge Amount Distribution</DistributionTitle>
              <DistributionGrid>
                {Object.entries(currentUploadSummary.rechargeAmountDistribution).map(([amount, count]) => (
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
                {Object.entries(currentUploadSummary.dateDistribution).map(([date, count]) => (
                  <DistributionItem key={date}>
                    <DistributionLabel>{date}</DistributionLabel>
                    <DistributionValue>{count}</DistributionValue>
                  </DistributionItem>
                ))}
              </DistributionGrid>
            </DistributionContainer>
          </ModalContent>
        </Modal>
      )}
    </CSVUploadContainer>
  );
};

export default CSVUploadPage;
