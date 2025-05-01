import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBell, FaEnvelope, FaUsers, FaPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaPaperPlane, FaSort, FaCopy } from 'react-icons/fa'; // Added FaSort, FaCopy
import { useDemoMode } from '../context/DemoModeContext'; // Assuming context path
import { notificationService } from '../services/notification.service'; // Use the updated service
import PageLayout from '../components/PageLayout'; // Assuming component paths
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { NotificationTemplate, Segment } from '../types/notification.types'; // Import the correct types

// Import the modal components
import CreateTemplateModal from '../components/modals/CreateTemplateModal';
import CreateSegmentModal from '../components/modals/CreateSegmentModal';
import CreateCampaignModal from '../components/modals/CreateCampaignModal';

// --- Updated Types to match service definitions ---
// Ideally these would be imported from a shared types file
type CampaignType = 'ONE_TIME' | 'RECURRING' | 'TRIGGERED' | 'MULTI_STEP' | 'AB_TEST' | 'SCHEDULED'; // Added SCHEDULED
type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'EXECUTING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELED';
type TemplateType = 'SMS' | 'EMAIL' | 'IN_APP';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  type?: CampaignType;
  status: CampaignStatus | string;
  templateId: string;
  segmentId?: string;
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

// Using NotificationTemplate and Segment from imported types
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

const SearchFilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap; // Allow wrapping on smaller screens

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

// Placeholder for filter button/dropdown
const FilterButton = styled(Button)`
  padding: 0.75rem 1rem;
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

// Basic Table Style
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid ${props => props.theme.colors.gray200};
    text-align: left;
    vertical-align: middle; // Align content vertically
  }

  th {
    background-color: ${props => props.theme.colors.gray100};
    font-weight: 600;
    color: ${props => props.theme.colors.gray700};
    cursor: pointer; // Indicate sortable columns
    white-space: nowrap;

    &:hover {
      background-color: ${props => props.theme.colors.gray200};
    }

    .sort-icon {
      margin-left: 0.5rem;
      opacity: 0.5;
    }
  }

  tbody tr:hover {
    background-color: ${props => props.theme.colors.gray50};
  }

  // Style for actions column
  .actions-cell {
    white-space: nowrap; // Prevent buttons from wrapping
    text-align: right;
    width: 1%; // Prevent actions column from taking too much space
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
    switch (props.status?.toLowerCase()) { // Added safety check for status
      case 'draft': return '#f0f0f0';
      case 'scheduled': return '#e3f2fd';
      case 'executing': return '#fff8e1';
      case 'active': return '#e8f5e9';
      case 'inactive': return '#fce4ec'; // Changed inactive style
      case 'completed': return '#e8f5e9';
      case 'failed': return '#ffebee';
      case 'paused': return '#f3e5f5';
      case 'canceled': return '#fafafa';
      default: return '#f0f0f0';
    }
  }};

  color: ${props => {
    switch (props.status?.toLowerCase()) { // Added safety check for status
      case 'draft': return '#757575';
      case 'scheduled': return '#0277bd';
      case 'executing': return '#ff8f00';
      case 'active': return '#2e7d32';
      case 'inactive': return '#ad1457'; // Changed inactive style
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
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
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
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  useEffect(() => {
    const fetchNotificationData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [campaignsData, templatesData, segmentsData] = await Promise.all([
          notificationService.getCampaigns(),
          notificationService.getAllTemplates(),
          notificationService.getSegments()
        ]);

        setCampaigns(campaignsData);
        setTemplates(templatesData);
        setSegments(segmentsData);

      } catch (err) {
        console.error('Error fetching notification data:', err);
        setError('Failed to load some notification data. Displaying available or mock data.');
        // Ensure arrays are initialized even on error
        if (!campaigns) setCampaigns([]);
        if (!templates) setTemplates([]);
        if (!segments) setSegments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificationData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter logic
  const filteredCampaigns = campaigns.filter(campaign =>
    (campaign.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (campaign.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = templates.filter(template =>
    (template.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (template.type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (template.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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

  const handleTemplateCreated = (newTemplate: NotificationTemplate) => {
    setTemplates(prev => [newTemplate, ...prev]);
    showToast(`Template "${newTemplate.name}" created successfully!`);
  };

  const handleSegmentCreated = (newSegment: Segment) => {
    setSegments(prev => [newSegment, ...prev]);
    showToast(`Segment "${newSegment.name}" created successfully!`);
  };

  // Placeholder action handlers
  const handleEditTemplate = (templateId: string) => {
    console.log('Edit template:', templateId);
    // TODO: Implement opening modal with existing template data
    showToast('Edit functionality not implemented yet.', 'info');
  };

  const handleDeleteTemplate = (templateId: string) => {
    console.log('Delete template:', templateId);
    // TODO: Implement confirmation and API call
    showToast('Delete functionality not implemented yet.', 'info');
  };

  const handleSendTestTemplate = (templateId: string) => {
    console.log('Send test for template:', templateId);
    // TODO: Implement modal to get recipient and API call
    showToast('Send Test functionality not implemented yet.', 'info');
  };

  const handleDuplicateTemplate = (templateId: string) => {
    console.log('Duplicate template:', templateId);
    // TODO: Implement fetching template data and opening create modal pre-filled
    showToast('Duplicate functionality not implemented yet.', 'info');
  };

  // Placeholder sort handler
  const handleSort = (column: string) => {
    console.log('Sort by:', column);
    showToast(`Sorting by ${column} not implemented yet.`, 'info');
  };

  // Placeholder filter handler
  const handleFilter = () => {
    console.log('Apply filters');
    showToast('Filtering not implemented yet.', 'info');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <LoadingSpinner size={60} />
        </div>
      );
    }

    if (error && activeTab === 'campaigns' && !campaigns.length) {
      // Show error specific to campaigns if needed
    }
    // Similar checks for templates and segments

    switch (activeTab) {
      case 'campaigns':
        return (
          <>
            <HeaderActions>
              <SearchFilterContainer>
                <SearchInput>
                  <FaSearch />
                  <input type="text" placeholder="Search campaigns..." value={searchTerm} onChange={handleSearch} />
                </SearchInput>
                {/* Add filter button if needed */}
              </SearchFilterContainer>
              <Button startIcon={<FaPlus />} onClick={handleCreateCampaign}>Create Campaign</Button>
            </HeaderActions>
            {filteredCampaigns.length > 0 ? (
              <StyledTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Segment</th>
                    <th>Template</th>
                    <th>Scheduled/Executed</th>
                    <th>Type</th>
                    <th className="actions-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map(campaign => {
                    const segment = segments.find(s => s.id === campaign.segmentId);
                    const template = templates.find(t => t.id === campaign.templateId);
                    const displayDate = campaign.schedule?.scheduledTime 
                      ? new Date(campaign.schedule.scheduledTime).toLocaleString() 
                      : (campaign.executedAt ? new Date(campaign.executedAt).toLocaleString() : 'Immediate');
                    return (
                      <tr key={campaign.id}>
                        <td>{campaign.name}</td>
                        <td><StatusBadge status={campaign.status}>{campaign.status}</StatusBadge></td>
                        <td>{segment?.name || 'N/A'}</td>
                        <td>{template?.name || 'N/A'}</td>
                        <td>{displayDate}</td>
                        <td>{campaign.type || 'ONE_TIME'}</td>
                        <td className="actions-cell">
                          <Button variant="icon" title="Edit" onClick={() => showToast('Edit campaign not implemented.', 'info')}><FaEdit /></Button>
                          <Button variant="icon" title="Delete" onClick={() => showToast('Delete campaign not implemented.', 'info')}><FaTrash /></Button>
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
                <p>{searchTerm ? 'No campaigns match your search.' : (error ? error : 'Create your first campaign.')}</p>
                {!searchTerm && <Button startIcon={<FaPlus />} onClick={handleCreateCampaign}>Create Campaign</Button>}
              </EmptyState>
            )}
          </>
        );
      case 'templates':
        return (
          <>
            <HeaderActions>
              <SearchFilterContainer>
                <SearchInput>
                  <FaSearch />
                  <input type="text" placeholder="Search templates..." value={searchTerm} onChange={handleSearch} />
                </SearchInput>
                <FilterButton variant="secondary" startIcon={<FaFilter />} onClick={handleFilter}>Filter</FilterButton>
              </SearchFilterContainer>
              <Button startIcon={<FaPlus />} onClick={handleCreateTemplate}>Create Template</Button>
            </HeaderActions>
            {filteredTemplates.length > 0 ? (
              <StyledTable>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')}>Name <FaSort className="sort-icon"/></th>
                    <th onClick={() => handleSort('type')}>Type <FaSort className="sort-icon"/></th>
                    <th>Title / Subject</th>
                    <th onClick={() => handleSort('status')}>Status <FaSort className="sort-icon"/></th>
                    <th onClick={() => handleSort('createdAt')}>Created <FaSort className="sort-icon"/></th>
                    <th onClick={() => handleSort('updatedAt')}>Updated <FaSort className="sort-icon"/></th>
                    <th className="actions-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.map(template => (
                    <tr key={template.id}>
                      <td>{template.name}</td>
                      <td>{template.type}</td>
                      <td>{template.title}</td>
                      <td><StatusBadge status={template.status || 'DRAFT'}>{template.status || 'DRAFT'}</StatusBadge></td>
                      <td>{new Date(template.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(template.updatedAt).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <Button variant="icon" title="Edit" onClick={() => handleEditTemplate(template.id)}><FaEdit /></Button>
                        <Button variant="icon" title="Duplicate" onClick={() => handleDuplicateTemplate(template.id)}><FaCopy /></Button>
                        <Button variant="icon" title="Send Test" onClick={() => handleSendTestTemplate(template.id)}><FaPaperPlane /></Button>
                        <Button variant="icon" title="Delete" onClick={() => handleDeleteTemplate(template.id)}><FaTrash /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            ) : (
              <EmptyState>
                <FaEnvelope />
                <h3>No templates found</h3>
                <p>{searchTerm ? 'No templates match your search.' : (error ? error : 'Create your first notification template.')}</p>
                {!searchTerm && <Button startIcon={<FaPlus />} onClick={handleCreateTemplate}>Create Template</Button>}
              </EmptyState>
            )}
          </>
        );
      case 'segments':
        return (
          <>
            <HeaderActions>
              <SearchFilterContainer>
                <SearchInput>
                  <FaSearch />
                  <input type="text" placeholder="Search segments..." value={searchTerm} onChange={handleSearch} />
                </SearchInput>
                {/* Add filter button if needed */}
              </SearchFilterContainer>
              <Button startIcon={<FaPlus />} onClick={handleCreateSegment}>Create Segment</Button>
            </HeaderActions>
            {filteredSegments.length > 0 ? (
              <StyledTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>User Count</th>
                    <th>Created</th>
                    <th className="actions-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSegments.map(segment => (
                    <tr key={segment.id}>
                      <td>{segment.name}</td>
                      <td>{segment.description || '-'}</td>
                      <td>{segment.userCount ?? 'N/A'}</td>
                      <td>{segment.createdAt ? new Date(segment.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="actions-cell">
                        <Button variant="icon" title="Edit" onClick={() => showToast('Edit segment not implemented.', 'info')}><FaEdit /></Button>
                        <Button variant="icon" title="Delete" onClick={() => showToast('Delete segment not implemented.', 'info')}><FaTrash /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            ) : (
              <EmptyState>
                <FaUsers />
                <h3>No segments found</h3>
                <p>{searchTerm ? 'No segments match your search.' : (error ? error : 'Create your first user segment.')}</p>
                {!searchTerm && <Button startIcon={<FaPlus />} onClick={handleCreateSegment}>Create Segment</Button>}
              </EmptyState>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout title="Notifications & Campaigns">
      <NotificationsContainer>
        <TabsContainer>
          <Tab active={activeTab === 'campaigns'} onClick={() => setActiveTab('campaigns')}><FaBell /> Campaigns</Tab>
          <Tab active={activeTab === 'templates'} onClick={() => setActiveTab('templates')}><FaEnvelope /> Templates</Tab>
          <Tab active={activeTab === 'segments'} onClick={() => setActiveTab('segments')}><FaUsers /> Segments</Tab>
        </TabsContainer>

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
        templates={templates} // Pass templates to modal
        segments={segments}   // Pass segments to modal
      />

      {/* Toast Notification */}
      {toast.visible && (
        <Toast type={toast.type}>
          {toast.message}
        </Toast>
      )}
    </PageLayout>
  );
};

export default Notifications;

