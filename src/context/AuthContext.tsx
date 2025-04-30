import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoMode } from './DemoModeContext';

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

// Local storage keys
const TOKEN_KEY = 'bridgetunes_auth_token';
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

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      
      if (token && savedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(savedUser));
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
            // Check for demo credentials
            if (email === 'admin@bridgetunes.com' && password === 'admin123') {
              const demoUser = {
                id: 'demo-1',
                username: 'admin',
                email: 'admin@bridgetunes.com',
                role: 'admin' as const,
                name: 'Demo Admin'
              };
              
              // Save to local storage
              localStorage.setItem(TOKEN_KEY, 'demo-token-123');
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
        // Real API login logic would go here
        // For now, we'll simulate a successful login with the same credentials
        // In a real implementation, this would call your backend API
        
        return new Promise((resolve) => {
          setTimeout(() => {
            // For testing purposes, accept the same demo credentials in non-demo mode too
            if (email === 'admin@bridgetunes.com' && password === 'admin123') {
              const apiUser = {
                id: 'user-1',
                username: 'admin',
                email: 'admin@bridgetunes.com',
                role: 'admin' as const,
                name: 'Admin User'
              };
              
              // Save to local storage
              localStorage.setItem(TOKEN_KEY, 'api-token-123');
              localStorage.setItem(USER_KEY, JSON.stringify(apiUser));
              
              setIsAuthenticated(true);
              setUser(apiUser);
              setIsLoading(false);
              resolve(true);
            } else {
              setError('Invalid credentials');
              setIsLoading(false);
              resolve(false);
            }
          }, 1000);
        });
      }
    } catch (err) {
      setError('An error occurred during login');
      setIsLoading(false);
      return false;
    }
  };

  const logout = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
