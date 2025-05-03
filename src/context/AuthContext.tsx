import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoMode } from './DemoModeContext';
import { login as apiLogin, logout as apiLogout, getAuthToken, isLoggedIn } from '../services/auth.service'; // Import auth functions

// Define user interface
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use the same key as defined in auth.service.ts
const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'bridgetunes_user'; // Keep user key as is for now, or unify if needed later

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isDemoMode } = useDemoMode();
  const navigate = useNavigate();

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      // Use the consistent key to check for token
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setIsAuthenticated(true);
          setUser(parsedUser);
        } catch (e) {
          console.error("Failed to parse user data from localStorage", e);
          // Clear invalid data if parsing fails
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
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
      if (isDemoMode) {
        // Demo mode login logic (remains unchanged)
        return new Promise((resolve) => {
          setTimeout(() => {
            if (email === 'admin@bridgetunes.com' && password === 'admin123') {
              const demoUser = {
                id: 'demo-1',
                username: 'admin',
                email: 'admin@bridgetunes.com',
                role: 'admin' as const,
                name: 'Demo Admin'
              };
              // Use the consistent key to save token
              localStorage.setItem(AUTH_TOKEN_KEY, 'demo-token-123');
              localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
              setIsAuthenticated(true);
              setUser(demoUser);
              setIsLoading(false);
              resolve(true);
            } else {
              setError('Invalid credentials. In demo mode, use admin@bridgetunes.com / admin123');
              setIsLoading(false);
              resolve(false);
            }
          }, 800);
        });
      } else {
        // Use the imported apiLogin function from auth.service.ts
        const loginResponse = await apiLogin({ email, password });
        if (loginResponse.token) {
          // Token is already saved by apiLogin, just update state
          const apiUser = loginResponse.user || { id: 'unknown', username: email, email: email, role: 'admin', name: 'Admin User' }; // Use backend user data if available
          // Save user data separately if needed (apiLogin only saves token)
          localStorage.setItem(USER_KEY, JSON.stringify(apiUser));
          setIsAuthenticated(true);
          setUser(apiUser);
          setIsLoading(false);
          return true;
        } else {
          // This case should ideally be handled within apiLogin's error throwing
          setError('Login failed: No token received.');
          setIsLoading(false);
          return false;
        }
      }
    } catch (err: any) {
      console.error("Login error in AuthContext:", err);
      setError(err.message || 'An error occurred during login');
      setIsLoading(false);
      return false;
    }
  };

  const logout = (): void => {
    apiLogout(); // Use the imported logout function which clears the correct token key
    localStorage.removeItem(USER_KEY); // Also clear user data
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real implementation, this would call an API
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate successful password reset request
          setIsLoading(false);
          resolve(true);
        }, 1000);
      });
    } catch (err) {
      setError('An error occurred during password reset');
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


