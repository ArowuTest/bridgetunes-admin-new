import { User } from '../types/auth.types';
import { Draw, Winner } from '../types/draw.types';
import { Notification, NotificationTemplate } from '../types/notification.types';
import { CSVUploadHistory } from '../types/csv.types';
import { DashboardStats, SubscriberGrowth, TopUpDistribution, RevenueTrend } from '../types/dashboard.types';

export interface DemoDataType {
  subscribers: Array<{
    id: string;
    msisdn: string;
    optInStatus: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  topUps: Array<{
    id: string;
    msisdn: string;
    amount: number;
    date: string;
    source: string;
    createdAt: string;
  }>;
  users: User[];
  draws: Draw[];
  winners: Winner[];
  notifications: Notification[];
  notificationTemplates: NotificationTemplate[];
  csvUploads: CSVUploadHistory[];
  dashboardStats: DashboardStats;
  subscriberGrowth: SubscriberGrowth[];
  topUpDistribution: TopUpDistribution[];
  revenueTrend: RevenueTrend[];
}

/**
 * Generate demo data for the application
 * This function creates a comprehensive set of demo data for all aspects of the application
 */
export const generateDemoData = (): DemoDataType => {
  // Generate 100 subscribers with random MSISDNs
  const subscribers = Array.from({ length: 100 }, (_, i) => {
    const msisdn = `080${Math.floor(10000000 + Math.random() * 90000000)}`;
    const createdAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(); // Random date in last 90 days
    
    return {
      id: `sub_${i + 1}`,
      msisdn,
      optInStatus: Math.random() > 0.1, // 90% opt-in rate
      createdAt,
      updatedAt: createdAt
    };
  });
  
  // Generate top-ups for subscribers
  const topUps = [];
  const topUpAmounts = [100, 200, 500, 1000, 2000];
  
  for (let i = 0; i < subscribers.length; i++) {
    // Each subscriber has 1-5 top-ups
    const topUpCount = Math.floor(1 + Math.random() * 5);
    
    for (let j = 0; j < topUpCount; j++) {
      const amount = topUpAmounts[Math.floor(Math.random() * topUpAmounts.length)];
      const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(); // Random date in last 30 days
      
      topUps.push({
        id: `topup_${topUps.length + 1}`,
        msisdn: subscribers[i].msisdn,
        amount,
        date,
        source: 'demo',
        createdAt: date
      });
    }
  }
  
  // Generate admin users
  const users = [
    {
      id: 'user_1',
      username: 'admin',
      email: 'admin@bridgetunes.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'user_2',
      username: 'manager',
      email: 'manager@bridgetunes.com',
      role: 'manager',
      status: 'active',
      lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'user_3',
      username: 'viewer',
      email: 'viewer@bridgetunes.com',
      role: 'viewer',
      status: 'active',
      lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Generate draws
  const draws = [
    {
      id: 'draw_1',
      name: 'Weekly Draw - Week 1',
      description: 'First weekly draw for MyNumba Don Win promotion',
      drawDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      totalParticipants: 85,
      totalWinners: 5,
      totalPrizeAmount: 50000,
      filters: {
        endingDigits: ['0', '1'],
        minTopUpAmount: 200,
        maxTopUpAmount: null,
        startDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
        optInStatus: true
      },
      createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'draw_2',
      name: 'Weekly Draw - Week 2',
      description: 'Second weekly draw for MyNumba Don Win promotion',
      drawDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      totalParticipants: 92,
      totalWinners: 5,
      totalPrizeAmount: 50000,
      filters: {
        endingDigits: ['2', '3'],
        minTopUpAmount: 200,
        maxTopUpAmount: null,
        startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        optInStatus: true
      },
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'draw_3',
      name: 'Weekly Draw - Week 3',
      description: 'Third weekly draw for MyNumba Don Win promotion',
      drawDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      totalParticipants: 103,
      totalWinners: 5,
      totalPrizeAmount: 50000,
      filters: {
        endingDigits: ['4', '5'],
        minTopUpAmount: 200,
        maxTopUpAmount: null,
        startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        optInStatus: true
      },
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'draw_4',
      name: 'Weekly Draw - Week 4',
      description: 'Fourth weekly draw for MyNumba Don Win promotion',
      drawDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'scheduled',
      totalParticipants: 0,
      totalWinners: 0,
      totalPrizeAmount: 50000,
      filters: {
        endingDigits: ['6', '7'],
        minTopUpAmount: 200,
        maxTopUpAmount: null,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        optInStatus: true
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  // Generate winners for completed draws
  const winners = [];
  const completedDraws = draws.filter(draw => draw.status === 'completed');
  
  for (let i = 0; i < completedDraws.length; i++) {
    const draw = completedDraws[i];
    
    for (let j = 0; j < draw.totalWinners; j++) {
      // Pick a random subscriber
      const subscriber = subscribers[Math.floor(Math.random() * subscribers.length)];
      
      winners.push({
        id: `winner_${winners.length + 1}`,
        drawId: draw.id,
        msisdn: subscriber.msisdn,
        prizeAmount: draw.totalPrizeAmount / draw.totalWinners,
        status: Math.random() > 0.2 ? 'paid' : 'pending', // 80% paid, 20% pending
        paymentDate: Math.random() > 0.2 ? new Date(new Date(draw.drawDate).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : null,
        paymentReference: Math.random() > 0.2 ? `PAY${Math.floor(1000000000 + Math.random() * 9000000000)}` : null,
        createdAt: draw.drawDate,
        updatedAt: draw.drawDate
      });
    }
  }
  
  // Generate notification templates
  const notificationTemplates = [
    {
      id: 'template_1',
      name: 'Welcome Message',
      title: 'Welcome to MyNumba Don Win!',
      message: 'Dear customer, welcome to MTN MyNumba Don Win promotion! Recharge your line to qualify for weekly draws and win amazing prizes. Reply STOP to opt out.',
      type: 'info',
      channel: 'sms',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'template_2',
      name: 'Draw Reminder',
      title: 'Draw Reminder',
      message: 'Dear customer, the next MyNumba Don Win draw is tomorrow! Recharge your line now to qualify and stand a chance to win amazing prizes.',
      type: 'info',
      channel: 'sms',
      createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'template_3',
      name: 'Winner Announcement',
      title: 'Congratulations! You Won!',
      message: 'Congratulations! Your number {{msisdn}} has won ₦{{amount}} in the MyNumba Don Win promotion! Your prize will be credited to your account within 48 hours.',
      type: 'success',
      channel: 'sms',
      createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'template_4',
      name: 'Recharge Confirmation',
      title: 'Recharge Confirmation',
      message: 'Dear customer, your recharge of ₦{{amount}} has been received. You are now eligible for the next MyNumba Don Win draw!',
      type: 'info',
      channel: 'sms',
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'template_5',
      name: 'Opt-Out Confirmation',
      title: 'Opt-Out Confirmation',
      message: 'You have successfully opted out of the MyNumba Don Win promotion. You will no longer receive messages or participate in draws. Text JOIN to opt back in.',
      type: 'info',
      channel: 'sms',
      createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'template_6',
      name: 'Draw Results',
      title: 'Draw Results',
      message: 'The results of the latest MyNumba Don Win draw are now available! Visit our website to see if you won. The next draw will be on {{nextDrawDate}}.',
      type: 'info',
      channel: 'sms',
      createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'template_7',
      name: 'Special Promotion',
      title: 'Special Promotion',
      message: 'Dear customer, recharge with ₦500 or more today and get DOUBLE chances to win in the next MyNumba Don Win draw! Offer valid for 24 hours only.',
      type: 'info',
      channel: 'sms',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'template_8',
      name: 'Payment Confirmation',
      title: 'Prize Payment Confirmation',
      message: 'Dear winner, your prize of ₦{{amount}} from the MyNumba Don Win promotion has been credited to your account. Thank you for participating!',
      type: 'success',
      channel: 'sms',
      createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  // Generate notifications
  const notifications = [];
  
  // Welcome notifications for some subscribers
  for (let i = 0; i < 50; i++) {
    const subscriber = subscribers[Math.floor(Math.random() * subscribers.length)];
    
    notifications.push({
      id: `notification_${notifications.length + 1}`,
      title: notificationTemplates[0].title,
      message: notificationTemplates[0].message,
      type: notificationTemplates[0].type,
      recipient: subscriber.msisdn,
      channel: notificationTemplates[0].channel,
      status: 'sent',
      createdAt: new Date(Date.now() - (90 - i) * 24 * 60 * 60 * 1000).toISOString(),
      sentAt: new Date(Date.now() - (90 - i) * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  // Draw reminder notifications
  for (let i = 0; i < draws.length; i++) {
    const draw = draws[i];
    const drawDate = new Date(draw.drawDate);
    const reminderDate = new Date(drawDate.getTime() - 24 * 60 * 60 * 1000);
    
    // Send to 30 random subscribers
    for (let j = 0; j < 30; j++) {
      const subscriber = subscribers[Math.floor(Math.random() * subscribers.length)];
      
      notifications.push({
        id: `notification_${notifications.length + 1}`,
        title: notificationTemplates[1].title,
        message: notificationTemplates[1].message,
        type: notificationTemplates[1].type,
        recipient: subscriber.msisdn,
        channel: notificationTemplates[1].channel,
        status: 'sent',
        createdAt: reminderDate.toISOString(),
        sentAt: reminderDate.toISOString()
      });
    }
  }
  
  // Winner notifications
  for (let i = 0; i < winners.length; i++) {
    const winner = winners[i];
    const draw = draws.find(d => d.id === winner.drawId);
    
    if (draw) {
      const winnerNotificationDate = new Date(draw.drawDate);
      
      notifications.push({
        id: `notification_${notifications.length + 1}`,
        title: notificationTemplates[2].title,
        message: notificationTemplates[2].message
          .replace('{{msisdn}}', winner.msisdn)
          .replace('{{amount}}', winner.prizeAmount.toString()),
        type: notificationTemplates[2].type,
        recipient: winner.msisdn,
        channel: notificationTemplates[2].channel,
        status: 'sent',
        createdAt: winnerNotificationDate.toISOString(),
        sentAt: winnerNotificationDate.toISOString()
      });
    }
  }
  
  // Generate CSV upload history
  const csvUploads = [
    {
      id: 'csv_1',
      fileName: 'subscriber_data_week1.csv',
      uploadedBy: 'admin@bridgetunes.com',
      uploadDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      totalRecords: 500,
      processedRecords: 495,
      failedRecords: 5,
      status: 'completed'
    },
    {
      id: 'csv_2',
      fileName: 'subscriber_data_week2.csv',
      uploadedBy: 'admin@bridgetunes.com',
      uploadDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      totalRecords: 750,
      processedRecords: 742,
      failedRecords: 8,
      status: 'completed'
    },
    {
      id: 'csv_3',
      fileName: 'subscriber_data_week3.csv',
      uploadedBy: 'manager@bridgetunes.com',
      uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      totalRecords: 620,
      processedRecords: 620,
      failedRecords: 0,
      status: 'completed'
    },
    {
      id: 'csv_4',
      fileName: 'subscriber_data_week4.csv',
      uploadedBy: 'admin@bridgetunes.com',
      uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalRecords: 580,
      processedRecords: 575,
      failedRecords: 5,
      status: 'completed'
    }
  ];
  
  // Generate dashboard stats
  const dashboardStats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.optInStatus).length,
    totalTopUps: topUps.length,
    totalTopUpAmount: topUps.reduce((sum, topUp) => sum + topUp.amount, 0),
    totalDraws: draws.length,
    totalWinners: winners.length,
    totalPrizeAmount: draws.reduce((sum, draw) => sum + draw.totalPrizeAmount, 0)
  };
  
  // Generate subscriber growth data
  const subscriberGrowth = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Simulate growth pattern
    const count = Math.floor(5 + Math.random() * 10);
    
    subscriberGrowth.push({
      date: date.toISOString().split('T')[0],
      count
    });
  }
  
  // Generate top-up distribution data
  const topUpDistribution = [
    { amount: 100, count: topUps.filter(t => t.amount === 100).length },
    { amount: 200, count: topUps.filter(t => t.amount === 200).length },
    { amount: 500, count: topUps.filter(t => t.amount === 500).length },
    { amount: 1000, count: topUps.filter(t => t.amount === 1000).length },
    { amount: 2000, count: topUps.filter(t => t.amount === 2000).length }
  ];
  
  // Generate revenue trend data
  const revenueTrend = [];
  const revenueStartDate = new Date();
  revenueStartDate.setDate(revenueStartDate.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(revenueStartDate);
    date.setDate(date.getDate() + i);
    
    // Calculate revenue for this date
    const dateStr = date.toISOString().split('T')[0];
    const dayTopUps = topUps.filter(t => t.date.split('T')[0] === dateStr);
    const amount = dayTopUps.reduce((sum, topUp) => sum + topUp.amount, 0);
    
    revenueTrend.push({
      date: dateStr,
      amount
    });
  }
  
  return {
    subscribers,
    topUps,
    users,
    draws,
    winners,
    notifications,
    notificationTemplates,
    csvUploads,
    dashboardStats,
    subscriberGrowth,
    topUpDistribution,
    revenueTrend
  };
};
