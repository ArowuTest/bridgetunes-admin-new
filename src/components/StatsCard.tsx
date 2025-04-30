import React from 'react';
import styled, { keyframes, DefaultTheme } from 'styled-components';

// Define a type for the theme colors to ensure type safety
interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  gray: string;
  bridgetunesDark: string;
  light: string;
  [key: string]: string; // Allow other color keys
}

// Define a type for only the string keys of ThemeColors
type StringThemeColorKey = Extract<keyof ThemeColors, string>;

// Extend DefaultTheme to include our colors
interface AppTheme extends DefaultTheme {
  colors: ThemeColors;
  fontWeights: {
    medium: number | string;
    bold: number | string;
  };
}

// Animations
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled components
const StatsCardContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const StatsCardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

// Update IconContainer to use StringThemeColorKey for the color prop
const IconContainer = styled.div<{ bgColor?: string; color?: StringThemeColorKey; theme: AppTheme }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${props =>
    props.bgColor || // Use explicit bgColor if provided
    (props.color && props.theme.colors[props.color]) || // Use theme color if color prop is provided
    props.theme.colors.primary + '20'}; // Default fallback
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  
  svg {
    color: ${props =>
      (props.bgColor || (props.color && props.theme.colors[props.color]))
        ? '#fff' // White icon for solid background
        : props.theme.colors.primary}; // Theme primary for default background
    font-size: 1.5rem;
  }
`;

const StatsTitle = styled.h3<{ theme: AppTheme }>`
  font-size: 1rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.gray};
  margin: 0;
`;

const StatsValue = styled.div<{ theme: AppTheme }>`
  font-size: 2rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.bridgetunesDark};
  margin: 0.5rem 0;
`;

const StatsFooter = styled.div<{ theme: AppTheme }>`
  display: flex;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.light};
  font-size: 0.875rem;
`;

const ChangeIndicator = styled.span<{ isPositive?: boolean; theme: AppTheme }>`
  color: ${props => props.isPositive ? props.theme.colors.success : props.theme.colors.danger};
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  
  svg {
    margin-right: 0.25rem;
  }
`;

const TimePeriod = styled.span<{ theme: AppTheme }>`
  color: ${props => props.theme.colors.gray};
`;

const LoadingShimmer = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  height: 24px;
  width: 100%;
  margin: 0.5rem 0;
`;

// Update StatsCardProps interface to use StringThemeColorKey
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string; // Keep existing prop
  color?: StringThemeColorKey; // Use the refined type for color prop
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  timePeriod?: string;
  isLoading?: boolean;
  isCurrency?: boolean; // Add isCurrency prop used in Dashboard
}

// Update StatsCard component signature and implementation
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  color, // Use color prop
  change,
  timePeriod,
  isLoading = false,
  isCurrency = false // Add isCurrency prop
}) => {
  return (
    <StatsCardContainer>
      <StatsCardHeader>
        {/* Pass color prop to IconContainer */}
        <IconContainer bgColor={iconBgColor} color={color}>
          {icon}
        </IconContainer>
        <StatsTitle>{title}</StatsTitle>
      </StatsCardHeader>
      
      {isLoading ? (
        <LoadingShimmer />
      ) : (
        // Handle currency formatting
        <StatsValue>
          {isCurrency ? `₦${Number(value).toLocaleString()}` : value}
        </StatsValue>
      )}
      
      {(change || timePeriod) && (
        <StatsFooter>
          {change && (
            <ChangeIndicator isPositive={change.isPositive}>
              {change.isPositive ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                </svg>
              )}
              {change.value}%
            </ChangeIndicator>
          )}
          {timePeriod && (
            <TimePeriod>{timePeriod}</TimePeriod>
          )}
        </StatsFooter>
      )}
    </StatsCardContainer>
  );
};

// Add named export alongside default export
export { StatsCard };
export default StatsCard;

