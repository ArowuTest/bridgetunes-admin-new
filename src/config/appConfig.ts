/**
 * Application configuration
 * 
 * This file contains configuration settings for the Bridgetunes MTN Admin Portal.
 * It includes settings for API endpoints, demo mode, and other application-wide settings.
 */

// Environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Demo mode configuration
export const demoModeConfig = {
  // Whether demo mode is enabled
  // In production, this should be set to false
  enabled: true,
  
  // Whether to persist demo data in localStorage
  persistData: true,
  
  // localStorage keys for demo data
  storageKeys: {
    demoMode: 'bridgetunes_demo_mode',
    subscribers: 'bridgetunes_demo_subscribers',
    topUps: 'bridgetunes_demo_topups',
    draws: 'bridgetunes_demo_draws',
    winners: 'bridgetunes_demo_winners',
    users: 'bridgetunes_demo_users',
    notifications: 'bridgetunes_demo_notifications',
    notificationTemplates: 'bridgetunes_demo_notification_templates',
    csvUploads: 'bridgetunes_demo_csv_uploads'
  }
};

// API endpoints
export const apiEndpoints = {
  // Auth endpoints
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    forgotPassword: `${API_URL}/auth/forgot-password`,
    resetPassword: `${API_URL}/auth/reset-password`,
    changePassword: `${API_URL}/auth/change-password`,
    verifyEmail: `${API_URL}/auth/verify-email`
  },
  
  // User endpoints
  users: {
    base: `${API_URL}/users`,
    stats: `${API_URL}/users/stats`,
    activity: (userId: string) => `${API_URL}/users/${userId}/activity`
  },
  
  // Dashboard endpoints
  dashboard: {
    stats: `${API_URL}/dashboard/stats`,
    subscriberGrowth: `${API_URL}/dashboard/subscriber-growth`,
    topUpDistribution: `${API_URL}/dashboard/topup-distribution`,
    recentDraws: `${API_URL}/dashboard/recent-draws`,
    revenueTrend: `${API_URL}/dashboard/revenue-trend`
  },
  
  // Draw endpoints
  draws: {
    base: `${API_URL}/draws`,
    run: (drawId: string) => `${API_URL}/draws/${drawId}/run`,
    winners: (drawId: string) => `${API_URL}/draws/${drawId}/winners`,
    updateWinner: (drawId: string, winnerId: string) => 
      `${API_URL}/draws/${drawId}/winners/${winnerId}`
  },
  
  // Notification endpoints
  notifications: {
    base: `${API_URL}/notifications`,
    resend: (notificationId: string) => `${API_URL}/notifications/${notificationId}/resend`,
    templates: `${API_URL}/notifications/templates`,
    stats: `${API_URL}/notifications/stats`
  },
  
  // CSV endpoints
  csv: {
    upload: `${API_URL}/csv/upload`,
    validate: `${API_URL}/csv/validate`,
    history: `${API_URL}/csv/history`,
    summary: (uploadId: string) => `${API_URL}/csv/summary/${uploadId}`,
    stats: `${API_URL}/csv/stats`,
    template: `${API_URL}/csv/template`
  }
};

// Application settings
export const appSettings = {
  // Application name
  appName: 'Bridgetunes MTN Admin Portal',
  
  // Application version
  appVersion: '1.0.0',
  
  // JWT token storage key
  tokenKey: 'bridgetunes_token',
  
  // User storage key
  userKey: 'bridgetunes_user',
  
  // Token expiration time in milliseconds (24 hours)
  tokenExpiration: 24 * 60 * 60 * 1000,
  
  // Pagination settings
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100]
  },
  
  // Date format
  dateFormat: 'DD/MM/YYYY',
  
  // Time format
  timeFormat: 'HH:mm:ss',
  
  // Date-time format
  dateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
  
  // Currency format
  currency: {
    code: 'NGN',
    symbol: '₦',
    precision: 2
  }
};

// MTN brand colors
export const brandColors = {
  primary: '#FFD100', // MTN Yellow
  secondary: '#004F9F', // MTN Blue
  tertiary: '#FFFFFF', // White
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  gray: '#6c757d'
};

export default {
  demoModeConfig,
  apiEndpoints,
  appSettings,
  brandColors
};
