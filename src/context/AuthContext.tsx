// /home/ubuntu/bridgetunes-admin-new/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "./DemoModeContext";
// Import central types and auth service functions
import { User, LoginCredentials, AuthResponse } from "../types/auth.types";
import { login as apiLogin, logout as apiLogout, getAuthToken } from "../services/auth.service";

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
  // State holds the full User object as defined in auth.types.ts
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isDemoMode } = useDemoMode();
  const navigate = useNavigate();

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const savedUserJson = localStorage.getItem(USER_KEY);

      if (token && savedUserJson) {
        try {
          const savedUser = JSON.parse(savedUserJson);
          // Validate the saved user object against the central User type
          if (
            savedUser &&
            typeof savedUser === "object" &&
            typeof savedUser.id === "string" &&
            typeof savedUser.username === "string" &&
            typeof savedUser.email === "string" &&
            typeof savedUser.role === "string" && // Add other required fields if necessary
            typeof savedUser.createdAt === "string" &&
            typeof savedUser.updatedAt === "string"
            // typeof savedUser.name === 'string' // Name is not in the central User type, add if needed
          ) {
            setIsAuthenticated(true);
            setUser(savedUser as User);
          } else {
            throw new Error("Saved user data does not match expected User structure.");
          }
        } catch (e) {
          console.error("Failed to parse or validate user data from localStorage", e);
          // Clear invalid data
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // Ensure state is cleared if no token/user found
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
            createdAt: new Date().toISOString(), // Add dummy dates
            updatedAt: new Date().toISOString(),
            // name: 'Demo Admin' // Name is not in central User type
          };
          loginResponse = {
            success: true,
            token: "demo-token-123",
            user: demoUser,
          };
          // Manually save demo token
          localStorage.setItem(AUTH_TOKEN_KEY, loginResponse.token);
        } else {
          setError("Invalid credentials. In demo mode, use admin@bridgetunes.com / admin123");
          setIsLoading(false);
          return false;
        }
      } else {
        // Call the actual API login function
        loginResponse = await apiLogin({ email, password });
      }

      // Process the response (token is already saved by apiLogin for non-demo)
      if (loginResponse.success && loginResponse.token && loginResponse.user) {
        // Ensure the user object from response conforms to the User type
        // Provide defaults only if absolutely necessary and backend can't guarantee fields
        const validatedUser: User = {
          id: loginResponse.user.id ?? "unknown-id",
          username: loginResponse.user.username ?? email,
          email: loginResponse.user.email ?? email,
          role: (loginResponse.user.role && ["admin", "manager", "viewer"].includes(loginResponse.user.role)) ? loginResponse.user.role : "admin",
          createdAt: loginResponse.user.createdAt ?? new Date().toISOString(),
          updatedAt: loginResponse.user.updatedAt ?? new Date().toISOString(),
          // name: loginResponse.user.name ?? 'User' // Name not in central type
        };

        localStorage.setItem(USER_KEY, JSON.stringify(validatedUser));
        setIsAuthenticated(true);
        setUser(validatedUser);
        setIsLoading(false);
        return true;
      } else {
        // Handle cases where login response is not successful or missing data
        setError(loginResponse.message || "Login failed: Invalid response from server.");
        setIsLoading(false);
        return false;
      }
    } catch (err: any) {
      console.error("Login error in AuthContext:", err);
      setError(err.message || "An error occurred during login");
      // Ensure token/user are cleared on login failure
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const logout = (): void => {
    apiLogout(); // Clears token from localStorage
    localStorage.removeItem(USER_KEY); // Clear user data
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  // resetPassword function remains the same...
  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
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
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, isLoading, error, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


