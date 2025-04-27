import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'manager' | 'viewer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { state } = useAuth();
  const { isAuthenticated, user, loading } = state;

  // Show loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role (if specified)
  if (requiredRole) {
    // Admin can access all routes
    if (user.role === 'admin') {
      return <Outlet />;
    }

    // Manager can access manager and viewer routes
    if (user.role === 'manager' && (requiredRole === 'manager' || requiredRole === 'viewer')) {
      return <Outlet />;
    }

    // Viewer can only access viewer routes
    if (user.role === 'viewer' && requiredRole === 'viewer') {
      return <Outlet />;
    }

    // User doesn't have required role
    return <Navigate to="/unauthorized" replace />;
  }

  // No specific role required, just authentication
  return <Outlet />;
};

export default ProtectedRoute;
