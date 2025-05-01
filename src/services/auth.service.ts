// /home/ubuntu/bridgetunes-admin-new/src/services/auth.service.ts

// Define the base URL for the API (consistent with other services)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
const AUTH_TOKEN_KEY = 'authToken'; // Key for storing token in localStorage

interface LoginResponse {
  token: string;
  // Add other user details if the backend returns them
  user?: {
    id: string;
    name: string;
    // Add other user fields
  };
}

interface LoginCredentials {
  email: string; // Assuming email is used for login
  password?: string; // Password might be optional if using other methods
}

/**
 * Logs in the user by calling the backend API.
 * Stores the received token in localStorage.
 * @param credentials User credentials (e.g., email, password).
 * @returns The login response from the backend (including token and user info).
 * @throws Error if login fails.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  console.log(`Attempting login for ${credentials.email}...`);
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // Ignore if response is not JSON
      }
      const errorMessage = errorData?.error || `Login failed: ${response.statusText} (Status: ${response.status})`;
      console.error('Login API Error:', errorMessage, errorData);
      throw new Error(errorMessage);
    }

    const data: LoginResponse = await response.json();

    if (data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      console.log('Login successful, token stored.');
      return data;
    } else {
      console.error('Login response did not contain a token.');
      throw new Error('Login failed: No token received from server.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    // Re-throw the error so the calling component can handle it
    throw error;
  }
}

/**
 * Retrieves the authentication token from localStorage.
 * @returns The authentication token string or null if not found.
 */
export function getAuthToken(): string | null {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  // console.log(`getAuthToken called, token found: ${!!token}`); // Optional: for debugging
  return token;
}

/**
 * Removes the authentication token from localStorage.
 */
export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  console.log('Logged out, token removed.');
  // Optionally, redirect the user to the login page or refresh the page
  // window.location.href = '/login';
}

/**
 * Checks if a user is currently logged in (i.e., if a token exists).
 * @returns True if a token exists in localStorage, false otherwise.
 */
export function isLoggedIn(): boolean {
  return !!getAuthToken();
}

