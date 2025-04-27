export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  recipient: string;
  channel: 'email' | 'sms' | 'in-app';
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
  sentAt?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  channel: 'email' | 'sms' | 'in-app';
}

export interface NotificationCreationParams {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  recipient: string;
  channel: 'email' | 'sms' | 'in-app';
}

export interface NotificationTemplateCreationParams {
  name: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  channel: 'email' | 'sms' | 'in-app';
}

export interface NotificationStats {
  totalNotifications: number;
  pendingNotifications: number;
  sentNotifications: number;
  failedNotifications: number;
  emailNotifications: number;
  smsNotifications: number;
  inAppNotifications: number;
}
