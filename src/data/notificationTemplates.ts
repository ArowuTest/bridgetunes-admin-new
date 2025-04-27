// Pre-created notification templates for different user segments
export const defaultNotificationTemplates = [
  // Customer Templates
  {
    id: 'template-1',
    name: 'Welcome New Customer',
    title: 'Welcome to Bridgetunes MTN MyNumba Don Win!',
    message: 'Hello {{name}}, welcome to the Bridgetunes MTN MyNumba Don Win promotion! Top up your MTN line to qualify for our weekly draws and win amazing prizes. Good luck!',
    type: 'info',
    channel: 'sms'
  },
  {
    id: 'template-2',
    name: 'Draw Winner Announcement',
    title: 'Congratulations! You Won in the MyNumba Don Win Draw',
    message: 'Congratulations {{name}}! Your number {{msisdn}} has been selected as a winner in our {{drawName}} draw. You have won ₦{{prizeAmount}}. Our team will contact you shortly with details on how to claim your prize.',
    type: 'success',
    channel: 'sms'
  },
  {
    id: 'template-3',
    name: 'Upcoming Draw Reminder',
    title: 'Reminder: MyNumba Don Win Draw Tomorrow',
    message: 'Dear {{name}}, don\'t forget that our {{drawName}} draw is happening tomorrow! Top up your MTN line today to qualify for a chance to win amazing prizes. Good luck!',
    type: 'info',
    channel: 'sms'
  },
  {
    id: 'template-4',
    name: 'Top-up Confirmation',
    title: 'Top-up Confirmed - You\'re in the Draw!',
    message: 'Dear {{name}}, your MTN top-up of ₦{{amount}} has been confirmed. You are now eligible for our next draw on {{drawDate}}. Good luck!',
    type: 'success',
    channel: 'sms'
  },
  {
    id: 'template-5',
    name: 'Prize Payment Confirmation',
    title: 'Prize Payment Confirmation',
    message: 'Dear {{name}}, we\'re pleased to inform you that your prize payment of ₦{{amount}} has been processed and will be credited to your account within 24 hours. Thank you for participating in MyNumba Don Win!',
    type: 'success',
    channel: 'sms'
  },
  
  // Agent Templates
  {
    id: 'template-6',
    name: 'Agent Commission Notification',
    title: 'Commission Earned: MyNumba Don Win',
    message: 'Dear {{agentName}}, you have earned a commission of ₦{{commissionAmount}} from customer top-ups for the MyNumba Don Win promotion. Your commission will be processed within 48 hours. Thank you for your partnership!',
    type: 'success',
    channel: 'email'
  },
  {
    id: 'template-7',
    name: 'Agent Performance Update',
    title: 'Weekly Performance Update',
    message: 'Dear {{agentName}}, here\'s your weekly performance update:\n\nTotal Top-ups: {{topUpCount}}\nTotal Value: ₦{{topUpValue}}\nCommission Earned: ₦{{commissionAmount}}\n\nKeep up the good work! Increase your earnings by encouraging more customers to participate in the MyNumba Don Win promotion.',
    type: 'info',
    channel: 'email'
  },
  {
    id: 'template-8',
    name: 'Agent Promotion Announcement',
    title: 'New Promotion: Increased Commission Rates',
    message: 'Dear {{agentName}}, we\'re excited to announce increased commission rates for the next two weeks! Earn up to 30% more on customer top-ups for the MyNumba Don Win promotion. This special offer is valid from {{startDate}} to {{endDate}}. Don\'t miss this opportunity to boost your earnings!',
    type: 'info',
    channel: 'email'
  },
  
  // Administrator Templates
  {
    id: 'template-9',
    name: 'Admin Draw Completion Report',
    title: 'Draw Completion Report: {{drawName}}',
    message: 'The {{drawName}} draw has been successfully completed.\n\nDraw Details:\nDate: {{drawDate}}\nTotal Participants: {{participantCount}}\nTotal Winners: {{winnerCount}}\nTotal Prize Amount: ₦{{totalPrizeAmount}}\n\nPlease review the attached report for complete details and winner information.',
    type: 'info',
    channel: 'email'
  },
  {
    id: 'template-10',
    name: 'Admin System Alert',
    title: 'ALERT: System Performance Issue Detected',
    message: 'A performance issue has been detected in the MyNumba Don Win system. The following component is affected: {{componentName}}. Current system load: {{systemLoad}}%. Please investigate immediately to prevent service disruption.',
    type: 'error',
    channel: 'email'
  },
  {
    id: 'template-11',
    name: 'Admin New User Registration',
    title: 'New Admin User Registration',
    message: 'A new administrator account has been created:\n\nUsername: {{username}}\nEmail: {{email}}\nRole: {{role}}\nCreated by: {{createdBy}}\n\nIf you did not authorize this action, please contact the system administrator immediately.',
    type: 'warning',
    channel: 'email'
  },
  
  // Manager Templates
  {
    id: 'template-12',
    name: 'Manager Weekly Report',
    title: 'Weekly Performance Report: MyNumba Don Win',
    message: 'Dear {{managerName}},\n\nHere is the weekly performance report for the MyNumba Don Win promotion:\n\nPeriod: {{startDate}} to {{endDate}}\nTotal Top-ups: {{topUpCount}}\nTotal Revenue: ₦{{totalRevenue}}\nTotal Participants: {{participantCount}}\nNew Participants: {{newParticipantCount}}\nTotal Prizes Awarded: ₦{{totalPrizeAmount}}\n\nPlease find the detailed report attached.',
    type: 'info',
    channel: 'email'
  },
  {
    id: 'template-13',
    name: 'Manager Campaign Performance Alert',
    title: 'Campaign Performance Alert: Action Required',
    message: 'Dear {{managerName}},\n\nThe current MyNumba Don Win campaign is performing below target metrics:\n\nCurrent Participation Rate: {{participationRate}}%\nTarget Participation Rate: {{targetRate}}%\nVariance: {{variance}}%\n\nRecommended actions:\n1. Increase promotional messaging\n2. Review agent incentives\n3. Consider additional prize categories\n\nPlease review the attached detailed analysis and implement necessary adjustments.',
    type: 'warning',
    channel: 'email'
  },
  
  // Multi-channel Templates
  {
    id: 'template-14',
    name: 'Live Draw Announcement',
    title: 'LIVE NOW: MyNumba Don Win Draw',
    message: 'The {{drawName}} draw is happening LIVE right now! Tune in to watch on our website or Facebook page to see if you\'re a winner. Good luck!',
    type: 'info',
    channel: 'in-app'
  },
  {
    id: 'template-15',
    name: 'Maintenance Notification',
    title: 'Scheduled Maintenance Notice',
    message: 'Dear user, our system will be undergoing scheduled maintenance on {{maintenanceDate}} from {{startTime}} to {{endTime}}. During this period, some services may be temporarily unavailable. We apologize for any inconvenience and thank you for your understanding.',
    type: 'warning',
    channel: 'in-app'
  }
];
