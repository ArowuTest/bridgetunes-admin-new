export interface Draw {
  id: string;
  name: string;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  participantCount: number;
  winnerCount: number;
  totalPrize: number;
  filterCriteria?: {
    days?: string[];
    endingDigits?: number[];
    minTopUp?: number;
    maxTopUp?: number;
  };
}

export interface DrawParticipant {
  id: string;
  msisdn: string;
  topUpAmount: number;
  topUpDate: string;
  isWinner: boolean;
  prizeAmount?: number;
}

export interface DrawWinner {
  id: string;
  msisdn: string;
  topUpAmount: number;
  topUpDate: string;
  prizeAmount: number;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface DrawFilter {
  days: string[];
  endingDigits: number[];
  minTopUp?: number;
  maxTopUp?: number;
}

export interface DrawCreationParams {
  name: string;
  date: string;
  winnerCount: number;
  totalPrize: number;
  filterCriteria: DrawFilter;
}

export interface DrawUpdateParams {
  name?: string;
  date?: string;
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  winnerCount?: number;
  totalPrize?: number;
  filterCriteria?: DrawFilter;
}
