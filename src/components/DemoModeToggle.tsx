import React from 'react';
import styled from 'styled-components';
import { FaDatabase, FaCloud } from 'react-icons/fa';
import { useDemoMode } from '../context/DemoModeContext';
import { brandColors } from '../config/appConfig';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 1rem;
`;

const ToggleLabel = styled.span`
  font-size: 0.875rem;
  margin-right: 0.5rem;
  color: ${props => props.theme.colors.gray};
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 60px;
  height: 28px;
  background-color: ${props => props.active ? brandColors.primary : '#e2e2e2'};
  border-radius: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
`;

const ToggleKnob = styled.div<{ active: boolean }>`
  position: absolute;
  top: 3px;
  left: ${props => props.active ? '33px' : '3px'};
  width: 22px;
  height: 22px;
  background-color: white;
  border-radius: 50%;
  transition: left 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const IconContainer = styled.div`
  color: white;
  font-size: 12px;
  z-index: 1;
  opacity: 0.9;
`;

const DemoModeToggle: React.FC = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <ToggleContainer>
      <ToggleLabel>Mode:</ToggleLabel>
      <ToggleSwitch active={isDemoMode} onClick={toggleDemoMode}>
        <IconContainer>
          <FaDatabase />
        </IconContainer>
        <IconContainer>
          <FaCloud />
        </IconContainer>
        <ToggleKnob active={isDemoMode} />
      </ToggleSwitch>
    </ToggleContainer>
  );
};

export default DemoModeToggle;
