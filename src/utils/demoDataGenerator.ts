// /home/ubuntu/bridgetunes-admin-new/src/utils/demoDataGenerator.ts
import { User } from "../types/auth.types";
import { Draw, Winner } from "../types/draw.types";
import { Notification, NotificationTemplate, Segment } from "../types/notification.types"; // Added Segment
import { CSVUploadHistory } from "../types/csv.types";
import {
  DashboardStats,
  SubscriberGrowth,
  TopUpDistribution,
  RevenueTrend,
} from "../types/dashboard.types";

// Define a simplified Subscriber type for internal use in this generator
interface DemoSubscriber {
  id: string;
  msisdn: string;
  optInStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define a simplified TopUp type for internal use
interface DemoTopUp {
  id: string;
  msisdn: string;
  amount: number;
  date: string;
  source: string;
  createdAt: string;
}

export interface DemoDataType {
  subscribers: DemoSubscriber[];
  topUps: DemoTopUp[];
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
  segments: Segment[]; // Added Segments
}

/**
 * Generate demo data for the application
 * This function creates a comprehensive set of demo data for all aspects of the application
 */
export const generateDemoData = (): DemoDataType => {
  // Generate 100 subscribers with random MSISDNs
  const subscribers: DemoSubscriber[] = Array.from({ length: 100 }, (_, i) => {
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
  const topUps: DemoTopUp[] = [];
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

  // Generate admin users conforming to the consolidated User type
  const users: User[] = [
    {
      id: "user_1",
      username: "admin",
      email: "admin@bridgetunes.com",
      role: "admin",
      name: "Demo Admin",
      status: "active",
      lastLogin: new Date().toISOString(),
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
      name: "Demo Manager",
      status: "active",
      lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
      name: "Demo Viewer",
      status: "inactive", // Example of different status
      lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Generate draws conforming to the Draw type
  const draws: Draw[] = [
    {
      id: "draw_1",
      drawDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      drawType: "DAILY",
      eligibleDigits: [0, 1],
      useDefault: false,
      status: "COMPLETED",
      totalParticipants: 85, // Example optional field
      createdAt: new Date(
        Date.now() - 21 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 21 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "draw_2",
      drawDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      drawType: "DAILY",
      eligibleDigits: [2, 3],
      useDefault: false,
      status: "COMPLETED",
      totalParticipants: 92,
      createdAt: new Date(
        Date.now() - 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "draw_3",
      drawDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      drawType: "DAILY",
      eligibleDigits: [4, 5],
      useDefault: false,
      status: "COMPLETED",
      totalParticipants: 103,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "draw_4",
      drawDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      drawType: "DAILY",
      eligibleDigits: [6, 7],
      useDefault: false,
      status: "SCHEDULED",
      // totalParticipants: 0, // Optional, can be omitted
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Generate winners conforming to the Winner type
  const winners: Winner[] = [];
  const completedDraws = draws.filter((draw) => draw.status === "COMPLETED");
  for (let i = 0; i < completedDraws.length; i++) {
    const draw = completedDraws[i];
    const winnerCount = Math.floor(Math.random() * 3) + 1; // 1-3 winners per draw
    const prizeAmount = 50000 / winnerCount;
    for (let j = 0; j < winnerCount; j++) {
      const subscriber =
        subscribers[Math.floor(Math.random() * subscribers.length)];
      const isPaid = Math.random() > 0.2;
      winners.push({
        id: `winner_${winners.length + 1}`,
        drawId: draw.id,
        msisdn: subscriber.msisdn,
        prizeAmount: prizeAmount,
        prizeCategory: j === 0 ? "JACKPOT" : "CONSOLATION", // Required
        isOptedIn: subscriber.optInStatus, // Required
        isValid: Math.random() > 0.05, // Required
        winDate: draw.drawDate, // Required
        status: isPaid ? "paid" : "pending", // Optional status
        paymentDate: isPaid
          ? new Date(
              new Date(draw.drawDate).getTime() + 2 * 24 * 60 * 60 * 1000
            ).toISOString()
          : null,
        paymentReference: isPaid
          ? `PAY${Math.floor(1000000000 + Math.random() * 9000000000)}`
          : null,
        createdAt: draw.drawDate,
        updatedAt: draw.drawDate,
      });
    }
  }

  // Generate notification templates conforming to NotificationTemplate type
  const notificationTemplates: NotificationTemplate[] = [
    {
      id: "template_1",
      name: "Welcome Message",
      title: "Welcome to MyNumba Don Win!",
      message:
        "Dear customer, welcome to MTN MyNumba Don Win promotion! Recharge your line to qualify for weekly draws and win amazing prizes. Reply STOP to opt out.",
      type: "info",
      channel: "sms",
      createdAt: new Date(
        Date.now() - 90 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 90 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "ACTIVE", // Optional status
    },
    {
      id: "template_2",
      name: "Draw Reminder",
      title: "Draw Reminder",
      message:
        "Dear customer, the next MyNumba Don Win draw is tomorrow! Recharge your line now to qualify and stand a chance to win amazing prizes.",
      type: "info",
      channel: "sms",
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
      type: "success",
      channel: "sms",
      createdAt: new Date(
        Date.now() - 80 * 24 * 60 * 60 * 1000
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 80 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "ACTIVE",
    },
  ];

  // Generate notifications conforming to Notification type
  const notifications: Notification[] = [];
  // Welcome notifications
  for (let i = 0; i < 50; i++) {
    const subscriber = subscribers[i];
    const sentAt = new Date(
      new Date(subscriber.createdAt).getTime() + 1 * 60 * 60 * 1000
    ).toISOString();
    notifications.push({
      id: `notif_${notifications.length + 1}`,
      msisdn: subscriber.msisdn,
      templateId: "template_1", // Optional
      status: "sent",
      sentAt: sentAt,
      createdAt: sentAt,
      updatedAt: sentAt,
      message: notificationTemplates[0].message,
      title: notificationTemplates[0].title,
      type: notificationTemplates[0].type,
      channel: notificationTemplates[0].channel,
      recipients: 1, // Required
    });
  }
  // Winner notifications
  for (let i = 0; i < winners.length; i++) {
    const winner = winners[i];
    const sentAt = new Date(
      new Date(winner.winDate).getTime() + 1 * 60 * 60 * 1000
    ).toISOString();
    notifications.push({
      id: `notif_${notifications.length + 1}`,
      msisdn: winner.msisdn,
      templateId: "template_3", // Optional
      status: "sent",
      sentAt: sentAt,
      createdAt: sentAt,
      updatedAt: sentAt,
      message: notificationTemplates[2].message
        .replace("{{msisdn}}", winner.msisdn)
        .replace("{{amount}}", winner.prizeAmount.toString()),
      title: notificationTemplates[2].title,
      type: notificationTemplates[2].type,
      channel: notificationTemplates[2].channel,
      recipients: 1, // Required
    });
  }

  // Generate CSV Upload History conforming to updated CSVUploadHistory type
  const csvUploads: CSVUploadHistory[] = [
    {
      id: "csv_1",
      fileName: "subscribers_may_week1.csv", // Corrected property name
      uploadDate: new Date( // Corrected property name
        Date.now() - 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "processed", // Allowed status
      recordCount: 50,
      processedCount: 50, // Optional
      errorCount: 0, // Optional
      uploadedBy: "admin", // Optional
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
      status: "failed", // Allowed status
      recordCount: 60,
      processedCount: 0,
      errorCount: 60,
      uploadedBy: "manager",
    },
    {
      id: "csv_4",
      fileName: "subscribers_may_week4.csv",
      uploadDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: "processing", // Allowed status
      recordCount: 70,
      processedCount: 15,
      errorCount: 0,
      uploadedBy: "admin",
    },
  ];

  // Generate Dashboard Stats conforming to DashboardStats type
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

  // Generate Subscriber Growth Data conforming to SubscriberGrowth type
  const subscriberGrowth: SubscriberGrowth[] = [];
  let currentSubs = subscribers.length - Math.floor(Math.random() * 20);
  for (let i = 30; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    currentSubs += Math.floor(Math.random() * 5) - 1; // Random growth/decline
    if (currentSubs < 0) currentSubs = 0;
    subscriberGrowth.push({ date, count: currentSubs });
  }

  // Generate Top-Up Distribution Data conforming to TopUpDistribution type
  const topUpDistribution: TopUpDistribution[] = [
    { range: "₦100-₦199", count: topUps.filter((t) => t.amount < 200).length },
    { range: "₦200-₦499", count: topUps.filter((t) => t.amount >= 200 && t.amount < 500).length },
    { range: "₦500-₦999", count: topUps.filter((t) => t.amount >= 500 && t.amount < 1000).length },
    { range: "₦1000+", count: topUps.filter((t) => t.amount >= 1000).length },
  ];

  // Generate Revenue Trend Data conforming to RevenueTrend type
  const revenueTrend: RevenueTrend[] = [];
  let dailyRevenue = 0;
  for (let i = 30; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    dailyRevenue = topUps
      .filter((t) => t.date.startsWith(date))
      .reduce((sum, t) => sum + t.amount, 0);
    revenueTrend.push({ date, revenue: dailyRevenue });
  }

  // Generate Segments conforming to Segment type
  const segments: Segment[] = [
    {
      id: "seg_1",
      name: "High Value Subscribers",
      description: "Subscribers with total top-up > ₦5000",
      userCount: subscribers.filter((s) => topUps.filter(t => t.msisdn === s.msisdn).reduce((sum, t) => sum + t.amount, 0) > 5000).length,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "seg_2",
      name: "Recent Opt-Ins",
      description: "Subscribers who opted in within the last 7 days",
      userCount: subscribers.filter(s => s.optInStatus && new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

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
    segments, // Added segments
  };
};


