import React from 'react';
import styled from 'styled-components';
// Updated import for v5
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoModeProvider, useDemoMode } from './context/DemoModeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DemoModeToggle from './components/DemoModeToggle';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DrawManagement from './pages/DrawManagement';
import UserManagement from './pages/UserManagement';
import Notifications from './pages/Notifications';
import CSVUpload from './pages/CSVUpload';
import WinnerManagement from './pages/WinnerManagement'; // Import the new page
import { brandColors } from './config/appConfig';

// Define theme (remains the same)
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
    gray: brandColors.gray,
    mtnYellow: brandColors.primary,
    bridgetunesBlue: brandColors.secondary,
    bridgetunesDark: brandColors.dark
  },
  fonts: {
    body: "'Roboto', sans-serif",
    heading: "'Roboto', sans-serif"
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px'
  }
};

// Styled components (remain the same)
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 70px;
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

const Content = styled.main<{ isAuthenticated: boolean }>`
  flex: 1;
  margin-top: 70px; /* Space for header */
  margin-left: ${props => props.isAuthenticated ? '250px' : '0'};
  transition: margin-left 0.3s ease;
  padding: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const DemoModeBanner = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: black;
  padding: 0.5rem 2rem;
  text-align: center;
  font-weight: 500;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  z-index: 99;
`;

const AuthPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

// Separate component to use hooks at the top level
const AppContent: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const { isAuthenticated } = useAuth();
  
  return (
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
      
      {isAuthenticated && <Navigation />}
      
      <Content isAuthenticated={isAuthenticated}>
        {/* Replaced Routes with Switch */}
        <Switch>
          {/* Updated Route syntax for v5 */}
          <Route path="/login">
            <AuthPageContainer>
              <Login />
            </AuthPageContainer>
          </Route>
          <Route path="/register">
            <AuthPageContainer>
              <Register />
            </AuthPageContainer>
          </Route>
          <Route path="/dashboard">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Route>
          {/* Corrected path based on original file */}
          <Route path="/draws">
            <ProtectedRoute>
              <DrawManagement />
            </ProtectedRoute>
          </Route>
          {/* ADDED ROUTE FOR WINNER MANAGEMENT */}
          <Route path="/winner-management">
            <ProtectedRoute>
              <WinnerManagement />
            </ProtectedRoute>
          </Route>
          {/* END ADDED ROUTE */}
          {/* Corrected path based on original file */}
          <Route path="/users">
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          </Route>
          <Route path="/notifications">
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          </Route>
          {/* Corrected path based on original file */}
          <Route path="/csv">
            <ProtectedRoute>
              <CSVUpload />
            </ProtectedRoute>
          </Route>
          {/* Default route - Replaced Navigate with Redirect, added exact */}
          <Route exact path="/">
             <Redirect to="/dashboard" />
          </Route>
          {/* Catch-all - Replaced Route with Navigate with Redirect */}
          <Redirect from="*" to="/dashboard" />
        </Switch>
      </Content>
    </AppContainer>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <DemoModeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </DemoModeProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;

