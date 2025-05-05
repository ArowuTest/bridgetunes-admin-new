import React, { ReactNode } from 'react';
// Updated import for v5: Replace Navigate with Redirect
import { Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components'; // Import styled-components

// Optional: Add a simple loading indicator
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 70px); // Adjust based on your layout
  font-size: 1.2rem;
`;

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Get both isAuthenticated and isLoading states
  const { isAuthenticated, isLoading } = useAuth();

  // If the initial auth check is still loading, show a loading indicator or null
  if (isLoading) {
    return <LoadingContainer>Loading...</LoadingContainer>; // Or return null;
  }

  // If loading is finished and user is not authenticated, redirect to login
  if (!isAuthenticated) {
    // Replaced Navigate with Redirect for v5
    return <Redirect to="/login" />;
  }

  // If loading is finished and user is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;

