import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DrawManagement from './pages/DrawManagement';
import PrizeStructurePage from './pages/PrizeStructure';
import PageNotFound from './pages/PageNotFound';

function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null; // or a spinner
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route path="/login" exact component={LoginPage} />
          <ProtectedRoute path="/" exact component={Dashboard} />
          <ProtectedRoute path="/draws" component={DrawManagement} />
          <ProtectedRoute path="/prize-structure" component={PrizeStructurePage} />
          <Route component={PageNotFound} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
