// src/services/winner.service.ts
import { Winner } from "../types/draw.types";
import { getAuthToken } from "./auth.service";

// Define the base URL for the API
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

// Re-use or adapt the fetchApi helper from draw.service.ts
async function fetchApi(url: string, options: RequestInit = {}): Promise<any> {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
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
    const errorMessage =
      errorData?.error || `HTTP error! status: ${response.status}`;
    console.error(
      `API Error (${response.status}) on ${options.method || "GET"} ${url}:`,
      errorMessage,
      errorData
    );
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Define filter types for fetching winners
interface GetWinnersFilters {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  status?: string; // e.g., 'Pending', 'Paid', 'Failed'
  drawType?: "daily" | "saturday";
  // Add other filters as needed (e.g., prizeCategory)
}

class WinnerService {
  // GET /winners
  async getWinners(filters: GetWinnersFilters = {}): Promise<Winner[]> {
    const params = new URLSearchParams();
    if (filters.startDate) params.append("start_date", filters.startDate);
    if (filters.endDate) params.append("end_date", filters.endDate);
    if (filters.status) params.append("status", filters.status);
    if (filters.drawType) params.append("draw_type", filters.drawType);

    const queryString = params.toString();
    // NOTE: Backend endpoint /api/v1/winners needs to be implemented
    return fetchApi(`/winners${queryString ? `?${queryString}` : ""}`);
  }

  // PUT /winners/:id/status
  async updateWinnerStatus(
    winnerId: string,
    status: string // e.g., 'Paid', 'Failed', 'Pending'
  ): Promise<Winner> { // Assuming backend returns the updated winner
    // NOTE: Backend endpoint /api/v1/winners/:id/status needs to be implemented
    return fetchApi(`/winners/${winnerId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }
}

export const winnerService = new WinnerService();

