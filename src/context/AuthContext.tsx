import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
// Updated import for v5: Replace useNavigate with useHistory
import { useHistory } from "react-router-dom";
import { useDemoMode } from "./DemoModeContext";

// Import central types and auth service functions
import { User, LoginCredentials, AuthResponse } from "../types/auth.types"; // Use central User type
import { login as apiLogin, logout as apiLogout } from "../services/auth.service";

// Define the shape of the context value
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: User | null; // Use the imported User type
  isLoading: boolean;
  error: string | null;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Consistent keys for localStorage
const AUTH_TOKEN_KEY = "authToken";
const USER_KEY = "bridgetunes_user";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isDemoMode } = useDemoMode();
  // Updated for v5: Replace useNavigate with useHistory
  const history = useHistory();

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const savedUserJson = localStorage.getItem(USER_KEY);

      if (token && savedUserJson) {
        try {
          const savedUser = JSON.parse(savedUserJson);
          // Validate the saved user object against the central User type (including name)
          if (
            savedUser &&
            typeof savedUser === "object" &&
            typeof savedUser.id === "string" &&
            typeof savedUser.username === "string" &&
            typeof savedUser.email === "string" &&
            typeof savedUser.role === "string" && // Role exists
            typeof savedUser.name === "string" && // Check for name
            typeof savedUser.createdAt === "string" &&
            typeof savedUser.updatedAt === "string"
          ) {
            // Normalize role from localStorage to lowercase for consistency
            const normalizedUser = {
              ...savedUser,
              role: savedUser.role.toLowerCase()
            };
            setIsAuthenticated(true);
            setUser(normalizedUser as User);
          } else {
            throw new Error("Saved user data does not match expected User structure.");
          }
        } catch (e) {
          console.error("Failed to parse or validate user data from localStorage", e);
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      let loginResponse: AuthResponse;

      if (isDemoMode) {
        // Simulate demo login response structure
        if (email === "admin@bridgetunes.com" && password === "admin123") {
          const demoUser: User = {
            id: "demo-1",
            username: "admin",
            email: "admin@bridgetunes.com",
            role: "admin" as const,
            name: "Demo Admin", // Include name for demo user
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Add optional fields if needed for demo, otherwise they can be omitted or undefined
            status: "active",
            lastLogin: new Date().toISOString(),
          };

          // Corrected: Remove 'success' property to match AuthResponse type
          loginResponse = {
            token: "demo-token-123",
            user: demoUser, // Note: Backend might return Partial<User>, handled below
          };
          localStorage.setItem(AUTH_TOKEN_KEY, loginResponse.token);
        } else {
          // Throw error for invalid demo credentials
          const demoErrorMsg = "Invalid credentials. In demo mode, use admin@bridgetunes.com / admin123";
          setError(demoErrorMsg);
          setIsLoading(false);
          throw new Error(demoErrorMsg); // Reject promise
        }
      } else {
        // Call the actual API login function
        loginResponse = await apiLogin({ email, password });
      }

      // Process the response (token is already saved by apiLogin for non-demo)
      if (loginResponse.token && loginResponse.user) {
        const backendUser = loginResponse.user; // This is potentially Partial<User>

        // Construct the full User object for the context state, providing defaults
        const validatedUser: User = {
          id: backendUser.id ?? "unknown-id",
          username: backendUser.username ?? email,
          email: backendUser.email ?? email,
          role: (backendUser.role && ["admin", "manager", "viewer"].includes(backendUser.role.toLowerCase()))
            ? backendUser.role.toLowerCase() as "admin" | "manager" | "viewer" // Assert type
            : "admin", // Default role if validation fails
          name: backendUser.name ?? backendUser.username ?? "User", // Add fallback for name
          createdAt: backendUser.createdAt ?? new Date().toISOString(),
          updatedAt: backendUser.updatedAt ?? new Date().toISOString(),
          // Handle optional fields safely
          status: backendUser.status,
          lastLogin: backendUser.lastLogin,
        };

        localStorage.setItem(USER_KEY, JSON.stringify(validatedUser)); // Save the validated user
        setIsAuthenticated(true);
        setUser(validatedUser); // Set the validated user in state
        setIsLoading(false);
        
        // Updated for v5: Replace navigate with history.push
        history.push("/dashboard");
        return true;
      } else {
        // Throw error for invalid response structure
        const invalidResponseMsg = "Login failed: Invalid response structure from server.";
        setError(invalidResponseMsg);
        setIsLoading(false);
        throw new Error(invalidResponseMsg); // Reject promise
      }
    } catch (err: any) {
      console.error("Login error in AuthContext:", err);
      setError(err.message || "An error occurred during login");
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const logout = (): void => {
    apiLogout();
    localStorage.removeItem(USER_KEY);
    setIsAuthenticated(false);
    setUser(null);
    // Updated for v5: Replace navigate with history.push
    history.push("/login");
  };

  // resetPassword function remains the same...
  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace with actual API call if needed
      return new Promise((resolve) => {
        setTimeout(() => {
          setIsLoading(false);
          resolve(true);
        }, 1000);
      });
    } catch (err) {
      setError("An error occurred during password reset");
      setIsLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user,
        isLoading,
        error,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};



