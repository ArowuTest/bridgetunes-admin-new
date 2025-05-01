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
    return fetchApi('/draws/schedule', {
      method: 'POST',
      body: JSON.stringify(payload),
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

  // --- Placeholder/Removed Methods from original mock ---

  // createDraw is replaced by scheduleDraw
  // updateDraw - No direct equivalent found in routes, might need specific endpoints if required
  // deleteDraw - No equivalent found in routes
}

export const drawService = new DrawService();

