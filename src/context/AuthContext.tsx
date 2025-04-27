import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { authService } from '../services/api.service';
import { AuthState, User } from '../types/auth.types';
import jwtDecode from 'jwt-decode';

// Define action types
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAIL'; payload: string }
  | { type: 'REGISTER_SUCCESS' }
  | { type: 'REGISTER_FAIL'; payload: string }
  | { type: 'USER_LOADED'; payload: User }
  | { type: 'AUTH_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_LOADING' };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

// Create context
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: 'admin' | 'manager' | 'viewer') => Promise<void>;
  logout: () => void;
  clearErrors: () => void;
}>({
  state: initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearErrors: () => {}
});

// Create reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload.user,
        error: null
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.type === 'LOGOUT' ? null : action.payload
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch({ type: 'AUTH_ERROR' });
        return;
      }
      
      try {
        // Check if token is expired
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          dispatch({ type: 'AUTH_ERROR' });
          return;
        }
        
        const response = await authService.getCurrentUser();
        dispatch({ type: 'USER_LOADED', payload: response.user });
      } catch (err) {
        dispatch({ type: 'AUTH_ERROR' });
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const response = await authService.login({ email, password });
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.user, token: response.token }
      });
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err instanceof Error ? err.message : 'Login failed'
      });
    }
  };

  // Register user
  const register = async (username: string, email: string, password: string, role: 'admin' | 'manager' | 'viewer') => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await authService.register({ username, email, password, role });
      dispatch({ type: 'REGISTER_SUCCESS' });
    } catch (err) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err instanceof Error ? err.message : 'Registration failed'
      });
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
