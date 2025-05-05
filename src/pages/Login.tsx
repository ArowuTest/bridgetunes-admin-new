import React, { useState, useEffect } from 'react';
// Updated import for v5: Replace useNavigate with useHistory
import { useHistory } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useDemoMode } from '../context/DemoModeContext';
import Card from '../components/Card';
import Button from '../components/Button';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 450px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const MTNLogo = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-weight: 900;
  color: black;
  font-size: 1.2rem;
`;

const LogoText = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${props => props.theme.colors.dark};
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.gray300};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.danger : props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.hasError ? `${props.theme.colors.danger}33` : `${props.theme.colors.primary}33`};
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.gray600};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ForgotPassword = styled.div`
  text-align: center;
  margin-top: 1rem;

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: ${props => props.theme.colors.secondary};
      text-decoration: underline;
    }
  }
`;

const DemoModeInfo = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${props => `${props.theme.colors.info}15`};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.info};
  text-align: center;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth(); // Get isAuthenticated state
  const { isDemoMode } = useDemoMode();
  // Updated for v5: Replace useNavigate with useHistory
  const history = useHistory();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      // Updated for v5: Use history.replace to avoid adding login to history stack
      history.replace("/dashboard");
    }
  }, [isAuthenticated, history]); // Add history to dependency array

  useEffect(() => {
    // Clear errors when inputs change
    if (email) {
      setErrors(prev => ({...prev, email: undefined}));
    }
    if (password) {
      setErrors(prev => ({...prev, password: undefined}));
    }
  }, [email, password]);

  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      await login(email, password); 
      // Calls AuthContext's login, which handles navigation on success
      // If login succeeds, AuthContext will navigate. If it fails, it throws an error.
    } catch (error: any) {
      // Catch any rejection from await login()
      console.error("Error caught in Login.tsx handleSubmit:", error);
      // Keep this log for now
      setErrors({ general: error.message || 'An unexpected error occurred during login.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    try {
      // Using demo credentials expected by AuthContext
      await login("admin@bridgetunes.com", "admin123"); 
      // AuthContext handles navigation on success
    } catch (error: any) {
      console.error("Error caught in Login.tsx handleDemoLogin:", error);
      setErrors({ general: error.message || "Demo login failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Card padding="2rem">
        <Logo>
          <MTNLogo>MTN</MTNLogo>
          <LogoText>
            Bridgetunes <span>Admin</span>
          </LogoText>
        </Logo>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign in to your account</h2>
        {errors.general && (
          <ErrorMessage style={{ textAlign: 'center', marginBottom: '1rem' }}>
            {errors.general}
          </ErrorMessage>
        )}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <InputIcon>
              <FaUser />
            </InputIcon>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              hasError={!!errors.email}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>
          <FormGroup>
            <InputIcon>
              <FaLock />
            </InputIcon>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hasError={!!errors.password}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? (
              <>
                <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          {isDemoMode && (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Use Demo Account
            </Button>
          )}
        </Form>
        <ForgotPassword>
          <a href="#forgot-password">Forgot password?</a>
        </ForgotPassword>
        {isDemoMode && (
          <DemoModeInfo>
            <strong>Demo Mode Active</strong>
            <p>Data is stored locally and not sent to any server.</p>
          </DemoModeInfo>
        )}
      </Card>
    </LoginContainer>
  );
};

export default Login;



