import React from 'react';
import styled from 'styled-components';

// Styled components
const PageContainer = styled.div`
  background-color: ${props => props.theme.colors.light};
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.bridgetunesDark};
  margin-bottom: 0.5rem;
  
  &:after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: linear-gradient(to right, ${props => props.theme.colors.mtnYellow}, ${props => props.theme.colors.bridgetunesBlue});
    margin-top: 0.5rem;
    border-radius: 2px;
  }
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.gray};
  max-width: 800px;
`;

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, description, children }) => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{title}</PageTitle>
        {description && <PageDescription>{description}</PageDescription>}
      </PageHeader>
      {children}
    </PageContainer>
  );
};

// Add named export alongside default export
export { PageLayout };
export default PageLayout;
