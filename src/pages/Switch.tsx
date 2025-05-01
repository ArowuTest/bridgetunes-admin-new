import React from 'react';
import styled from 'styled-components';

interface SwitchProps {
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean; // Added optional disabled prop
}

const SwitchContainer = styled.div<{ isActive: boolean; disabled?: boolean }>`
  display: inline-block;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  width: 40px;
  height: 20px;
  background-color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.gray300};
  border-radius: 10px;
  position: relative;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

const SwitchThumb = styled.div<{ isActive: boolean }>`
  position: absolute;
  top: 2px;
  left: ${props => props.isActive ? '22px' : '2px'};
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: left 0.2s ease;
`;

const Switch: React.FC<SwitchProps> = ({ isActive, onToggle, disabled = false }) => {
  const handleClick = () => {
    if (!disabled) {
      onToggle();
    }
  };

  return (
    <SwitchContainer isActive={isActive} disabled={disabled} onClick={handleClick}>
      <SwitchThumb isActive={isActive} />
    </SwitchContainer>
  );
};

export default Switch;

