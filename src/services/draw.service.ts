import { Draw, Winner } from '../types/draw.types';
import { getAuthToken } from './auth.service'; // Assuming an auth service exists

// Define the base URL for the API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// Helper function for making authenticated API requests
async function fetchApi(url: string, options: RequestInit = {}): Promise<any> {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // Ignore if response is not JSON
    }
    const errorMessage = errorData?.error || `HTTP error! status: ${response.status}`;
    console.error(`API Error (${response.status}) on ${options.method || 'GET'} ${url}:`, errorMessage, errorData);
    throw new Error(errorMessage);
  }

  // Handle cases where the response might be empty (e.g., 204 No Content)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Define payload types
interface ScheduleDrawPayload {
  draw_date: string; // YYYY-MM-DD
  draw_type: 'DAILY' | 'SATURDAY';
  eligible_digits?: number[];
  use_default: boolean;
}

// Define Prize type (based on backend expectation)
interface Prize {
  category: string;
  amount: number;
  count: number;
}

// Define Prize Structure type (assuming backend returns this structure)
interface PrizeStructure {
  daily: Prize[];
  saturday: Prize[];
}

// Define payload for updating prize structure
interface UpdatePrizeStructurePayload {
  drawType: 'daily' | 'saturday';
  prizes: Prize[];
}


class DrawService {

  // GET /draws?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
  async getDraws(startDate?: string, endDate?: string): Promise<Draw[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const queryString = params.toString();
    return fetchApi(`/draws${queryString ? `?${queryString}` : ''}`);
  }

  // GET /draws/:id
  async getDrawById(id: string): Promise<Draw | null> {
    try {
      return await fetchApi(`/draws/${id}`);
    } catch (error: any) {
      if (error.message.includes('404') || error.message.toLowerCase().includes('not found')) {
        return null; // Return null if draw not found
      }
      throw error; // Re-throw other errors
    }
  }

  // GET /draws/date/:date (YYYY-MM-DD)
  async getDrawByDate(date: string): Promise<Draw | null> {
    try {
      return await fetchApi(`/draws/date/${date}`);
    } catch (error: any) {
      if (error.message.includes('404') || error.message.toLowerCase().includes('not found')) {
        return null; // Return null if draw not found for the date
      }
      throw error; // Re-throw other errors
    }
  }

  // GET /draws/default-digits/:day (e.g., 'Monday', 'Tuesday')
  async getDefaultEligibleDigits(day: string): Promise<number[]> {
    // Backend expects day name, ensure frontend provides it correctly
    return fetchApi(`/draws/default-digits/${day}`);
  }

  // POST /draws/schedule
  async scheduleDraw(payload: ScheduleDrawPayload): Promise<Draw> {
    // Convert draw_type to uppercase if needed by backend
    const backendPayload = {
      ...payload,
      draw_type: payload.draw_type.toUpperCase() as 'DAILY' | 'SATURDAY'
    };
    return fetchApi('/draws/schedule', {
      method: 'POST',
      body: JSON.stringify(backendPayload),
    });
  }

  // POST /draws/:id/execute
  async executeDraw(id: string): Promise<{ message: string }> {
    return fetchApi(`/draws/${id}/execute`, {
      method: 'POST',
    });
  }

  // GET /draws/:id/winners
  async getDrawWinners(id: string): Promise<Winner[]> {
    return fetchApi(`/draws/${id}/winners`);
  }

  // DELETE /draws/:id (Added based on DrawManagement usage)
  async deleteDraw(id: string): Promise<void> {
    // Assuming backend supports DELETE for scheduled draws
    await fetchApi(`/draws/${id}`, { method: 'DELETE' });
  }

  // GET /draws/prize-structure (NEW)
  async getPrizeStructure(): Promise<PrizeStructure> {
    // Assuming endpoint returns { daily: Prize[], saturday: Prize[] }
    return fetchApi('/draws/prize-structure');
  }

  // PUT /draws/prize-structure (NEW)
  async updatePrizeStructure(payload: UpdatePrizeStructurePayload): Promise<void> {
    // Assuming endpoint accepts { drawType: 'daily'|'saturday', prizes: Prize[] }
    await fetchApi('/draws/prize-structure', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  // GET /draws/jackpot-status (NEW - for later step)
  async getJackpotStatus(): Promise<{ currentAmount: number /* Add other fields as needed */ }> {
    return fetchApi('/draws/jackpot-status');
  }

  // GET /draws/rollovers (NEW - for later step, requires backend endpoint)
  async getRolloverHistory(/* Add filters if needed */): Promise<any[]> { // Define Rollover type later
    // Example endpoint, adjust as needed
    return fetchApi('/draws/rollovers'); 
  }

}

export const drawService = new DrawService();


