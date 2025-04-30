import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// Styled components
const CardContainer = styled.div<{ padding?: string }>`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  padding: ${props => props.padding || '1.5rem'}; // Use padding prop or default
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.theme.colors.light || props.theme.colors.gray200}; // Added fallback
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out, ${slideUp} 0.5s ease-out;

  &:hover {
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
    transform: translateY(-5px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.light || props.theme.colors.gray200}; // Added fallback
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.bridgetunesDark || props.theme.colors.dark}; // Added fallback
  margin: 0;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.75rem;
    color: ${props => props.theme.colors.mtnYellow || props.theme.colors.primary}; // Added fallback
  }
`;

const CardBody = styled.div`
  padding: 0.5rem 0;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.light || props.theme.colors.gray200}; // Added fallback
`;

interface CardProps {
  title?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  padding?: string; // Add padding prop
}

const Card: React.FC<CardProps> = ({
  title,
  icon,
  headerAction,
  footer,
  children,
  padding // Destructure padding prop
}) => {
  return (
    <CardContainer padding={padding}> {/* Pass padding prop */}
      {title && (
        <CardHeader>
          <CardTitle>
            {icon}
            {title}
          </CardTitle>
          {headerAction}
        </CardHeader>
      )}
      <CardBody>
        {children}
      </CardBody>
      {footer && (
        <CardFooter>
          {footer}
        </CardFooter>
      )}
    </CardContainer>
  );
};

export { Card }; // Add named export
export default Card; // Keep default export
