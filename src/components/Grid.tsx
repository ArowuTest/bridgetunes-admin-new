import React from 'react';
import styled from 'styled-components';

// Styled components
const GridContainer = styled.div<{
  columns?: number;
  gap?: string;
  mobileColumns?: number;
  tabletColumns?: number;
}>`
  display: grid;
  grid-template-columns: repeat(${props => props.mobileColumns || 1}, 1fr);
  gap: ${props => props.gap || '1rem'};
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(${props => props.tabletColumns || 2}, 1fr);
  }
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  }
`;

interface GridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: string;
  mobileColumns?: number;
  tabletColumns?: number;
}

const Grid: React.FC<GridProps> = ({
  children,
  columns = 3,
  gap = '1rem',
  mobileColumns = 1,
  tabletColumns = 2
}) => {
  return (
    <GridContainer 
      columns={columns}
      gap={gap}
      mobileColumns={mobileColumns}
      tabletColumns={tabletColumns}
    >
      {children}
    </GridContainer>
  );
};

export default Grid;
