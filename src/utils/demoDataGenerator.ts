// /home/ubuntu/bridgetunes-admin-new/src/utils/demoDataGenerator.ts
import { User } from "../types/auth.types";
import { Draw, Winner } from "../types/draw.types";
import { Notification, NotificationTemplate } from "../types/notification.types";
import { CSVUploadHistory } from "../types/csv.types";
import {
  DashboardStats,
  SubscriberGrowth,
  TopUpDistribution,
  RevenueTrend,
} from "../types/dashboard.types";

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
    const createdAt = new Date(
      Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
    ).toISOString(); // Random date in last 90 days
    return {
      id: `sub_${i + 1}`,
      msisdn,
      optInStatus: Math.random() > 0.1, // 90% opt-in rate
      createdAt,
      updatedAt: createdAt,
    };
  });

  // Generate top-ups for subscribers
  const topUps = [];
  const topUpAmounts = [100, 200, 500, 1000, 2000];
  for (let i = 0; i < subscribers.length; i++) {
    // Each subscriber has 1-5 top-ups
    const topUpCount = Math.floor(1 + Math.random() * 5);
    for (let j = 0; j < topUpCount; j++) {
      const amount =
        topUpAmounts[Math.floor(Math.random() * topUpAmounts.length)];
      const date = new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(); // Random date in last 30 days
      topUps.push({
        id: `topup_${topUps.length + 1}`,
        msisdn: subscribers[i].msisdn,
        amount,
        date,
        source: "demo",
        createdAt: date,
      });
    }
  }

  // Generate admin users with proper role types and the required name property
  const users: User[] = [
    {
      id: "user_1",
      username: "admin",
      email: "admin@bridgetunes.com",
      role: "admin",
      name: "Demo Admin", // Added name
      // status: "active", // Status is not part of the central User type
      // lastLogin: new Date().toISOString(), // lastLogin is not part of the central User type
      createdAt: new Date(
        Date.now() - 90 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "user_2",
      username: "manager",
      email: "manager@bridgetunes.com",
      role: "manager",
      name: "Demo Manager", // Added name
      // status: "active",
      // lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(
        Date.now() - 60 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "user_3",
      username: "viewer",
      email: "viewer@bridgetunes.com",
      role: "viewer",
      name: "Demo Viewer", // Added name
      // status: "active",
      // lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Generate draws (Simplified Draw type for demo generator)
  const demoDraws = [
    {
      id: "draw_1",
      name: "Weekly Draw - Week 1",
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      status: "COMPLETED",
      participantCount: 85,
      winnerCount: 5,
      totalPrize: 50000,
      drawType: "DAILY",
      eligibleDigits: [0, 1],
      useDefault: false,
      createdAt: new Date(
        Date.now() - 21 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 21 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "draw_2",
      name: "Weekly Draw - Week 2",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: "COMPLETED",
      participantCount: 92,
      winnerCount: 5,
      totalPrize: 50000,
      drawType: "DAILY",
      eligibleDigits: [2, 3],
      useDefault: false,
      createdAt: new Date(
        Date.now() - 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "draw_3",
      name: "Weekly Draw - Week 3",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "COMPLETED",
      participantCount: 103,
      winnerCount: 5,
      totalPrize: 50000,
      drawType: "DAILY",
      eligibleDigits: [4, 5],
      useDefault: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "draw_4",
      name: "Weekly Draw - Week 4",
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: "SCHEDULED",
      participantCount: 0,
      winnerCount: 0,
      totalPrize: 50000,
      drawType: "DAILY",
      eligibleDigits: [6, 7],
      useDefault: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Cast demoDraws to the actual Draw type
  const draws: Draw[] = demoDraws.map((d) => ({
    ...d,
    drawDate: d.date, // Map date to drawDate
  }));

  // Generate winners for completed draws
  const winners: Winner[] = [];
  const completedDraws = demoDraws.filter((draw) => draw.status === "COMPLETED");
  for (let i = 0; i < completedDraws.length; i++) {
    const draw = completedDraws[i];
    for (let j = 0; j < draw.winnerCount; j++) {
      // Pick a random subscriber
      const subscriber =
        subscribers[Math.floor(Math.random() * subscribers.length)];
      winners.push({
        id: `winner_${winners.length + 1}`,
        drawId: draw.id,
        msisdn: subscriber.msisdn,
        prizeAmount: draw.totalPrize / draw.winnerCount,
        // Add missing required fields
        prizeCategory: j === 0 ? "JACKPOT" : "CONSOLATION", // Example category
        isOptedIn: subscriber.optInStatus, // Use subscriber opt-in status
        isValid: Math.random() > 0.05, // 95% valid wins for demo
        winDate: draw.date, // Use draw date as win date
        // Optional fields from previous fixes
        status: Math.random() > 0.2 ? "paid" : "pending", // 80% paid, 20% pending
        paymentDate:
          Math.random() > 0.2
            ? new Date(
                new Date(draw.date).getTime() + 2 * 24 * 60 * 60 * 1000
              ).toISOString()
            : null,
        paymentReference:
          Math.random() > 0.2
            ? `PAY${Math.floor(1000000000 + Math.random() * 9000000000)}`
            : null,
        createdAt: draw.date,
        updatedAt: draw.date,
      });
    }
  }

  // Generate notification templates (Simplified for demo)
  const notificationTemplates: NotificationTemplate[] = [
    {
      id: "template_1",
      name: "Welcome Message",
      title: "Welcome to MyNumba Don Win!",
      message:
        "Dear customer, welcome to MTN MyNumba Don Win promotion! Recharge your line to qualify for weekly draws and win amazing prizes. Reply STOP to opt out.",
      type: "info", // Use type
      channel: "sms", // Use channel
      createdAt: new Date(
        Date.now() - 90 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 90 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "ACTIVE",
    },
    {
      id: "template_2",
      name: "Draw Reminder",
      title: "Draw Reminder",
      message:
        "Dear customer, the next MyNumba Don Win draw is tomorrow! Recharge your line now to qualify and stand a chance to win amazing prizes.",
      type: "info", // Use type
      channel: "sms", // Use channel
      createdAt: new Date(
        Date.now() - 85 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 85 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "ACTIVE",
    },
    {
      id: "template_3",
      name: "Winner Announcement",
      title: "Congratulations! You Won!",
      message:
        "Congratulations! Your number {{msisdn}} has won ₦{{amount}} in the MyNumba Don Win promotion! Your prize will be credited to your account within 48 hours.",
      type: "success", // Use type
      channel: "sms", // Use channel
      createdAt: new Date(
        Date.now() - 80 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 80 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "ACTIVE",
    },
  ];

  // Generate notifications (Simplified for demo)
  const notifications: Notification[] = [];
  // Welcome notifications for some subscribers
  for (let i = 0; i < 50; i++) {
    const subscriber = subscribers[i];
    notifications.push({
      id: `notif_${notifications.length + 1}`,
      msisdn: subscriber.msisdn,
      templateId: "template_1",
      status: "sent",
      sentAt: new Date(
        new Date(subscriber.createdAt).getTime() + 1 * 60 * 60 * 1000
      ).toISOString(), // Sent 1 hour after creation
      createdAt: new Date(
        new Date(subscriber.createdAt).getTime() + 1 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        new Date(subscriber.createdAt).getTime() + 1 * 60 * 60 * 1000
      ).toISOString(),
      message: notificationTemplates[0].message, // Add message
      title: notificationTemplates[0].title, // Add title
      type: notificationTemplates[0].type, // Add type
      channel: notificationTemplates[0].channel, // Add channel
    });
  }
  // Winner notifications
  for (let i = 0; i < winners.length; i++) {
    const winner = winners[i];
    notifications.push({
      id: `notif_${notifications.length + 1}`,
      msisdn: winner.msisdn,
      templateId: "template_3",
      status: "sent",
      sentAt: new Date(
        new Date(winner.winDate).getTime() + 1 * 60 * 60 * 1000
      ).toISOString(), // Sent 1 hour after win
      createdAt: new Date(
        new Date(winner.winDate).getTime() + 1 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        new Date(winner.winDate).getTime() + 1 * 60 * 60 * 1000
      ).toISOString(),
      message: notificationTemplates[2].message
        .replace("{{msisdn}}", winner.msisdn)
        .replace("{{amount}}", winner.prizeAmount.toString()), // Add message
      title: notificationTemplates[2].title, // Add title
      type: notificationTemplates[2].type, // Add type
      channel: notificationTemplates[2].channel, // Add channel
    });
  }

  // Generate CSV Upload History
  const csvUploads: CSVUploadHistory[] = [
    {
      id: "csv_1",
      fileName: "subscribers_may_week1.csv",
      uploadDate: new Date(
        Date.now() - 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "processed",
      recordCount: 50,
      processedCount: 50,
      errorCount: 0,
      uploadedBy: "admin",
    },
    {
      id: "csv_2",
      fileName: "subscribers_may_week2.csv",
      uploadDate: new Date(
        Date.now() - 18 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "processed",
      recordCount: 45,
      processedCount: 43,
      errorCount: 2,
      uploadedBy: "admin",
    },
    {
      id: "csv_3",
      fileName: "subscribers_may_week3.csv",
      uploadDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      status: "failed",
      recordCount: 60,
      processedCount: 0,
      errorCount: 60,
      uploadedBy: "manager",
    },
    {
      id: "csv_4",
      fileName: "subscribers_may_week4.csv",
      uploadDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: "processing",
      recordCount: 70,
      processedCount: 15,
      errorCount: 0,
      uploadedBy: "admin",
    },
  ];

  // Generate Dashboard Stats
  const dashboardStats: DashboardStats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter((s) => s.optInStatus).length,
    totalTopUps: topUps.length,
    totalTopUpValue: topUps.reduce((sum, t) => sum + t.amount, 0),
    totalWinners: winners.length,
    totalPrizeAwarded: winners.reduce((sum, w) => sum + w.prizeAmount, 0),
    pendingPayouts: winners.filter((w) => w.status === "pending").length,
    pendingPayoutValue: winners
      .filter((w) => w.status === "pending")
      .reduce((sum, w) => sum + w.prizeAmount, 0),
  };

  // Generate Subscriber Growth Data (last 30 days)
  const subscriberGrowth: SubscriberGrowth[] = [];
  let currentSubs = subscribers.length - Math.floor(Math.random() * 20);
  for (let i = 30; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    currentSubs += Math.floor(Math.random() * 5) - 1; // Random growth/decline
    if (currentSubs < 0) currentSubs = 0;
    subscriberGrowth.push({ date, count: currentSubs });
  }

  // Generate Top-Up Distribution Data
  const topUpDistribution: TopUpDistribution[] = [
    { range: "₦100-₦199", count: topUps.filter((t) => t.amount < 200).length },
    { range: "₦200-₦499", count: topUps.filter((t) => t.amount >= 200 && t.amount < 500).length },
    { range: "₦500-₦999", count: topUps.filter((t) => t.amount >= 500 && t.amount < 1000).length },
    { range: "₦1000+", count: topUps.filter((t) => t.amount >= 1000).length },
  ];

  // Generate Revenue Trend Data (last 30 days)
  const revenueTrend: RevenueTrend[] = [];
  let dailyRevenue = 0;
  for (let i = 30; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    dailyRevenue = topUps
      .filter((t) => t.date.startsWith(date))
      .reduce((sum, t) => sum + t.amount, 0);
    revenueTrend.push({ date, revenue: dailyRevenue });
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
    revenueTrend,
  };
};


