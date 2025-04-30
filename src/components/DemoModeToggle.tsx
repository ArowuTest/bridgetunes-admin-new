import React from 'react';
import styled from 'styled-components';
import { FaDatabase, FaCloud } from 'react-icons/fa';
import { useDemoMode } from '../context/DemoModeContext';
import { brandColors } from '../config/appConfig';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToggleLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #555;
`;

const ToggleSwitch = styled.div<{ isActive: boolean }>`
  width: 60px;
  height: 28px;
  background-color: ${props => props.isActive ? brandColors.primary : '#e2e2e2'};
  border-radius: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 4px;
  justify-content: ${props => props.isActive ? 'flex-end' : 'flex-start'};
`;

const ToggleKnob = styled.div`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${props => props.theme.colors.dark};
`;

const DemoModeToggle: React.FC = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  
  return (
    <ToggleContainer>
      <ToggleLabel>Demo Mode</ToggleLabel>
      <ToggleSwitch 
        isActive={isDemoMode} 
        onClick={toggleDemoMode}
      >
        <ToggleKnob />
        <IconContainer>
          {isDemoMode ? <FaDatabase /> : <FaCloud />}
        </IconContainer>
      </ToggleSwitch>
    </ToggleContainer>
  );
};

export default DemoModeToggle;
