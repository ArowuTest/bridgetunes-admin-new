import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface DrawWheelProps {
  numbers: string[];
  spinning: boolean;
  selectedNumber?: string;
  onSpinComplete?: () => void;
}

const WheelContainer = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
`;

const Wheel = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background: #FFD100;
`;

const WheelSegment = styled.div<{ index: number; total: number }>`
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: bottom right;
  left: 0;
  top: 0;
  transform: rotate(${props => (props.index * (360 / props.total))}deg);
  clip-path: polygon(100% 0, 100% 100%, 0 0);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.index % 2 === 0 ? '#FFD100' : '#004F9F'};
`;

const SegmentContent = styled.div<{ index: number; total: number }>`
  position: absolute;
  transform: rotate(${props => (props.index * (360 / props.total) + (180 / props.total))}deg);
  width: 100px;
  text-align: center;
  color: ${props => props.index % 2 === 0 ? '#000' : '#fff'};
  font-weight: bold;
  font-size: 14px;
  left: 75px;
  top: 30px;
`;

const WheelPointer = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 30px solid #E30613;
  z-index: 10;
`;

const WheelCenter = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
`;

const MTNLogo = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #FFD100;
  background-color: #004F9F;
  padding: 5px;
  border-radius: 50%;
`;

const SelectedNumber = styled(motion.div)`
  position: absolute;
  top: 320px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  font-weight: bold;
  color: #004F9F;
  text-align: center;
`;

const DrawWheel: React.FC<DrawWheelProps> = ({ 
  numbers, 
  spinning, 
  selectedNumber,
  onSpinComplete 
}) => {
  // Animation variants
  const wheelVariants = {
    spinning: {
      rotate: [0, 1800 + Math.random() * 360],
      transition: {
        duration: 5,
        ease: "easeOut",
        onComplete: onSpinComplete
      }
    },
    stopped: {
      rotate: 0,
      transition: {
        duration: 0
      }
    }
  };

  const selectedVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 5.2,
        duration: 0.5
      }
    }
  };

  return (
    <div>
      <WheelContainer>
        <WheelPointer />
        <Wheel
          animate={spinning ? "spinning" : "stopped"}
          variants={wheelVariants}
        >
          {numbers.map((number, index) => (
            <React.Fragment key={index}>
              <WheelSegment index={index} total={numbers.length} />
              <SegmentContent index={index} total={numbers.length}>
                {number}
              </SegmentContent>
            </React.Fragment>
          ))}
        </Wheel>
        <WheelCenter>
          <MTNLogo>MTN</MTNLogo>
        </WheelCenter>
      </WheelContainer>
      
      {selectedNumber && (
        <SelectedNumber
          initial="hidden"
          animate={spinning ? "hidden" : "visible"}
          variants={selectedVariants}
        >
          Winner: {selectedNumber}
        </SelectedNumber>
      )}
    </div>
  );
};

export default DrawWheel;
