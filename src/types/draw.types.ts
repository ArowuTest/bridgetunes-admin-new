export interface Draw {
  id: string;
  name: string;
  date: string; // Consider using Date type if appropriate, but string is often safer for API consistency
  status: string; // e.g., 'scheduled', 'completed', 'cancelled'
  participants?: number; // Optional based on API response
  winners?: number; // Optional
  totalPrize?: number; // Optional
  filterCriteria?: {
    days?: string[]; // Optional
    endingDigits?: number[]; // Optional
  };
  winningNumbers?: string[]; // Optional
  createdAt: string;
  updatedAt?: string;
  scheduledFor?: string;
  completedAt?: string;
  // Added based on component usage
  drawDate: string; // Seems redundant with 'date', clarify which one is correct from API
  rollover?: number; // Optional, used in PrizeDisplay
  type?: "DAILY" | "SATURDAY"; // Optional, used in PrizeDisplay
}

export interface DrawParticipant {
  id: string;
  drawId: string;
  msisdn: string;
  amount?: number; // Optional based on API response
  isWinner: boolean;
  prize?: number; // Optional
  date?: string; // Optional
  // Added based on component usage
  prizeTier?: string; // e.g., 'Jackpot', 'Second'
  prizeAmount?: number; // Seems redundant with 'prize', clarify
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
  winners: DrawParticipant[]; // Use DrawParticipant
  totalPrize: number;
  completedAt: string;
}

// Type for individual prize categories returned by the service
export interface Prize {
  category: string; // e.g., "Jackpot", "Second", "Third", "Consolation"
  amount: number;
  count: number; // Especially relevant for consolation prizes
}

// Type for the structure returned by drawService.getPrizeStructure()
export interface ServicePrizeStructure {
  daily: Prize[];
  saturday: Prize[];
  // Include ID if the service provides it at this level
  id?: string; // Optional ID for the whole structure if applicable
}

// Type for the flattened structure used within the DrawManagement component state
export interface ComponentPrizeStructure {
  id: string; // ID of the specific structure (daily or saturday) - needs clarification how this is obtained/managed
  type: "DAILY" | "SATURDAY";
  jackpot: number;
  second: number;
  third: number;
  consolation: number;
  consolationCount: number;
}

// Payload for updating prize structure via drawService.updatePrizeStructure()
export interface UpdatePrizeStructurePayload {
  drawType: 'daily' | 'saturday'; // Lowercase as per service definition
  prizes: Prize[];
}


