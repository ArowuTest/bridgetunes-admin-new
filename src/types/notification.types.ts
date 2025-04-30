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
  title: string;
  message: string;
  type: string;
  channel: string;
  status: string;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  recipients: number;
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
  channelBreakdown: {
    [key: string]: number;
  };
  typeBreakdown: {
    [key: string]: number;
  };
}
