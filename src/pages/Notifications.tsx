import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEnvelope, FaSms, FaBell, FaClone } from 'react-icons/fa';
import NotificationTable from '../components/notification/NotificationTable';
import TemplateTable from '../components/notification/TemplateTable';
import { notificationService } from '../services/notification.service';
import { Notification, NotificationTemplate, NotificationStats } from '../types/notification.types';
import { defaultNotificationTemplates } from '../data/notificationTemplates';

const NotificationsContainer = styled.div`
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

const ActionButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: #FFD100;
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #E6BC00;
  }
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
  max-width: 600px;
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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #FFD100;
    box-shadow: 0 0 0 2px rgba(255, 209, 0, 0.2);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #FFD100;
    box-shadow: 0 0 0 2px rgba(255, 209, 0, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #FFD100;
    box-shadow: 0 0 0 2px rgba(255, 209, 0, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: string }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => 
    props.variant === 'primary' ? '#FFD100' : 
    props.variant === 'danger' ? '#dc3545' : 
    props.variant === 'success' ? '#28a745' : 
    '#f8f9fa'};
  color: ${props => 
    props.variant === 'primary' ? '#000' : 
    props.variant === 'danger' ? '#fff' : 
    props.variant === 'success' ? '#fff' : 
    '#212529'};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => 
      props.variant === 'primary' ? '#E6BC00' : 
      props.variant === 'danger' ? '#c82333' : 
      props.variant === 'success' ? '#218838' : 
      '#e2e6ea'};
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
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

const NotificationPreview = styled.div`
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 1rem;
`;

const PreviewTitle = styled.h3`
  font-size: 1.25rem;
  color: #212529;
  margin: 0 0 1rem 0;
`;

const PreviewContent = styled.div`
  white-space: pre-wrap;
  color: #212529;
`;

// Mock data for development/preview
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Weekly Draw Results',
    message: 'The weekly draw has been completed. 10 winners have been selected.',
    type: 'info',
    recipient: 'all-users',
    channel: 'in-app',
    status: 'sent',
    createdAt: '2025-04-26T10:30:00Z',
    sentAt: '2025-04-26T10:35:00Z'
  },
  {
    id: '2',
    title: 'Congratulations! You Won',
    message: 'Congratulations! Your number 0801234**** has been selected as a winner in our Weekly Draw. You have won ₦10,000.',
    type: 'success',
    recipient: '0801234****',
    channel: 'sms',
    status: 'sent',
    createdAt: '2025-04-26T11:00:00Z',
    sentAt: '2025-04-26T11:05:00Z'
  },
  {
    id: '3',
    title: 'System Maintenance',
    message: 'The system will be undergoing maintenance on April 28, 2025 from 2:00 AM to 4:00 AM. Some services may be temporarily unavailable.',
    type: 'warning',
    recipient: 'all-admins',
    channel: 'email',
    status: 'pending',
    createdAt: '2025-04-26T14:00:00Z'
  },
  {
    id: '4',
    title: 'Payment Failed',
    message: 'The payment for prize winner 0902345**** has failed. Please review and retry.',
    type: 'error',
    recipient: 'finance-team',
    channel: 'email',
    status: 'failed',
    createdAt: '2025-04-25T09:15:00Z'
  }
];

const mockNotificationStats: NotificationStats = {
  totalNotifications: 120,
  pendingNotifications: 5,
  sentNotifications: 110,
  failedNotifications: 5,
  emailNotifications: 40,
  smsNotifications: 60,
  inAppNotifications: 20
};

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'templates'>('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [notificationStats, setNotificationStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showCreateNotificationModal, setShowCreateNotificationModal] = useState<boolean>(false);
  const [showViewNotificationModal, setShowViewNotificationModal] = useState<boolean>(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState<boolean>(false);
  const [showEditTemplateModal, setShowEditTemplateModal] = useState<boolean>(false);
  
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<NotificationTemplate | null>(null);
  
  const [notificationFormData, setNotificationFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    recipient: '',
    channel: 'email' as 'email' | 'sms' | 'in-app'
  });
  
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    channel: 'email' as 'email' | 'sms' | 'in-app'
  });
  
  // Fetch notifications, templates, and stats on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real implementation, this would fetch from the API
        // const [notificationsData, templatesData, statsData] = await Promise.all([
        //   notificationService.getAllNotifications(),
        //   notificationService.getAllTemplates(),
        //   notificationService.getNotificationStats()
        // ]);
        // setNotifications(notificationsData);
        // setTemplates(templatesData);
        // setNotificationStats(statsData);
        
        // Using mock data for now
        setNotifications(mockNotifications);
        setTemplates(defaultNotificationTemplates);
        setNotificationStats(mockNotificationStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleCreateNotification = () => {
    setNotificationFormData({
      title: '',
      message: '',
      type: 'info',
      recipient: '',
      channel: 'email'
    });
    setShowCreateNotificationModal(true);
  };
  
  const handleCreateTemplate = () => {
    setTemplateFormData({
      name: '',
      title: '',
      message: '',
      type: 'info',
      channel: 'email'
    });
    setShowCreateTemplateModal(true);
  };
  
  const handleViewNotification = (notification: Notification) => {
    setCurrentNotification(notification);
    setShowViewNotificationModal(true);
  };
  
  const handleEditTemplate = (template: NotificationTemplate) => {
    setCurrentTemplate(template);
    setTemplateFormData({
      name: template.name,
      title: template.title,
      message: template.message,
      type: template.type,
      channel: template.channel
    });
    setShowEditTemplateModal(true);
  };
  
  const handleCloneTemplate = (template: NotificationTemplate) => {
    setTemplateFormData({
      name: `Copy of ${template.name}`,
      title: template.title,
      message: template.message,
      type: template.type,
      channel: template.channel
    });
    setShowCreateTemplateModal(true);
  };
  
  const handleDeleteNotification = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        // In a real implementation, this would call the API
        // await notificationService.deleteNotification(id);
        
        // Update local state
        setNotifications(notifications.filter(notification => notification.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete notification');
      }
    }
  };
  
  const handleDeleteTemplate = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        // In a real implementation, this would call the API
        // await notificationService.deleteTemplate(id);
        
        // Update local state
        setTemplates(templates.filter(template => template.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete template');
      }
    }
  };
  
  const handleResendNotification = async (id: string) => {
    try {
      // In a real implementation, this would call the API
      // const updatedNotification = await notificationService.resendNotification(id);
      
      // Mock implementation
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === id) {
          return {
            ...notification,
            status: 'sent',
            sentAt: new Date().toISOString()
          };
        }
        return notification;
      });
      
      setNotifications(updatedNotifications);
      alert('Notification resent successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend notification');
    }
  };
  
  const handleNotificationFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNotificationFormData({
      ...notificationFormData,
      [name]: value
    });
  };
  
  const handleTemplateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTemplateFormData({
      ...templateFormData,
      [name]: value
    });
  };
  
  const handleCreateNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real implementation, this would call the API
      // const newNotification = await notificationService.createNotification(notificationFormData);
      
      // Mock implementation
      const newNotification: Notification = {
        id: String(notifications.length + 1),
        title: notificationFormData.title,
        message: notificationFormData.message,
        type: notificationFormData.type,
        recipient: notificationFormData.recipient,
        channel: notificationFormData.channel,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // Update local state
      setNotifications([...notifications, newNotification]);
      setShowCreateNotificationModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create notification');
    }
  };
  
  const handleCreateTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real implementation, this would call the API
      // const newTemplate = await notificationService.createTemplate(templateFormData);
      
      // Mock implementation
      const newTemplate: NotificationTemplate = {
        id: `template-${templates.length + 1}`,
        name: templateFormData.name,
        title: templateFormData.title,
        message: templateFormData.message,
        type: templateFormData.type,
        channel: templateFormData.channel
      };
      
      // Update local state
      setTemplates([...templates, newTemplate]);
      setShowCreateTemplateModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
    }
  };
  
  const handleEditTemplateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentTemplate) return;
    
    try {
      // In a real implementation, this would call the API
      // const updatedTemplate = await notificationService.updateTemplate(
      //   currentTemplate.id,
      //   templateFormData
      // );
      
      // Mock implementation
      const updatedTemplate: NotificationTemplate = {
        ...currentTemplate,
        name: templateFormData.name,
        title: templateFormData.title,
        message: templateFormData.message,
        type: templateFormData.type,
        channel: templateFormData.channel
      };
      
      // Update local state
      setTemplates(templates.map(template => 
        template.id === currentTemplate.id ? updatedTemplate : template
      ));
      setShowEditTemplateModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update template');
    }
  };
  
  const handleUseTemplate = (template: NotificationTemplate) => {
    setNotificationFormData({
      title: template.title,
      message: template.message,
      type: template.type,
      recipient: '',
      channel: template.channel
    });
    setActiveTab('notifications');
    setShowCreateNotificationModal(true);
  };
  
  return (
    <NotificationsContainer>
      <PageHeader>
        <PageTitle>Notification Management</PageTitle>
        <ActionButton
          onClick={activeTab === 'notifications' ? handleCreateNotification : handleCreateTemplate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> {activeTab === 'notifications' ? 'Create Notification' : 'Create Template'}
        </ActionButton>
      </PageHeader>
      
      {notificationStats && (
        <StatsGrid>
          <StatCard>
            <StatTitle>Total Notifications</StatTitle>
            <StatValue>{notificationStats.totalNotifications}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Sent</StatTitle>
            <StatValue>{notificationStats.sentNotifications}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Pending</StatTitle>
            <StatValue>{notificationStats.pendingNotifications}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Failed</StatTitle>
            <StatValue>{notificationStats.failedNotifications}</StatValue>
          </StatCard>
        </StatsGrid>
      )}
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'notifications'} 
          onClick={() => setActiveTab('notifications')}
        >
          <FaBell /> Notifications
        </Tab>
        <Tab 
          active={activeTab === 'templates'} 
          onClick={() => setActiveTab('templates')}
        >
          <FaClone /> Templates
        </Tab>
      </TabsContainer>
      
      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}
      
      {loading ? (
        <LoadingContainer>Loading...</LoadingContainer>
      ) : (
        <>
          {activeTab === 'notifications' ? (
            <NotificationTable
              notifications={notifications}
              onResend={handleResendNotification}
              onDelete={handleDeleteNotification}
              onView={handleViewNotification}
            />
          ) : (
            <TemplateTable
              templates={templates}
              onEdit={handleEditTemplate}
              onDelete={handleDeleteTemplate}
              onClone={handleCloneTemplate}
            />
          )}
        </>
      )}
      
      {/* Create Notification Modal */}
      <AnimatePresence>
        {showCreateNotificationModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateNotificationModal(false)}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Create Notification</ModalTitle>
                <CloseButton onClick={() => setShowCreateNotificationModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleCreateNotificationSubmit}>
                <FormGroup>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    value={notificationFormData.title}
                    onChange={handleNotificationFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={notificationFormData.message}
                    onChange={handleNotificationFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    id="type"
                    name="type"
                    value={notificationFormData.type}
                    onChange={handleNotificationFormChange}
                    required
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input
                    type="text"
                    id="recipient"
                    name="recipient"
                    value={notificationFormData.recipient}
                    onChange={handleNotificationFormChange}
                    placeholder="Email, phone number, or user group (e.g., all-users, admin-team)"
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="channel">Channel</Label>
                  <Select
                    id="channel"
                    name="channel"
                    value={notificationFormData.channel}
                    onChange={handleNotificationFormChange}
                    required
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="in-app">In-App</option>
                  </Select>
                </FormGroup>
                
                <NotificationPreview>
                  <PreviewTitle>Preview</PreviewTitle>
                  <PreviewContent>
                    <strong>{notificationFormData.title}</strong>
                    <p>{notificationFormData.message}</p>
                  </PreviewContent>
                </NotificationPreview>
                
                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={() => setShowCreateNotificationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Send Notification
                  </Button>
                </ButtonGroup>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* View Notification Modal */}
      <AnimatePresence>
        {showViewNotificationModal && currentNotification && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewNotificationModal(false)}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>View Notification</ModalTitle>
                <CloseButton onClick={() => setShowViewNotificationModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <FormGroup>
                <Label>Title</Label>
                <div>{currentNotification.title}</div>
              </FormGroup>
              
              <FormGroup>
                <Label>Message</Label>
                <div style={{ whiteSpace: 'pre-wrap' }}>{currentNotification.message}</div>
              </FormGroup>
              
              <FormGroup>
                <Label>Type</Label>
                <NotificationType type={currentNotification.type}>
                  {currentNotification.type}
                </NotificationType>
              </FormGroup>
              
              <FormGroup>
                <Label>Recipient</Label>
                <div>{currentNotification.recipient}</div>
              </FormGroup>
              
              <FormGroup>
                <Label>Channel</Label>
                <NotificationChannel channel={currentNotification.channel}>
                  {currentNotification.channel}
                </NotificationChannel>
              </FormGroup>
              
              <FormGroup>
                <Label>Status</Label>
                <NotificationStatus status={currentNotification.status}>
                  {currentNotification.status}
                </NotificationStatus>
              </FormGroup>
              
              <FormGroup>
                <Label>Created At</Label>
                <div>{new Date(currentNotification.createdAt).toLocaleString()}</div>
              </FormGroup>
              
              {currentNotification.sentAt && (
                <FormGroup>
                  <Label>Sent At</Label>
                  <div>{new Date(currentNotification.sentAt).toLocaleString()}</div>
                </FormGroup>
              )}
              
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() => setShowViewNotificationModal(false)}
                >
                  Close
                </Button>
                {currentNotification.status !== 'sent' && (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      handleResendNotification(currentNotification.id);
                      setShowViewNotificationModal(false);
                    }}
                  >
                    Resend
                  </Button>
                )}
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Create Template Modal */}
      <AnimatePresence>
        {showCreateTemplateModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateTemplateModal(false)}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Create Template</ModalTitle>
                <CloseButton onClick={() => setShowCreateTemplateModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleCreateTemplateSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={templateFormData.name}
                    onChange={handleTemplateFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    value={templateFormData.title}
                    onChange={handleTemplateFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={templateFormData.message}
                    onChange={handleTemplateFormChange}
                    required
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6c757d' }}>
                    Use placeholders like {{name}}, {{amount}}, etc. for dynamic content.
                  </div>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    id="type"
                    name="type"
                    value={templateFormData.type}
                    onChange={handleTemplateFormChange}
                    required
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="channel">Channel</Label>
                  <Select
                    id="channel"
                    name="channel"
                    value={templateFormData.channel}
                    onChange={handleTemplateFormChange}
                    required
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="in-app">In-App</option>
                  </Select>
                </FormGroup>
                
                <NotificationPreview>
                  <PreviewTitle>Preview</PreviewTitle>
                  <PreviewContent>
                    <strong>{templateFormData.title}</strong>
                    <p>{templateFormData.message}</p>
                  </PreviewContent>
                </NotificationPreview>
                
                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={() => setShowCreateTemplateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="success"
                    onClick={() => {
                      setShowCreateTemplateModal(false);
                      handleUseTemplate({
                        id: 'temp',
                        ...templateFormData
                      });
                    }}
                  >
                    Save & Use
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Save Template
                  </Button>
                </ButtonGroup>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Edit Template Modal */}
      <AnimatePresence>
        {showEditTemplateModal && currentTemplate && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditTemplateModal(false)}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Edit Template</ModalTitle>
                <CloseButton onClick={() => setShowEditTemplateModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleEditTemplateSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={templateFormData.name}
                    onChange={handleTemplateFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    name="title"
                    value={templateFormData.title}
                    onChange={handleTemplateFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={templateFormData.message}
                    onChange={handleTemplateFormChange}
                    required
                  />
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6c757d' }}>
                    Use placeholders like {{name}}, {{amount}}, etc. for dynamic content.
                  </div>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    id="type"
                    name="type"
                    value={templateFormData.type}
                    onChange={handleTemplateFormChange}
                    required
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="channel">Channel</Label>
                  <Select
                    id="channel"
                    name="channel"
                    value={templateFormData.channel}
                    onChange={handleTemplateFormChange}
                    required
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="in-app">In-App</option>
                  </Select>
                </FormGroup>
                
                <NotificationPreview>
                  <PreviewTitle>Preview</PreviewTitle>
                  <PreviewContent>
                    <strong>{templateFormData.title}</strong>
                    <p>{templateFormData.message}</p>
                  </PreviewContent>
                </NotificationPreview>
                
                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={() => setShowEditTemplateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="success"
                    onClick={() => {
                      setShowEditTemplateModal(false);
                      handleUseTemplate({
                        id: currentTemplate.id,
                        ...templateFormData
                      });
                    }}
                  >
                    Save & Use
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Save Changes
                  </Button>
                </ButtonGroup>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </NotificationsContainer>
  );
};

export default Notifications;
