import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { DrawFilter } from '../../types/draw.types';

interface DrawFilterFormProps {
  onSubmit: (filter: DrawFilter) => void;
  initialValues?: Partial<DrawFilter>;
}

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  color: #212529;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #FFD100;
    box-shadow: 0 0 0 2px rgba(255, 209, 0, 0.2);
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 209, 0, 0.05);
  }
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const DigitGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const DigitButton = styled(motion.button)<{ selected: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${props => props.selected ? '#FFD100' : '#ddd'};
  background-color: ${props => props.selected ? 'rgba(255, 209, 0, 0.1)' : 'white'};
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? 'rgba(255, 209, 0, 0.2)' : 'rgba(255, 209, 0, 0.05)'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 209, 0, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #FFD100;
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #E6BC00;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const DrawFilterForm: React.FC<DrawFilterFormProps> = ({ onSubmit, initialValues }) => {
  const [days, setDays] = useState<string[]>(initialValues?.days || []);
  const [endingDigits, setEndingDigits] = useState<number[]>(initialValues?.endingDigits || []);
  const [minTopUp, setMinTopUp] = useState<number | undefined>(initialValues?.minTopUp);
  const [maxTopUp, setMaxTopUp] = useState<number | undefined>(initialValues?.maxTopUp);
  
  const handleDayToggle = (day: string) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };
  
  const handleDigitToggle = (digit: number) => {
    if (endingDigits.includes(digit)) {
      setEndingDigits(endingDigits.filter(d => d !== digit));
    } else {
      setEndingDigits([...endingDigits, digit]);
    }
  };
  
  const handleSelectAllDigits = () => {
    if (endingDigits.length === 10) {
      setEndingDigits([]);
    } else {
      setEndingDigits([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      days,
      endingDigits,
      minTopUp,
      maxTopUp
    });
  };
  
  const handleReset = () => {
    setDays([]);
    setEndingDigits([]);
    setMinTopUp(undefined);
    setMaxTopUp(undefined);
  };
  
  return (
    <FormContainer>
      <FormTitle>Draw Filter Criteria</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Days of the Week</Label>
          <CheckboxGroup>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
              <CheckboxLabel key={day}>
                <Checkbox
                  type="checkbox"
                  checked={days.includes(day)}
                  onChange={() => handleDayToggle(day)}
                />
                {day}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>
        
        <FormGroup>
          <Label>Ending Digits</Label>
          <DigitGroup>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
              <DigitButton
                key={digit}
                type="button"
                selected={endingDigits.includes(digit)}
                onClick={() => handleDigitToggle(digit)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {digit}
              </DigitButton>
            ))}
          </DigitGroup>
          <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
            <SecondaryButton type="button" onClick={handleSelectAllDigits}>
              {endingDigits.length === 10 ? 'Clear All' : 'Select All'}
            </SecondaryButton>
          </div>
        </FormGroup>
        
        <FormGroup>
          <Label>Top-up Amount Range (₦)</Label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <Label>Minimum</Label>
              <Input
                type="number"
                min="0"
                step="1"
                value={minTopUp || ''}
                onChange={(e) => setMinTopUp(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Min amount"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Maximum</Label>
              <Input
                type="number"
                min="0"
                step="1"
                value={maxTopUp || ''}
                onChange={(e) => setMaxTopUp(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Max amount"
              />
            </div>
          </div>
        </FormGroup>
        
        <ButtonGroup>
          <SecondaryButton type="button" onClick={handleReset}>
            Reset
          </SecondaryButton>
          <Button type="submit">
            Apply Filter
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default DrawFilterForm;
