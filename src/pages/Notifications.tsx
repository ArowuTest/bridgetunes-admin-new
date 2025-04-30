import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBell, FaEnvelope, FaUsers, FaPlus, FaSearch, FaFilter, FaEdit, FaTrash } from 'react-icons/fa';
import { useDemoMode } from '../context/DemoModeContext'; // Assuming context path
import { notificationService } from '../services/notification.service'; // Use the updated service
import PageLayout from '../components/PageLayout'; // Assuming component paths
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationTable from '../components/notification/NotificationTable'; // Assuming component path
import TemplateTable from '../components/notification/TemplateTable'; // Assuming component path
import { NotificationTemplate } from '../types/notification.types'; // Import the correct type

// Import the modal components
import CreateTemplateModal from '../components/modals/CreateTemplateModal';
import CreateSegmentModal from '../components/modals/CreateSegmentModal';
import CreateCampaignModal from '../components/modals/CreateCampaignModal';

// --- Updated Types to match service definitions ---
// Ideally these would be imported from a shared types file
type CampaignType = 'ONE_TIME' | 'RECURRING' | 'TRIGGERED' | 'MULTI_STEP' | 'AB_TEST';
type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'EXECUTING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELED';
type TemplateType = 'SMS' | 'EMAIL' | 'IN_APP';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  type?: CampaignType;
  status: CampaignStatus | string;
  templateId: string;
  segmentId?: string; // Added this property to fix the build error
  schedule?: {
    type: 'IMMEDIATE' | 'SCHEDULED' | 'RECURRING';
    scheduledTime?: string;
    cronExpression?: string;
    timeZone?: string;
  };
  priority?: number;
  createdAt: string;
  updatedAt: string;
  executedAt?: string;
}

interface Segment {
  id: string;
  name: string;
  description?: string;
  criteria: any; // Define criteria structure based on requirements
  userCount?: number; // Added for table display
  createdAt: string;
  updatedAt: string;
}

// Using NotificationTemplate from imported types instead of local Template interface
// This fixes the type mismatch error
// --------------------------------------------------------------------------

const NotificationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.gray300};
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray600};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const SearchFilter = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 100%;
  }
`;

const SearchInput = styled.div`
  position: relative;
  
  input {
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid ${props => props.theme.colors.gray300};
    border-radius: 8px;
    font-size: 0.875rem;
    width: 250px;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}33`};
    }
    
    @media (max-width: ${props => props.theme.breakpoints.md}) {
      width: 100%;
    }
  }
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.gray600};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.gray600};
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.gray400};
  }
  
  h3 {
    margin: 0 0 0.5rem 0;
  }
  
  p {
    margin: 0 0 1.5rem 0;
  }
`;

// Basic Table Style (Replace with your DataTable component if available)
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid ${props => props.theme.colors.gray200};
    text-align: left;
  }
  
  th {
    background-color: ${props => props.theme.colors.gray100};
    font-weight: 600;
    color: ${props => props.theme.colors.gray700};
  }
  
  tbody tr:hover {
    background-color: ${props => props.theme.colors.gray50};
  }
`;

// Status badge component
const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  
  background-color: ${props => {
    switch (props.status.toLowerCase()) {
      case 'draft': return '#f0f0f0';
      case 'scheduled': return '#e3f2fd';
      case 'executing': return '#fff8e1';
      case 'active': return '#e8f5e9';
      case 'completed': return '#e8f5e9';
      case 'failed': return '#ffebee';
      case 'paused': return '#f3e5f5';
      case 'canceled': return '#fafafa';
      default: return '#f0f0f0';
    }
  }};
  
  color: ${props => {
    switch (props.status.toLowerCase()) {
      case 'draft': return '#757575';
      case 'scheduled': return '#0277bd';
      case 'executing': return '#ff8f00';
      case 'active': return '#2e7d32';
      case 'completed': return '#2e7d32';
      case 'failed': return '#c62828';
      case 'paused': return '#7b1fa2';
      case 'canceled': return '#616161';
      default: return '#757575';
    }
  }};
`;

// Toast notification component
const Toast = styled.div<{ type: 'success' | 'error' | 'info' }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1100;
  
  background-color: ${props => {
    switch (props.type) {
      case 'success': return '#e8f5e9';
      case 'error': return '#ffebee';
      case 'info': return '#e3f2fd';
      default: return '#e8f5e9';
    }
  }};
  
  color: ${props => {
    switch (props.type) {
      case 'success': return '#2e7d32';
      case 'error': return '#c62828';
      case 'info': return '#0277bd';
      default: return '#2e7d32';
    }
  }};
`;

const Notifications: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'segments'>('campaigns');
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]); // Changed type to NotificationTemplate
  const [segments, setSegments] = useState<Segment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSegmentModalOpen, setIsSegmentModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false
  });
  
  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, visible: true });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };
  
  useEffect(() => {
    const fetchNotificationData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all data concurrently
        const [campaignsData, templatesData, segmentsData] = await Promise.all([
          notificationService.getCampaigns(),
          notificationService.getAllTemplates(),
          notificationService.getSegments()
        ]);
        
        setCampaigns(campaignsData);
        setTemplates(templatesData); // Now correctly accepts NotificationTemplate[]
        setSegments(segmentsData);

      } catch (err) {
        console.error('Error fetching notification data:', err);
        setError('Failed to load some notification data. Displaying available or mock data.');
        // Set empty arrays on critical failure, though service might return mock data
        if (!campaigns.length) setCampaigns([]); 
        if (!templates.length) setTemplates([]);
        if (!segments.length) setSegments([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotificationData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode]); // Assuming isDemoMode might influence fetching
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter logic - ensure properties exist before accessing
  const filteredCampaigns = campaigns.filter(campaign => 
    (campaign.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (campaign.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  const filteredTemplates = templates.filter(template => 
    (template.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (template.type?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  const filteredSegments = segments.filter(segment => 
    (segment.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (segment.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  // Modal handlers
  const handleCreateCampaign = () => {
    setIsCampaignModalOpen(true);
  };
  
  const handleCreateTemplate = () => {
    setIsTemplateModalOpen(true);
  };
  
  const handleCreateSegment = () => {
    setIsSegmentModalOpen(true);
  };
  
  // Handle creation callbacks
  const handleCampaignCreated = (newCampaign: Campaign) => {
    setCampaigns(prev => [newCampaign, ...prev]);
    showToast(`Campaign "${newCampaign.name}" created successfully!`);
  };
  
  const handleTemplateCreated = (newTemplate: NotificationTemplate) => { // Changed type to NotificationTemplate
    setTemplates(prev => [newTemplate, ...prev]);
    showToast(`Template "${newTemplate.name}" created successfully!`);
  };
  
  const handleSegmentCreated = (newSegment: Segment) => {
    setSegments(prev => [newSegment, ...prev]);
    showToast(`Segment "${newSegment.name}" created successfully!`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <LoadingSpinner size={60} />
        </div>
      );
    }

    if (error) {
      // Optionally display a more prominent error message
      // return <Card><p style={{ color: 'red' }}>{error}</p></Card>;
    }

    switch (activeTab) {
      case 'campaigns':
        return filteredCampaigns.length > 0 ? (
          // Use the specific campaign table component if available, otherwise use a basic table
          <StyledTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Segment</th>
                <th>Template</th>
                <th>Scheduled</th>
                <th>Recurrence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map(campaign => {
                // Find related segment and template names
                const segment = segments.find(s => s.id === campaign.segmentId);
                const template = templates.find(t => t.id === campaign.templateId);
                
                return (
                  <tr key={campaign.id}>
                    <td>{campaign.name}</td>
                    <td>
                      <StatusBadge status={campaign.status}>
                        {campaign.status}
                      </StatusBadge>
                    </td>
                    <td>{segment?.name || 'N/A'}</td>
                    <td>{template?.name || 'N/A'}</td>
                    <td>{campaign.executedAt ? new Date(campaign.executedAt).toLocaleString() : 'Not executed'}</td>
                    <td>{campaign.type || 'One-time'}</td>
                    <td>
                      <Button variant="icon" title="Edit" onClick={() => console.log('Edit campaign', campaign.id)}>
                        <FaEdit />
                      </Button>
                      <Button variant="icon" title="Delete" onClick={() => console.log('Delete campaign', campaign.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </StyledTable>
        ) : (
          <EmptyState>
            <FaBell />
            <h3>No campaigns found</h3>
            <p>{error ? error : 'Either no campaigns exist or they could not be loaded. Mock data might be shown if API failed.'}</p>
            <Button startIcon={<FaPlus />} onClick={handleCreateCampaign}>Create Campaign</Button>
          </EmptyState>
        );
      case 'templates':
        return filteredTemplates.length > 0 ? (
          // Use the specific template table component if available, otherwise use a basic table
          <StyledTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Title</th> {/* Updated to match NotificationTemplate structure */}
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map(template => (
                <tr key={template.id}>
                  <td>{template.name}</td>
                  <td>{template.type}</td>
                  <td>{template.title}</td> {/* Updated to match NotificationTemplate structure */}
                  <td>{new Date(template.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button variant="icon" title="Edit" onClick={() => console.log('Edit template', template.id)}>
                      <FaEdit />
                    </Button>
                    <Button variant="icon" title="Delete" onClick={() => console.log('Delete template', template.id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        ) : (
          <EmptyState>
            <FaEnvelope />
            <h3>No templates found</h3>
            <p>{error ? error : 'Create your first notification template.'}</p>
            <Button startIcon={<FaPlus />} onClick={handleCreateTemplate}>Create Template</Button>
          </EmptyState>
        );
      case 'segments':
        return filteredSegments.length > 0 ? (
          // Using a basic table for segments as a specific component wasn't specified
          <StyledTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>User Count</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSegments.map(segment => (
                <tr key={segment.id}>
                  <td>{segment.name}</td>
                  <td>{segment.description || '-'}</td>
                  <td>{segment.userCount?.toLocaleString() ?? 'N/A'}</td>
                  <td>{new Date(segment.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button variant="icon" title="Edit" onClick={() => console.log('Edit segment', segment.id)}>
                      <FaEdit />
                    </Button>
                    <Button variant="icon" title="Delete" onClick={() => console.log('Delete segment', segment.id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        ) : (
          <EmptyState>
            <FaUsers />
            <h3>No segments found</h3>
            <p>{error ? error : 'Backend endpoint for segments might not be implemented. Mock data might be shown.'}</p>
            <Button startIcon={<FaPlus />} onClick={handleCreateSegment}>Create Segment</Button>
          </EmptyState>
        );
      default:
        return null;
    }
  };
  
  return (
    <PageLayout title="Notifications">
      <NotificationsContainer>
        <TabsContainer>
          <Tab active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')}>
            <FaBell /> Campaigns
          </Tab>
          <Tab active={activeTab === 'templates'} onClick={() => setActiveTab('templates')}>
            <FaEnvelope /> Templates
          </Tab>
          <Tab active={activeTab === 'segments'} onClick={() => setActiveTab('segments')}>
            <FaUsers /> Segments
          </Tab>
        </TabsContainer>
        
        <HeaderActions>
          <SearchFilter>
            <SearchInput>
              <FaSearch />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchInput>
            {/* Filter button functionality not implemented */}
            {/* <Button variant="secondary" startIcon={<FaFilter />}>Filter</Button> */}
          </SearchFilter>
          
          {activeTab === 'campaigns' && (
            <Button startIcon={<FaPlus />} onClick={handleCreateCampaign}>Create Campaign</Button>
          )}
          {activeTab === 'templates' && (
            <Button startIcon={<FaPlus />} onClick={handleCreateTemplate}>Create Template</Button>
          )}
          {activeTab === 'segments' && (
            <Button startIcon={<FaPlus />} onClick={handleCreateSegment}>Create Segment</Button>
          )}
        </HeaderActions>
        
        <Card>
          {renderContent()}
        </Card>
      </NotificationsContainer>
      
      {/* Modals */}
      <CreateTemplateModal 
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onTemplateCreated={handleTemplateCreated}
      />
      
      <CreateSegmentModal
        isOpen={isSegmentModalOpen}
        onClose={() => setIsSegmentModalOpen(false)}
        onSegmentCreated={handleSegmentCreated}
      />
      
      <CreateCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        onCampaignCreated={handleCampaignCreated}
      />
      
      {/* Toast notification */}
      {toast.visible && (
        <Toast type={toast.type}>
          {toast.message}
        </Toast>
      )}
    </PageLayout>
  );
};

// Ensure default export if needed by router
export { Notifications }; 
export default Notifications;
