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
  
  // Generate admin users with proper role types
  const users: User[] = [
    {
      id: 'user_1',
      username: 'admin',
      email: 'admin@bridgetunes.com',
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString(),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    } as User,
    {
      id: 'user_2',
      username: 'manager',
      email: 'manager@bridgetunes.com',
      role: 'manager',
      status: 'active',
      lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    } as User,
    {
      id: 'user_3',
      username: 'viewer',
      email: 'viewer@bridgetunes.com',
      role: 'viewer',
      status: 'active',
      lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    } as User
  ];
  
  // Generate draws (Simplified Draw type for demo generator)
  const demoDraws = [
    {
      id: 'draw_1',
      name: 'Weekly Draw - Week 1',
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'COMPLETED',
      participantCount: 85,
      winnerCount: 5,
      totalPrize: 50000,
      drawType: 'DAILY',
      eligibleDigits: [0, 1],
      useDefault: false,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'draw_2',
      name: 'Weekly Draw - Week 2',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'COMPLETED',
      participantCount: 92,
      winnerCount: 5,
      totalPrize: 50000,
      drawType: 'DAILY',
      eligibleDigits: [2, 3],
      useDefault: false,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'draw_3',
      name: 'Weekly Draw - Week 3',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'COMPLETED',
      participantCount: 103,
      winnerCount: 5,
      totalPrize: 50000,
      drawType: 'DAILY',
      eligibleDigits: [4, 5],
      useDefault: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'draw_4',
      name: 'Weekly Draw - Week 4',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'SCHEDULED',
      participantCount: 0,
      winnerCount: 0,
      totalPrize: 50000,
      drawType: 'DAILY',
      eligibleDigits: [6, 7],
      useDefault: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  // Cast demoDraws to the actual Draw type
  const draws: Draw[] = demoDraws.map(d => ({
    ...d,
    drawDate: d.date, // Map date to drawDate
  }));
  
  // Generate winners for completed draws
  const winners: Winner[] = [];
  const completedDraws = demoDraws.filter(draw => draw.status === 'COMPLETED');
  
  for (let i = 0; i < completedDraws.length; i++) {
    const draw = completedDraws[i];
    
    for (let j = 0; j < draw.winnerCount; j++) {
      // Pick a random subscriber
      const subscriber = subscribers[Math.floor(Math.random() * subscribers.length)];
      
      winners.push({
        id: `winner_${winners.length + 1}`,
        drawId: draw.id,
        msisdn: subscriber.msisdn,
        prizeAmount: draw.totalPrize / draw.winnerCount,
        // Add missing required fields
        prizeCategory: j === 0 ? 'JACKPOT' : 'CONSOLATION', // Example category
        isOptedIn: subscriber.optInStatus, // Use subscriber opt-in status
        isValid: Math.random() > 0.05, // 95% valid wins for demo
        winDate: draw.date, // Use draw date as win date
        // Optional fields from previous fixes
        status: Math.random() > 0.2 ? 'paid' : 'pending', // 80% paid, 20% pending
        paymentDate: Math.random() > 0.2 ? new Date(new Date(draw.date).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : null,
        paymentReference: Math.random() > 0.2 ? `PAY${Math.floor(1000000000 + Math.random() * 9000000000)}` : null,
        createdAt: draw.date,
        updatedAt: draw.date
      });
    }
  }
  
  // Generate notification templates (Simplified for demo)
  const notificationTemplates: NotificationTemplate[] = [
    {
      id: 'template_1',
      name: 'Welcome Message',
      title: 'Welcome to MyNumba Don Win!',
      message: 'Dear customer, welcome to MTN MyNumba Don Win promotion! Recharge your line to qualify for weekly draws and win amazing prizes. Reply STOP to opt out.',
      type: 'info', // Use type
      channel: 'sms', // Use channel
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE'
    },
    {
      id: 'template_2',
      name: 'Draw Reminder',
      title: 'Draw Reminder',
      message: 'Dear customer, the next MyNumba Don Win draw is tomorrow! Recharge your line now to qualify and stand a chance to win amazing prizes.',
      type: 'info', // Use type
      channel: 'sms', // Use channel
      createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE'
    },
    {
      id: 'template_3',
      name: 'Winner Announcement',
      title: 'Congratulations! You Won!',
      message: 'Congratulations! Your number {{msisdn}} has won ₦{{amount}} in the MyNumba Don Win promotion! Your prize will be credited to your account within 48 hours.',
      type: 'success', // Use type
      channel: 'sms', // Use channel
      createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE'
    }
  ];
  
  // Generate notifications (Simplified for demo)
  const notifications: Notification[] = [];
  
  // Welcome notifications for some subscribers
  for (let i = 0; i < 50; i++) {
    const subscriber = subscribers[Math.floor(Math.random() * subscribers.length)];
    
    notifications.push({
      id: `notification_${notifications.length + 1}`,
      title: notificationTemplates[0].title,
      message: notificationTemplates[0].message, // Use message from template
      type: notificationTemplates[0].type, // Use type from template
      channel: notificationTemplates[0].channel, // Use channel from template
      status: 'sent',
      createdAt: new Date(Date.now() - (90 - i) * 24 * 60 * 60 * 1000).toISOString(),
      scheduledFor: undefined,
      sentAt: new Date(Date.now() - (90 - i) * 24 * 60 * 60 * 1000).toISOString(),
      recipients: 1
    });
  }
  
  // Generate CSV upload history with proper status types
  const csvUploads: CSVUploadHistory[] = [
    {
      id: 'csv_1',
      filename: 'subscriber_data_week1.csv',
      uploadedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      recordCount: 500,
      totalAmount: 250000
    },
    {
      id: 'csv_2',
      filename: 'subscriber_data_week2.csv',
      uploadedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      recordCount: 750,
      totalAmount: 375000
    },
    {
      id: 'csv_3',
      filename: 'subscriber_data_week3.csv',
      uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      recordCount: 620,
      totalAmount: 310000
    },
    {
      id: 'csv_4',
      filename: 'subscriber_data_week4.csv',
      uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      recordCount: 580,
      totalAmount: 290000
    }
  ];
  
  // Generate dashboard stats
  const dashboardStats = {
    totalUsers: subscribers.length,
    activeUsers: subscribers.filter(s => s.optInStatus).length,
    totalTopups: topUps.length,
    totalRevenue: topUps.reduce((sum, topUp) => sum + topUp.amount, 0),
    totalDraws: draws.length,
    totalWinners: winners.length,
    totalPrizes: demoDraws.reduce((sum, draw) => sum + draw.totalPrize, 0) // Use demoDraws for totalPrize
  };
  
  // Generate subscriber growth data
  const subscriberGrowth: SubscriberGrowth[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
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
  const topUpDistribution: TopUpDistribution[] = [];
  const amounts = [100, 200, 500, 1000, 2000];
  const totalTopUps = topUps.length;
  
  for (let i = 0; i < amounts.length; i++) {
    const amount = amounts[i];
    const count = topUps.filter(t => t.amount === amount).length;
    const percentage = totalTopUps > 0 ? (count / totalTopUps) * 100 : 0;
    
    topUpDistribution.push({
      amount,
      count,
      percentage
    });
  }
  
  // Generate revenue trend data
  const revenueTrend: RevenueTrend[] = [];
  const revenueStartDate = new Date();
  revenueStartDate.setDate(revenueStartDate.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(revenueStartDate);
    date.setDate(date.getDate() + i);
    
    // Simulate revenue pattern
    const amount = Math.floor(10000 + Math.random() * 20000);
    
    revenueTrend.push({
      date: date.toISOString().split('T')[0],
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

export default generateDemoData;

