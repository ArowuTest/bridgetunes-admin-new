export interface Draw {
  id: string;
  name: string;
  date: string;
  status: string;
  participants: number;
  winners: number;
  totalPrize: number;
  filterCriteria?: {
    days: string[];
    endingDigits: number[];
  };
  winningNumbers?: string[];
  createdAt: string;
  updatedAt?: string;
  scheduledFor?: string;
  completedAt?: string;
}

export interface DrawParticipant {
  id: string;
  drawId: string;
  msisdn: string;
  amount: number;
  isWinner: boolean;
  prize?: number;
  date: string;
}

export interface DrawCreationRequest {
  name: string;
  date: string;
  filterCriteria?: {
    days: string[];
    endingDigits: number[];
  };
  scheduledFor?: string;
}

export interface DrawUpdateRequest {
  id: string;
  name?: string;
  date?: string;
  status?: string;
  filterCriteria?: {
    days: string[];
    endingDigits: number[];
  };
  scheduledFor?: string;
}

export interface DrawResult {
  drawId: string;
  winningNumbers: string[];
  winners: DrawParticipant[];
  totalPrize: number;
  completedAt: string;
}



export interface PrizeStructure {
  id: string;
  type: "DAILY" | "SATURDAY"; // Use type instead of draw_type
  jackpot: number;
  second: number;
  third: number;
  consolation: number;
  consolationCount: number;
  // Add other potential fields like rollover if managed here
}




