// /home/ubuntu/bridgetunes-admin-new/src/types/notification.types.ts

export interface NotificationType {
  id: string;
  name: string;
  description: string;
}

export interface NotificationChannel {
  id: string;
  name: string;
  description: string;
}

export interface NotificationStatus {
  id: string;
  name: string;
  description: string;
}

export interface Notification {
  id: string;
  msisdn: string; // Added missing property
  templateId?: string; // Added missing optional property
  title: string;
  message: string;
  type: string;
  channel: string;
  status: string;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  recipients: number; // Note: This seems redundant if msisdn is present, might need review
}

export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: string;
  channel: string;
  createdAt: string;
  updatedAt: string;
  status?: "ACTIVE" | "INACTIVE" | "DRAFT"; // Added optional status
}

export interface NotificationCreationParams {
  title: string;
  message: string;
  type: string;
  channel: string;
  scheduledFor?: string;
  segment?: string[];
  templateId?: string;
}

export interface NotificationTemplateCreationParams {
  name: string;
  title: string;
  message: string;
  type: string;
  channel: string;
}

export interface NotificationStats {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  channelBreakdown: { [key: string]: number };
  typeBreakdown: { [key: string]: number };
}

// Added Segment interface
export interface Segment {
  id: string;
  name: string;
  description?: string;
  userCount?: number; // Optional user count
  createdAt?: string;
  updatedAt?: string;
}



