import axios from 'axios';
import { 
  Notification, 
  NotificationTemplate,
  NotificationCreationParams,
  NotificationTemplateCreationParams,
  NotificationStats
} from '../types/notification.types'; // Assuming shared types

// --- Enhanced Types based on Requirements (Define properly in notification.types.ts) ---

// Based on Section 5.1.2 Campaign Types
type CampaignType = 'ONE_TIME' | 'RECURRING' | 'TRIGGERED' | 'MULTI_STEP' | 'AB_TEST';

// Based on Section 5.1.4 Campaign Management & Execution
type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'EXECUTING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELED';

interface Campaign {
  id: string; // Typically ObjectId from MongoDB
  name: string;
  description?: string;
  type: CampaignType;
  status: CampaignStatus;
  templateId: string; // ID of the associated NotificationTemplate
  segmentId?: string; // ID of the target Segment (optional for some types?)
  schedule?: {
    type: 'IMMEDIATE' | 'SCHEDULED' | 'RECURRING';
    scheduledTime?: string; // ISO 8601 format for SCHEDULED/RECURRING
    cronExpression?: string; // For RECURRING
    timeZone?: string; // e.g., 'Africa/Lagos'
  };
  priority?: number; // Based on 5.1.1
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  executedAt?: string; // ISO 8601 format (for completed/last execution)
  // Add other fields as needed, e.g., createdBy, updatedBy, performance metrics
}

// Based on Section 3.1 User Segments Module
interface Segment {
  id: string;
  name: string;
  description?: string;
  criteria: any; // Define criteria structure based on requirements (e.g., { field: 'optInStatus', operator: 'eq', value: 'Yes' })
  userCount?: number; // Estimated or actual count
  createdAt: string;
  updatedAt: string;
}
// --------------------------------------------------------------------------

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1'; // Adjusted default to match backend structure

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Enhanced Mock Data for Fallback (Based on Requirements) ---
const mockCampaigns: Campaign[] = [
  {
    id: 'camp-mock-001',
    name: 'Welcome Campaign (Mock)',
    description: 'Sends a welcome message to new users upon opt-in.',
    type: 'TRIGGERED',
    status: 'EXECUTING', // Assuming it's always active
    templateId: 'tpl-mock-welcome', // Needs a corresponding mock template
    segmentId: 'seg-mock-new-users', // Needs a corresponding mock segment
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp-mock-002',
    name: 'Weekly Promo Blast (Mock)',
    description: 'Highlights the weekly promotion to opted-in users.',
    type: 'RECURRING',
    status: 'SCHEDULED',
    templateId: 'tpl-mock-promo', // Needs a corresponding mock template
    segmentId: 'seg-mock-opted-in', // Needs a corresponding mock segment
    schedule: {
      type: 'RECURRING',
      cronExpression: '0 10 * * 1', // Every Monday at 10:00 AM
      timeZone: 'Africa/Lagos',
    },
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'camp-mock-003',
    name: 'Draw Winner Notification - Apr 27 (Mock)',
    description: 'Notifies winners of the draw held on April 27th.',
    type: 'ONE_TIME',
    status: 'COMPLETED',
    templateId: 'tpl-mock-winner', // Needs a corresponding mock template
    // segmentId: Might be dynamically generated or specific list upload
    schedule: {
      type: 'IMMEDIATE', // Or SCHEDULED for a specific time post-draw
    },
    createdAt: new Date('2025-04-27T14:00:00Z').toISOString(),
    updatedAt: new Date('2025-04-27T14:05:00Z').toISOString(),
    executedAt: new Date('2025-04-27T14:05:00Z').toISOString(),
  },
   {
    id: 'camp-mock-004',
    name: 'A/B Test: Topup Reminder Subject (Mock)',
    description: 'Testing two different subject lines for topup reminders.',
    type: 'AB_TEST',
    status: 'EXECUTING',
    templateId: 'tpl-mock-reminder-a', // Variant A
    // templateIdB: 'tpl-mock-reminder-b', // Needs handling in component/service
    segmentId: 'seg-mock-lapsed-topup', // Needs a corresponding mock segment
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
   {
    id: 'camp-mock-005',
    name: 'Draft: Birthday Offer (Mock)',
    description: 'Planned campaign for user birthdays.',
    type: 'TRIGGERED',
    status: 'DRAFT',
    templateId: 'tpl-mock-birthday', // Needs a corresponding mock template
    segmentId: 'seg-mock-birthday-today', // Needs a corresponding mock segment
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Segments (Enhance as needed)
const mockSegments: Segment[] = [
  {
    id: 'seg-mock-new-users',
    name: 'New Users (Last 7 Days) (Mock)',
    description: 'Users registered in the last 7 days.',
    criteria: { registrationDate: 'last_7_days' },
    userCount: 150, // Example count
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'seg-mock-opted-in',
    name: 'Opted-In Users (Mock)',
    description: 'All users currently opted into promotions.',
    criteria: { optInStatus: 'Yes' },
    userCount: 12500,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'seg-mock-lapsed-topup',
    name: 'Lapsed Topup (30+ Days) (Mock)',
    description: 'Users who haven\'t topped up in over 30 days.',
    criteria: { lastTopupDate: 'older_than_30_days' },
    userCount: 850,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
// -------------------------------

export const notificationService = {
  // ... (getAllNotifications, getNotificationById, etc. remain unchanged) ...
  getAllNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await api.get<Notification[]>("/notifications");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch notifications"
        );
      }
      throw new Error("Network error occurred while fetching notifications");
    }
  },

  getNotificationById: async (id: string): Promise<Notification> => {
    try {
      const response = await api.get<Notification>(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notification ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to fetch notification"
        );
      }
      throw new Error("Network error occurred while fetching notification");
    }
  },

  createNotification: async (
    notificationData: NotificationCreationParams
  ): Promise<Notification> => {
    try {
      const response = await api.post<Notification>(
        "/notifications",
        notificationData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to create notification"
        );
      }
      throw new Error("Network error occurred while creating notification");
    }
  },

  deleteNotification: async (id: string): Promise<void> => {
    try {
      await api.delete(`/notifications/${id}`);
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to delete notification"
        );
      }
      throw new Error("Network error occurred while deleting notification");
    }
  },

  resendNotification: async (id: string): Promise<Notification> => {
    try {
      const response = await api.post<Notification>(`/notifications/${id}/resend`);
      return response.data;
    } catch (error) {
      console.error(`Error resending notification ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to resend notification"
        );
      }
      throw new Error("Network error occurred while resending notification");
    }
  },

  // --- Updated Methods with Enhanced Mock Data ---

  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      console.log('Attempting to fetch campaigns from API...');
      const response = await api.get<Campaign[]>('/notifications/campaigns');
      console.log('Successfully fetched campaigns from API:', response.data);
      // Ensure response.data is an array, default to empty array if not
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.warn('Failed to fetch campaigns from API, returning ENHANCED mock data.', error);
      // Fallback to ENHANCED mock data if API call fails
      return mockCampaigns;
    }
  },

  getSegments: async (): Promise<Segment[]> => {
    // NOTE: Backend endpoint for segments does not exist yet.
    // Returning mock data for prototype purposes.
    console.warn('Backend endpoint for segments not implemented. Returning mock data.');
    // In a real scenario, you would attempt an API call here first.
    // try {
    //   const response = await api.get<Segment[]>('/notifications/segments');
    //   return Array.isArray(response.data) ? response.data : [];
    // } catch (error) {
    //   console.warn('Failed to fetch segments from API, returning mock data.', error);
    //   return mockSegments;
    // }
    return mockSegments; 
  },

  // -----------------------------------------------

  getAllTemplates: async (): Promise<NotificationTemplate[]> => {
    try {
      const response = await api.get<NotificationTemplate[]>('/notifications/templates');
      // Ensure response.data is an array, default to empty array if not
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Error fetching templates:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch notification templates');
      }
      throw new Error('Network error occurred while fetching templates');
    }
  },

  getTemplateById: async (id: string): Promise<NotificationTemplate> => {
    try {
      const response = await api.get<NotificationTemplate>(`/notifications/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching template ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch notification template');
      }
      throw new Error('Network error occurred while fetching template');
    }
  },

  createTemplate: async (templateData: NotificationTemplateCreationParams): Promise<NotificationTemplate> => {
    try {
      const response = await api.post<NotificationTemplate>('/notifications/templates', templateData);
      return response.data;
    } catch (error) {
      console.error("Error creating template:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to create notification template');
      }
      throw new Error('Network error occurred while creating template');
    }
  },

  updateTemplate: async (id: string, templateData: NotificationTemplateCreationParams): Promise<NotificationTemplate> => {
    try {
      const response = await api.put<NotificationTemplate>(`/notifications/templates/${id}`, templateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating template ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to update notification template');
      }
      throw new Error('Network error occurred while updating template');
    }
  },

  deleteTemplate: async (id: string): Promise<void> => {
    try {
      await api.delete(`/notifications/templates/${id}`);
    } catch (error) {
      console.error(`Error deleting template ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to delete notification template');
      }
      throw new Error('Network error occurred while deleting template');
    }
  },

  getNotificationStats: async (): Promise<NotificationStats> => {
    try {
      const response = await api.get<NotificationStats>('/notifications/stats');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch notification stats', error);
      if (axios.isAxiosError(error) && error.response) {
        // Optionally re-throw specific API errors if needed
      }
      // Return default/empty stats object on failure - with all required properties
      // to match the expected NotificationStats type
      return { 
        totalSent: 0, 
        totalDelivered: 0, 
        totalFailed: 0,
        deliveryRate: 0,
        channelBreakdown: {},
        typeBreakdown: {}
      };
    }
  },

  // --- New Creation Methods for Modal Forms ---

  createCampaign: async (campaignData: Partial<Campaign>): Promise<Campaign> => {
    try {
      // Attempt to call the API first
      const response = await api.post<Campaign>('/notifications/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.warn('Failed to create campaign via API, using mock implementation.', error);
      
      // Mock implementation for prototype
      // Generate a new ID and timestamps
      const now = new Date().toISOString();
      const newCampaign: Campaign = {
        id: `camp-${Math.random().toString(36).substring(2, 10)}`,
        name: campaignData.name || 'Unnamed Campaign',
        description: campaignData.description || '',
        type: campaignData.type || 'ONE_TIME',
        status: 'DRAFT', // New campaigns start as drafts
        templateId: campaignData.templateId || '',
        segmentId: campaignData.segmentId,
        schedule: campaignData.schedule,
        createdAt: now,
        updatedAt: now,
      };
      
      // In a real implementation, you would save this to a local store or IndexedDB
      // For the prototype, we'll just return it and let the component add it to state
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newCampaign;
    }
  },
  
  createSegment: async (segmentData: Partial<Segment>): Promise<Segment> => {
    try {
      // Attempt to call the API first
      const response = await api.post<Segment>('/notifications/segments', segmentData);
      return response.data;
    } catch (error) {
      console.warn('Failed to create segment via API, using mock implementation.', error);
      
      // Mock implementation for prototype
      // Generate a new ID and timestamps
      const now = new Date().toISOString();
      const newSegment: Segment = {
        id: `seg-${Math.random().toString(36).substring(2, 10)}`,
        name: segmentData.name || 'Unnamed Segment',
        description: segmentData.description || '',
        criteria: segmentData.criteria || {},
        userCount: Math.floor(Math.random() * 1000) + 100, // Random count for mock
        createdAt: now,
        updatedAt: now,
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newSegment;
    }
  },
  
  createNotificationTemplate: async (templateData: any): Promise<NotificationTemplate> => {
    try {
      // Attempt to call the API first
      const response = await api.post<NotificationTemplate>('/notifications/templates', templateData);
      return response.data;
    } catch (error) {
      console.warn('Failed to create template via API, using mock implementation.', error);
      
      // Mock implementation for prototype
      // Generate a new ID and timestamps
      const now = new Date().toISOString();
      const newTemplate: any = {
        id: `tpl-${Math.random().toString(36).substring(2, 10)}`,
        name: templateData.name || 'Unnamed Template',
        type: templateData.type || 'SMS',
        title: templateData.title || '',
        message: templateData.message || '',
        channel: templateData.channel || 'SMS',
        createdAt: now,
        updatedAt: now,
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newTemplate;
    }
  }
};

export default notificationService;
