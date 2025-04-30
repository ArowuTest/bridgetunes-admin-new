import React from 'react';
import styled from 'styled-components';
import { FaSpinner } from 'react-icons/fa';

interface DrawWheelProps {
  isSpinning: boolean;
}

const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem 0;
`;

const Wheel = styled.div<{ isSpinning: boolean }>`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transform: ${props => props.isSpinning ? 'rotate(0deg)' : 'rotate(0deg)'};
  animation: ${props => props.isSpinning ? 'spin 3s cubic-bezier(0.1, 0.7, 0.1, 1) forwards' : 'none'};
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(1440deg);
    }
  }
  
  @media (max-width: 768px) {
    width: 250px;
    height: 250px;
  }
`;

const WheelSection = styled.div<{ color: string; rotation: number }>`
  position: absolute;
  width: 50%;
  height: 50%;
  top: 0;
  left: 25%;
  transform-origin: bottom center;
  transform: rotate(${props => props.rotation}deg);
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  background: ${props => props.color};
  display: flex;
  justify-content: center;
  padding-top: 10%;
  
  span {
    transform: rotate(180deg);
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
`;

const WheelCenter = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  
  svg {
    color: black;
    font-size: 1.5rem;
  }
`;

const WheelPointer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid ${props => props.theme.colors.primary};
  z-index: 5;
`;

const DrawWheel: React.FC<DrawWheelProps> = ({ isSpinning }) => {
  // Colors for wheel sections
  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', 
    '#118AB2', '#073B4C', '#EF476F', '#FFC43D'
  ];
  
  // Generate wheel sections (8 sections)
  const sections = Array.from({ length: 8 }, (_, i) => ({
    color: colors[i],
    rotation: i * 45,
    digit: i
  }));
  
  return (
    <WheelContainer>
      <Wheel isSpinning={isSpinning}>
        {sections.map((section, index) => (
          <WheelSection 
            key={index}
            color={section.color}
            rotation={section.rotation}
          >
            <span>{section.digit}</span>
          </WheelSection>
        ))}
        <WheelCenter>
          {isSpinning && <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />}
        </WheelCenter>
      </Wheel>
      <WheelPointer />
    </WheelContainer>
  );
};

export default DrawWheel;
