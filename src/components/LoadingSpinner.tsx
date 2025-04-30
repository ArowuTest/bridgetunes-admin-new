import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.5; }
`;

// Styled components
const SpinnerContainer = styled.div<{ fullPage?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  ${props => props.fullPage && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 9999;
  `}
`;

const Spinner = styled.div<{ size?: 'small' | 'medium' | 'large' | number }>`
  width: ${props => {
    if (typeof props.size === 'number') return `${props.size}px`;
    switch (props.size) {
      case 'small': return '24px';
      case 'large': return '64px';
      default: return '40px';
    }
  }};
  height: ${props => {
    if (typeof props.size === 'number') return `${props.size}px`;
    switch (props.size) {
      case 'small': return '24px';
      case 'large': return '64px';
      default: return '40px';
    }
  }};
  border: ${props => {
    if (typeof props.size === 'number') {
      const borderWidth = Math.max(3, Math.floor(props.size / 10));
      return `${borderWidth}px`;
    }
    switch (props.size) {
      case 'small': return '3px';
      case 'large': return '6px';
      default: return '4px';
    }
  }} solid ${props => props.theme.colors.light || props.theme.colors.gray200};
  border-top: ${props => {
    if (typeof props.size === 'number') {
      const borderWidth = Math.max(3, Math.floor(props.size / 10));
      return `${borderWidth}px`;
    }
    switch (props.size) {
      case 'small': return '3px';
      case 'large': return '6px';
      default: return '4px';
    }
  }} solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div<{ size?: 'small' | 'medium' | 'large' | number }>`
  margin-top: 1rem;
  color: ${props => props.theme.colors.gray || props.theme.colors.gray600};
  font-size: ${props => {
    if (typeof props.size === 'number') {
      return `${Math.max(0.875, props.size / 40)}rem`;
    }
    switch (props.size) {
      case 'small': return '0.875rem';
      case 'large': return '1.25rem';
      default: return '1rem';
    }
  }};
  animation: ${pulse} 1.5s ease infinite;
`;

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large' | number;
  text?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text,
  fullPage = false
}) => {
  return (
    <SpinnerContainer fullPage={fullPage}>
      <Spinner size={size} />
      {text && <LoadingText size={size}>{text}</LoadingText>}
    </SpinnerContainer>
  );
};

// Add named export alongside default export
export { LoadingSpinner };
export default LoadingSpinner;
