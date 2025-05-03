import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoMode } from './DemoModeContext';
// Import auth functions and the PartialUser interface
import { login as apiLogin, logout as apiLogout, getAuthToken, isLoggedIn, PartialUser } from '../services/auth.service';

// Define the full User interface expected by the frontend context/components
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

const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'bridgetunes_user';

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

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Validate the parsed user object more thoroughly
          if (parsedUser && typeof parsedUser === 'object' &&
              typeof parsedUser.id === 'string' &&
              typeof parsedUser.username === 'string' &&
              typeof parsedUser.email === 'string' &&
              typeof parsedUser.role === 'string' &&
              typeof parsedUser.name === 'string') {
            setIsAuthenticated(true);
            setUser(parsedUser as User);
          } else {
            throw new Error("Parsed user data does not match User interface");
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
      if (isDemoMode) {
        // Demo mode login logic
        return new Promise((resolve) => {
          setTimeout(() => {
            if (email === 'admin@bridgetunes.com' && password === 'admin123') {
              const demoUser: User = {
                id: 'demo-1',
                username: 'admin',
                email: 'admin@bridgetunes.com',
                role: 'admin' as const,
                name: 'Demo Admin'
              };
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
        // Real API login
        const loginResponse = await apiLogin({ email, password });
        if (loginResponse.token) {
          const backendUser: PartialUser | undefined = loginResponse.user;

          // **Robustly construct the full User object with defaults**
          const apiUser: User = {
            id: backendUser?.id ?? 'unknown-id',
            username: backendUser?.username ?? email, // Fallback to email if username missing
            email: backendUser?.email ?? email, // Ensure email is always present
            // Ensure role is one of the allowed values, default to 'viewer' or 'admin' if invalid/missing
            role: (backendUser?.role && ['admin', 'manager', 'viewer'].includes(backendUser.role)) ? backendUser.role : 'admin',
            name: backendUser?.name ?? 'User' // Fallback name
          };

          localStorage.setItem(USER_KEY, JSON.stringify(apiUser));
          setIsAuthenticated(true);
          setUser(apiUser); // Set the guaranteed complete User object
          setIsLoading(false);
          return true;
        } else {
          // Should be caught by apiLogin error handling, but as a fallback:
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
    apiLogout();
    localStorage.removeItem(USER_KEY);
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  // resetPassword function remains the same...
  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
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



