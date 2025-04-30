import React, { useState } from 'react';
import styled from 'styled-components';
import { FaFilter, FaCalendarAlt, FaCheck } from 'react-icons/fa';

interface DrawFilterFormProps {
  onChange: (criteria: any) => void;
}

const FilterForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.gray300};
  border-radius: 8px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => `${props.theme.colors.primary}33`};
  }
`;

const DigitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const DigitButton = styled.button<{ selected: boolean; recommended?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${props => props.selected 
    ? props.theme.colors.primary 
    : props.recommended 
      ? props.theme.colors.warning
      : props.theme.colors.gray300};
  background-color: ${props => props.selected 
    ? `${props.theme.colors.primary}15` 
    : props.recommended 
      ? `${props.theme.colors.warning}15`
      : 'white'};
  border-radius: 8px;
  font-weight: ${props => props.selected || props.recommended ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => `${props.theme.colors.primary}10`};
  }
  
  ${props => props.selected && `
    &::after {
      content: '';
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      width: 0.75rem;
      height: 0.75rem;
      background-color: ${props.theme.colors.primary};
      border-radius: 50%;
    }
  `}
  
  ${props => props.recommended && !props.selected && `
    &::after {
      content: '';
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      width: 0.75rem;
      height: 0.75rem;
      background-color: ${props.theme.colors.warning};
      border-radius: 50%;
    }
  `}
`;

const RecommendedNote = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.warning};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
`;

const DrawFilterForm: React.FC<DrawFilterFormProps> = ({ onChange }) => {
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [selectedDigits, setSelectedDigits] = useState<number[]>([]);
  
  // Get recommended digits based on day of week
  const getRecommendedDigits = (day: string): number[] => {
    switch (day) {
      case 'monday':
        return [0, 1];
      case 'tuesday':
        return [2, 3];
      case 'wednesday':
        return [4, 5];
      case 'thursday':
        return [6, 7];
      case 'friday':
        return [8, 9];
      case 'saturday':
        return [0, 5];
      case 'sunday':
        return [1, 6];
      default:
        return [];
    }
  };
  
  const recommendedDigits = getRecommendedDigits(dayOfWeek);
  
  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const day = e.target.value;
    setDayOfWeek(day);
    
    // Update filter criteria
    onChange({
      dayOfWeek: day,
      endingDigits: selectedDigits
    });
  };
  
  const handleDigitToggle = (digit: number) => {
    const newSelectedDigits = selectedDigits.includes(digit)
      ? selectedDigits.filter(d => d !== digit)
      : [...selectedDigits, digit];
    
    setSelectedDigits(newSelectedDigits);
    
    // Update filter criteria
    onChange({
      dayOfWeek,
      endingDigits: newSelectedDigits
    });
  };
  
  const handleSelectAll = () => {
    const allDigits = Array.from({ length: 10 }, (_, i) => i);
    setSelectedDigits(allDigits);
    
    // Update filter criteria
    onChange({
      dayOfWeek,
      endingDigits: allDigits
    });
  };
  
  const handleClearAll = () => {
    setSelectedDigits([]);
    
    // Update filter criteria
    onChange({
      dayOfWeek,
      endingDigits: []
    });
  };
  
  const handleSelectRecommended = () => {
    setSelectedDigits(recommendedDigits);
    
    // Update filter criteria
    onChange({
      dayOfWeek,
      endingDigits: recommendedDigits
    });
  };
  
  return (
    <FilterForm>
      <FormGroup>
        <Label><FaCalendarAlt /> Day of Week</Label>
        <Select value={dayOfWeek} onChange={handleDayChange}>
          <option value="">All Days</option>
          <option value="monday">Monday</option>
          <option value="tuesday">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
          <option value="sunday">Sunday</option>
        </Select>
      </FormGroup>
      
      <FormGroup>
        <Label><FaFilter /> Ending Digits</Label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button 
            onClick={handleSelectAll}
            style={{ 
              padding: '0.5rem', 
              fontSize: '0.75rem', 
              background: 'none',
              border: `1px solid ${selectedDigits.length === 10 ? '#FFD100' : '#dee2e6'}`,
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Select All
          </button>
          <button 
            onClick={handleClearAll}
            style={{ 
              padding: '0.5rem', 
              fontSize: '0.75rem', 
              background: 'none',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
          {dayOfWeek && recommendedDigits.length > 0 && (
            <button 
              onClick={handleSelectRecommended}
              style={{ 
                padding: '0.5rem', 
                fontSize: '0.75rem', 
                background: 'none',
                border: '1px solid #ffc107',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Recommended
            </button>
          )}
        </div>
        
        <DigitGrid>
          {Array.from({ length: 10 }, (_, i) => (
            <DigitButton 
              key={i}
              selected={selectedDigits.includes(i)}
              recommended={recommendedDigits.includes(i)}
              onClick={() => handleDigitToggle(i)}
            >
              {i}
            </DigitButton>
          ))}
        </DigitGrid>
        
        {dayOfWeek && recommendedDigits.length > 0 && (
          <RecommendedNote>
            <FaCheck style={{ color: '#ffc107' }} />
            Recommended digits for {dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}
          </RecommendedNote>
        )}
      </FormGroup>
    </FilterForm>
  );
};

export default DrawFilterForm;
