import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const ButtonContainer = styled.button<{
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'icon';
  size?: 'small' | 'medium' | 'large';
  outlined?: boolean;
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => {
    if (props.variant === 'icon') return '0.5rem';
    
    switch (props.size) {
      case 'small': return '0.5rem 1rem';
      case 'large': return '1rem 2rem';
      default: return '0.75rem 1.5rem';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '0.875rem';
      case 'large': return '1.125rem';
      default: return '1rem';
    }
  }};
  font-weight: ${props => props.theme.fontWeights.medium};
  border-radius: ${props => props.variant === 'icon' ? '8px' : '50px'};
  cursor: pointer;
  transition: all 0.3s ease;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  gap: 0.5rem;
  
  ${props => {
    if (props.variant === 'icon') {
      return `
        background-color: transparent;
        color: ${props.theme.colors.gray600};
        border: none;
        
        &:hover {
          color: ${props.theme.colors.primary};
          background-color: ${props.theme.colors.gray100};
        }
        
        &:active {
          background-color: ${props.theme.colors.gray200};
        }
      `;
    }
    
    const color = props.theme.colors[props.variant || 'primary'];
    
    if (props.outlined) {
      return `
        background-color: transparent;
        color: ${color};
        border: 2px solid ${color};
        
        &:hover {
          background-color: ${color};
          color: ${props.variant === 'primary' ? '#000' : '#fff'};
        }
      `;
    } else {
      return `
        background-color: ${color};
        color: ${props.variant === 'primary' ? '#000' : '#fff'};
        border: 2px solid ${color};
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }
        
        &:active {
          transform: translateY(-1px);
        }
      `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  &.animated {
    animation: ${pulse} 2s infinite;
  }
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'icon';
  size?: 'small' | 'medium' | 'large';
  outlined?: boolean;
  fullWidth?: boolean;
  animated?: boolean;
  icon?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  outlined = false,
  fullWidth = false,
  animated = false,
  icon,
  startIcon,
  endIcon,
  className = '',
  ...props
}) => {
  return (
    <ButtonContainer
      variant={variant}
      size={size}
      outlined={outlined}
      fullWidth={fullWidth}
      className={`${className} ${animated ? 'animated' : ''}`}
      {...props}
    >
      {icon || startIcon}
      {children}
      {endIcon}
    </ButtonContainer>
  );
};

export { Button };
export default Button;
