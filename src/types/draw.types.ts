// Updated Draw interface based on backend model (draw.go)
export interface Draw {
  id: string; // Corresponds to _id (ObjectID) serialized as string
  drawDate: string; // Corresponds to DrawDate (time.Time) serialized as ISO string
  drawType: string; // DAILY or SATURDAY
  eligibleDigits: number[]; // Corresponds to EligibleDigits ([]int)
  useDefault: boolean; // Corresponds to UseDefault (bool)
  status: string; // SCHEDULED, COMPLETED, FAILED, etc.
  totalParticipants?: number; // Optional
  optedInParticipants?: number; // Optional
  prizes?: Prize[]; // Optional array of prizes within the draw
  jackpotAmount?: number; // Optional
  // Removed filterCriteria as it wasn't in the backend model
  createdAt?: string; // Optional
  updatedAt?: string; // Optional
  errorMessage?: string; // Optional
}

// Updated Winner interface based on backend model (winner.go)
export interface Winner {
  id: string; // Corresponds to _id (ObjectID) serialized as string
  msisdn: string;
  maskedMsisdn?: string; // Optional
  drawId: string; // Corresponds to DrawID (ObjectID) serialized as string
  prizeCategory: string;
  prizeAmount: number;
  isOptedIn: boolean;
  isValid: boolean;
  status?: string; // Added optional status for demo data/future use
  points?: number; // Optional
  winDate: string; // Corresponds to WinDate (time.Time) serialized as ISO string
  claimStatus?: string; // PENDING, CLAIMED, EXPIRED - Optional
  claimDate?: string | null; // Optional ISO string or null
  notifiedAt?: string | null; // Optional ISO string or null
  paymentDate?: string | null; // Added optional for demo data/future use
  paymentReference?: string | null; // Added optional for demo data/future use
  createdAt?: string; // Optional
  updatedAt?: string; // Optional
}

// Backend Prize structure (within Draw model)
export interface Prize {
  tier?: number;
  description?: string;
  category: string;
  amount: number;
  numWinners?: number;
  winnerId?: string; // ObjectID serialized as string
  isValid?: boolean;
}

