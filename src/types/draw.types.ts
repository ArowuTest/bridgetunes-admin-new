export interface Draw {
  id: string;
  name: string;
  date: string;
  status: string;
  participantCount: number;
  winnerCount: number;
  totalPrize: number;
  filterCriteria: {
    days: string[];
    endingDigits: number[];
  };
}

export interface Winner {
  id: string;
  drawId: string;
  msisdn: string;
  prizeAmount: number;
  status: 'paid' | 'pending';
  paymentDate: string | null;
  paymentReference: string | null;
  createdAt: string;
  updatedAt: string;
}
