import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import { DemoModeProvider } from './context/DemoModeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DemoModeToggle from './components/DemoModeToggle';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DrawManagement from './pages/DrawManagement';
import UserManagement from './pages/UserManagement';
import Notifications from './pages/Notifications';
import CSVUpload from './pages/CSVUpload';
import { brandColors } from './config/appConfig';

// Define theme
const theme = {
  colors: {
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    tertiary: brandColors.tertiary,
    success: brandColors.success,
    warning: brandColors.warning,
    danger: brandColors.danger,
    info: brandColors.info,
    light: brandColors.light,
    dark: brandColors.dark,
    gray: brandColors.gray
  },
  fonts: {
    body: "'Roboto', sans-serif",
    heading: "'Roboto', sans-serif"
  }
};

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Header = styled.header`
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.dark};
  display: flex;
  align-items: center;
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const MTNLogo = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  font-weight: 900;
  color: black;
`;

const Content = styled.main`
  flex: 1;
  padding: 0;
`;

const DemoModeBanner = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: black;
  padding: 0.5rem 2rem;
  text-align: center;
  font-weight: 500;
`;

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <DemoModeProvider>
            {({ isDemoMode }) => (
              <AppContainer>
                <Header>
                  <Logo>
                    <MTNLogo>MTN</MTNLogo>
                    Bridgetunes <span>Admin</span>
                  </Logo>
                  <DemoModeToggle />
                </Header>
                
                {isDemoMode && (
                  <DemoModeBanner>
                    Demo Mode Active - Data is stored locally and not sent to any server
                  </DemoModeBanner>
                )}
                
                <Content>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/draws" element={
                      <ProtectedRoute>
                        <DrawManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/users" element={
                      <ProtectedRoute>
                        <UserManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/notifications" element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    } />
                    <Route path="/csv" element={
                      <ProtectedRoute>
                        <CSVUpload />
                      </ProtectedRoute>
                    } />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Content>
              </AppContainer>
            )}
          </DemoModeProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
