import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import styled from 'styled-components';
import { FaDice, FaFilter, FaPlay, FaTrophy, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaInfoCircle } from 'react-icons/fa'; // Added FaInfoCircle
import { useDemoMode } from '../context/DemoModeContext';
import { drawService } from '../services/draw.service';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import DrawWheel from '../components/draw/DrawWheel';
import Switch from './Switch';
import { Draw, Winner } from '../types/draw.types'; // Import types

// --- Mock Data (Keep for fallback/initial state if needed) ---
const MOCK_PRIZE_STRUCTURES = {
  daily: {
    jackpot: '₦1,000,000',
    second: '₦100,000',
    third: '₦50,000',
    consolation: '₦5,000 x 7 winners',
    total: '₦1,185,000',
  },
  saturday: {
    jackpot: '₦5,000,000',
    second: '₦250,000',
    third: '₦100,000',
    consolation: '₦10,000 x 7 winners',
    total: '₦5,420,000',
  },
};
// --- End Mock Data ---

const DrawManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const DrawHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const DrawTitle = styled.div`
  h2 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    margin: 0.5rem 0 0 0;
    color: ${props => props.theme.colors.gray600};
  }
`;

const DrawActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ScheduleToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray700};
`;

const DrawGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; // Keep 2 columns for now
  gap: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

// --- New Components/Styles ---
const ConfigurationCard = styled(Card)`
  // Styles for the configuration card
`;

const DateSelectionContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  select {
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.colors.gray300};
    border-radius: 4px;
    flex-grow: 1;
  }
`;

const PrizeStructureContainer = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.gray200};
  padding-top: 1.5rem;

  h4 {
    margin: 0 0 1rem 0;
    color: ${props => props.theme.colors.dark};
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      span:first-child {
        color: ${props => props.theme.colors.gray600};
      }
      span:last-child {
        font-weight: 600;
      }
    }
  }

  .total-prize {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed ${props => props.theme.colors.gray300};
    font-weight: 700;
    font-size: 1.1rem;
    display: flex;
    justify-content: space-between;
  }
`;

const LastDigitSelectionContainer = styled.div`
  margin-top: 1.5rem;
  h4 {
    margin: 0 0 1rem 0;
  }
  .digits {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .digit-button {
    padding: 0.5rem 1rem;
    border: 1px solid ${props => props.theme.colors.gray300};
    border-radius: 4px;
    cursor: pointer;
    background-color: white;
    &.selected {
      background-color: ${props => props.theme.colors.primary};
      color: white;
      border-color: ${props => props.theme.colors.primary};
    }
    &:disabled {
      background-color: ${props => props.theme.colors.gray200};
      cursor: not-allowed;
      opacity: 0.7;
    }
  }
  .action-buttons {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
  }
`;

const SummaryContainer = styled.div`
  margin-top: 1.5rem;
  background-color: ${props => props.theme.colors.gray100};
  padding: 1rem;
  border-radius: 4px;
  p {
    margin: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    span:first-child {
      color: ${props => props.theme.colors.gray700};
    }
    span:last-child {
      font-weight: 600;
    }
  }
`;

const StatusMessage = styled.div<{ type: 'info' | 'error' | 'success' }>`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  background-color: ${props => {
    switch (props.type) {
      case 'info': return props.theme.colors.info + '20';
      case 'error': return props.theme.colors.danger + '20';
      case 'success': return props.theme.colors.success + '20';
      default: return props.theme.colors.gray100;
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'info': return props.theme.colors.info;
      case 'error': return props.theme.colors.danger;
      case 'success': return props.theme.colors.success;
      default: return props.theme.colors.dark;
    }
  }};
`;

// --- End New Components/Styles ---

const NextDrawCard = styled(Card)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}15 0%, ${props => props.theme.colors.secondary}15 100%);
  border: 1px solid ${props => props.theme.colors.primary}30;
`;

const NextDrawHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${props => props.theme.colors.dark};
  }
`;

const NextDrawInfo = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const NextDrawDetail = styled.div`
  display: flex;
  flex-direction: column;

  .label {
    font-size: 0.875rem;
    color: ${props => props.theme.colors.gray600};
    margin-bottom: 0.25rem;
  }

  .value {
    font-size: 1.25rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const CountdownTimer = styled.div`
  background-color: ${props => props.theme.colors.dark};
  color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;

  .label {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    opacity: 0.8;
  }

  .time {
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: 2px;
  }
`;

// --- Winner Display Redesign ---
const WinnerResultsContainer = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.success}15 0%, ${props => props.theme.colors.info}15 100%);
  border: 1px solid ${props => props.theme.colors.success}30;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;

  h3 {
    margin: 0 0 1.5rem 0;
    color: ${props => props.theme.colors.success};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const WinnerTier = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px dashed ${props => props.theme.colors.gray300};

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .tier-title {
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
    color: ${props => props.theme.colors.dark};
  }

  .winner-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .msisdn {
    font-weight: 600;
    font-family: monospace;
  }

  .prize {
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
  }

  .status-indicators {
    display: flex;
    gap: 0.75rem;
    font-size: 0.8rem;
    color: ${props => props.theme.colors.gray600};

    .indicator {
      display: flex;
      align-items: center;
      gap: 0.25rem;

      &.valid {
        color: ${props => props.theme.colors.success};
      }
      &.invalid {
        color: ${props => props.theme.colors.danger};
      }
    }
  }
`;

const ConsolationWinnersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 150px; // Limit height for scrolling if many winners
  overflow-y: auto;

  li {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0;
    font-size: 0.9rem;

    .msisdn {
      font-family: monospace;
    }
    .prize {
      color: ${props => props.theme.colors.gray700};
    }
  }
`;
// --- End Winner Display Redesign ---

const DrawManagement: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingDraw, setIsFetchingDraw] = useState(false); // Added loading state for draw fetch
  const [fetchError, setFetchError] = useState<string | null>(null); // Added error state
  const [nextDraw, setNextDraw] = useState<any>(null); // Keep for countdown/next draw info
  const [currentDraw, setCurrentDraw] = useState<Draw | null>(null); // State for the selected date's draw

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [selectedDigits, setSelectedDigits] = useState<number[]>([]);
  const [useDefaultDigits, setUseDefaultDigits] = useState<boolean>(true); // Added state for default digits
  const [prizeStructure, setPrizeStructure] = useState<any>(MOCK_PRIZE_STRUCTURES.daily);
  const [dayOfWeek, setDayOfWeek] = useState<string>('');

  const [isDrawing, setIsDrawing] = useState(false);
  const [winnersData, setWinnersData] = useState<Winner[] | null>(null); // Use Winner type
  const [countdown, setCountdown] = useState<string>('00:00:00');
  const [isScheduleMode, setIsScheduleMode] = useState<boolean>(false);

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const getDayOfWeekString = (year: number, month: number, day: number): string => {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Mask MSISDN helper
  const maskMsisdn = (msisdn: string): string => {
    if (!msisdn || msisdn.length < 7) return msisdn; // Basic check
    return `${msisdn.substring(0, msisdn.length - 7)}****${msisdn.substring(msisdn.length - 3)}`;
  };

  // Fetch Draw Data based on selected date
  const fetchDrawData = useCallback(async () => {
    setIsFetchingDraw(true);
    setFetchError(null);
    setCurrentDraw(null); // Reset current draw
    setWinnersData(null); // Reset winners
    setSelectedDigits([]); // Reset digits
    setUseDefaultDigits(true); // Reset to default

    const dateStr = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    const dayName = getDayOfWeekString(selectedYear, selectedMonth, selectedDay);

    try {
      const [drawDetails, defaultDigits] = await Promise.all([
        drawService.getDrawByDate(dateStr),
        drawService.getDefaultEligibleDigits(dayName)
      ]);

      setCurrentDraw(drawDetails); // Can be null if no draw exists

      if (drawDetails) {
        // If a draw exists, use its digits and default setting
        setSelectedDigits(drawDetails.eligibleDigits || []);
        setUseDefaultDigits(drawDetails.useDefault);
      } else {
        // If no draw exists, use the fetched default digits
        setSelectedDigits(defaultDigits || []);
        setUseDefaultDigits(true);
      }

      // Fetch winners if the draw is completed
      if (drawDetails && drawDetails.status === 'COMPLETED' && drawDetails.id) {
        const winners = await drawService.getDrawWinners(drawDetails.id);
        setWinnersData(winners);
      }

    } catch (error: any) {
      console.error('Error fetching draw data:', error);
      setFetchError(`Failed to load draw data for ${dateStr}: ${error.message}`);
      // Fallback to default digits on error?
      try {
        const defaultDigits = await drawService.getDefaultEligibleDigits(dayName);
        setSelectedDigits(defaultDigits || []);
        setUseDefaultDigits(true);
      } catch (defaultDigitError) {
        console.error('Error fetching default digits after initial error:', defaultDigitError);
        setSelectedDigits([]); // Clear digits if defaults also fail
      }
    } finally {
      setIsFetchingDraw(false);
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  // Fetch initial data and data on date change
  useEffect(() => {
    fetchDrawData();
  }, [fetchDrawData]);

  // Update prize structure and day of week based on date
  useEffect(() => {
    try {
      const date = new Date(selectedYear, selectedMonth - 1, selectedDay);
      const dayIndex = date.getDay();
      const newDayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      setDayOfWeek(newDayOfWeek);

      if (dayIndex === 6) { // Saturday
        setPrizeStructure(MOCK_PRIZE_STRUCTURES.saturday);
      } else {
        setPrizeStructure(MOCK_PRIZE_STRUCTURES.daily);
      }
    } catch (e) {
      console.error("Invalid date selected");
      setDayOfWeek('');
      setPrizeStructure(MOCK_PRIZE_STRUCTURES.daily);
    }
  }, [selectedYear, selectedMonth, selectedDay]);

  // Fetch next draw info (mock for now)
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setNextDraw({
        id: 'next-draw',
        name: 'Daily Draw',
        date: new Date(Date.now() + 86400000).toISOString(),
        prize: '₦1,000,000',
        status: 'Scheduled'
      });
      setIsLoading(false);
    }, 500); // Reduced delay
  }, [isDemoMode]);

  // Countdown timer effect (unchanged)
  useEffect(() => {
    if (!nextDraw) return;
    const updateCountdown = () => {
      const now = new Date();
      const drawTime = new Date(nextDraw.date);
      const diff = drawTime.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown('00:00:00');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextDraw]);

  const handleDrawAction = async () => {
    setIsDrawing(true);
    setFetchError(null);
    setWinnersData(null);
    const dateStr = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    const dayName = getDayOfWeekString(selectedYear, selectedMonth, selectedDay);
    const drawType = dayName === 'Saturday' ? 'SATURDAY' : 'DAILY';

    try {
      if (isScheduleMode) {
        // Schedule Draw Logic
        console.log('Scheduling draw for:', dateStr, 'Type:', drawType, 'Digits:', selectedDigits, 'Use Default:', useDefaultDigits);
        const payload = {
          draw_date: dateStr,
          draw_type: drawType as ('DAILY' | 'SATURDAY'), // Added type assertion
          eligible_digits: useDefaultDigits ? undefined : selectedDigits,
          use_default: useDefaultDigits,
        };
        const scheduledDraw = await drawService.scheduleDraw(payload);
        setCurrentDraw(scheduledDraw);
        alert(`Draw successfully scheduled for ${dateStr} with ID: ${scheduledDraw.id}`);
        // Optionally refetch data
        // fetchDrawData();
      } else {
        // Execute Draw Now Logic
        let drawToExecute = currentDraw;

        // If no draw exists for the date, schedule it first
        if (!drawToExecute) {
          console.log('No draw found for today, scheduling first...');
          const payload = {
            draw_date: dateStr,
            draw_type: drawType as ('DAILY' | 'SATURDAY'), // Added type assertion
            eligible_digits: useDefaultDigits ? undefined : selectedDigits,
            use_default: useDefaultDigits,
          };
          drawToExecute = await drawService.scheduleDraw(payload);
          setCurrentDraw(drawToExecute);
          console.log('Draw scheduled with ID:', drawToExecute.id);
        }

        if (!drawToExecute || !drawToExecute.id) {
          throw new Error('Failed to schedule or find draw to execute.');
        }

        console.log('Executing draw with ID:', drawToExecute.id);
        await drawService.executeDraw(drawToExecute.id);
        console.log('Draw execution initiated. Fetching winners...');

        // Wait a moment for backend processing, then fetch winners
        setTimeout(async () => {
          try {
            const winners = await drawService.getDrawWinners(drawToExecute!.id);
            setWinnersData(winners);
            // Update current draw status locally (or refetch)
            setCurrentDraw(prev => prev ? { ...prev, status: 'COMPLETED' } : null);
          } catch (winnerError: any) {
            console.error('Error fetching winners:', winnerError);
            setFetchError(`Draw executed, but failed to fetch winners: ${winnerError.message}`);
          } finally {
             setIsDrawing(false); // Stop loading after attempting to fetch winners
          }
        }, 3000); // Adjust delay as needed
      }
    } catch (error: any) {
      console.error('Error during draw action:', error);
      setFetchError(`Operation failed: ${error.message}`);
      setIsDrawing(false); // Stop loading on error
    } finally {
      // Don't set isDrawing to false immediately if waiting for winners
      if (isScheduleMode) {
        setIsDrawing(false);
      }
      // Loading state is handled within the try/catch/finally blocks for execute mode
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value, 10));
    const days = getDaysInMonth(parseInt(e.target.value, 10), selectedMonth);
    if (selectedDay > days) setSelectedDay(days);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(e.target.value, 10));
    const days = getDaysInMonth(selectedYear, parseInt(e.target.value, 10));
    if (selectedDay > days) setSelectedDay(days);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(parseInt(e.target.value, 10));
  };

  const handleDigitClick = (digit: number) => {
    if (currentDraw && currentDraw.status !== 'SCHEDULED') return; // Don't allow changes if draw is not scheduled
    setUseDefaultDigits(false); // If manually changing, turn off default
    setSelectedDigits(prev =>
      prev.includes(digit) ? prev.filter(d => d !== digit) : [...prev, digit]
    );
  };

  const handleSelectAllDigits = () => {
    if (currentDraw && currentDraw.status !== 'SCHEDULED') return;
    setUseDefaultDigits(false);
    setSelectedDigits([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  };

  const handleClearAllDigits = () => {
    if (currentDraw && currentDraw.status !== 'SCHEDULED') return;
    setUseDefaultDigits(false);
    setSelectedDigits([]);
  };

  const handleUseDefaultToggle = () => {
    if (currentDraw && currentDraw.status !== 'SCHEDULED') return;
    const newUseDefault = !useDefaultDigits;
    setUseDefaultDigits(newUseDefault);
    if (newUseDefault) {
      // Refetch default digits for the day
      const dayName = getDayOfWeekString(selectedYear, selectedMonth, selectedDay);
      drawService.getDefaultEligibleDigits(dayName)
        .then(digits => setSelectedDigits(digits || []))
        .catch(err => {
          console.error("Failed to fetch default digits on toggle:", err);
          setSelectedDigits([]); // Clear if fetch fails
        });
    } else {
      // Optionally clear digits when switching to manual, or keep current selection
      // setSelectedDigits([]);
    }
  };

  // Determine if configuration should be disabled
  const isConfigDisabled = isFetchingDraw || isDrawing || (currentDraw && currentDraw.status !== 'SCHEDULED');

  if (isLoading) {
    return (
      <PageLayout title="Draw Management">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <LoadingSpinner size={60} />
        </div>
      </PageLayout>
    );
  }

  const daysInSelectedMonth = getDaysInMonth(selectedYear, selectedMonth);

  return (
    <PageLayout title="Draw Management">
      <DrawManagementContainer>
        <DrawHeader>
          <DrawTitle>
            <h2><FaDice /> Draw Management</h2>
            <p>Configure, schedule, and conduct draws for the MyNumba Don Win promotion</p>
          </DrawTitle>

          <DrawActions>
            <ScheduleToggle>
              <span>Schedule Draw?</span>
              <Switch
                isActive={isScheduleMode}
                onToggle={() => setIsScheduleMode(!isScheduleMode)}
              />
            </ScheduleToggle>
            <Button
              onClick={handleDrawAction}
              disabled={!!(isDrawing || isFetchingDraw || (currentDraw && currentDraw.status !== 'SCHEDULED' && !isScheduleMode) || (currentDraw && isScheduleMode))} // Disable if fetching, drawing, or draw exists and is not scheduled (unless scheduling) - Wrapped with !!
              startIcon={isScheduleMode ? <FaCalendarAlt /> : <FaPlay />}
            >
              {isDrawing ? 'Processing...' : (isScheduleMode ? 'Schedule Draw' : 'Execute Draw Now')}
            </Button>
          </DrawActions>
        </DrawHeader>

        {fetchError && <StatusMessage type="error"><FaTimesCircle /> {fetchError}</StatusMessage>}

        <DrawGrid>
          <ConfigurationCard>
            <h3><FaFilter /> Draw Configuration</h3>
            <DateSelectionContainer>
              <select value={selectedMonth} onChange={handleMonthChange} disabled={!!isConfigDisabled}> {/* Fixed */} 
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleDateString('en-US', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select value={selectedDay} onChange={handleDayChange} disabled={!!isConfigDisabled}> {/* Fixed */} 
                {[...Array(daysInSelectedMonth)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <select value={selectedYear} onChange={handleYearChange} disabled={!!isConfigDisabled}> {/* Fixed */} 
                {[...Array(5)].map((_, i) => (
                  <option key={currentYear - 2 + i} value={currentYear - 2 + i}>{currentYear - 2 + i}</option>
                ))}
              </select>
            </DateSelectionContainer>

            {isFetchingDraw && <LoadingSpinner size={20} />} 

            {currentDraw && (
              <StatusMessage type="info">
                <FaInfoCircle /> Draw for this date already exists (Status: {currentDraw.status}). Configuration locked unless status is 'SCHEDULED'.
              </StatusMessage>
            )}

            <LastDigitSelectionContainer>
              <h4>Select Eligible Last Digits</h4>
              <ScheduleToggle style={{ marginBottom: '1rem' }}>
                <span>Use Default Digits for {dayOfWeek}?</span>
                <Switch
                  isActive={useDefaultDigits}
                  onToggle={handleUseDefaultToggle}
                  disabled={!!isConfigDisabled} /* Fixed */ 
                />
              </ScheduleToggle>
              <div className="digits">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                  <button
                    key={digit}
                    className={`digit-button ${selectedDigits.includes(digit) ? 'selected' : ''}`}
                    onClick={() => handleDigitClick(digit)}
                    disabled={!!(isConfigDisabled || useDefaultDigits)} /* Fixed */ 
                  >
                    {digit}
                  </button>
                ))}
              </div>
              <div className="action-buttons">
                <Button variant="secondary" size="small" onClick={handleSelectAllDigits} disabled={!!(isConfigDisabled || useDefaultDigits)}>Select All</Button> {/* Fixed */} 
                <Button variant="secondary" size="small" onClick={handleClearAllDigits} disabled={!!(isConfigDisabled || useDefaultDigits)}>Clear All</Button> {/* Fixed */} 
              </div>
            </LastDigitSelectionContainer>

            <PrizeStructureContainer>
              <h4>Prize Structure ({dayOfWeek === 'Saturday' ? 'Saturday' : 'Daily'})</h4>
              <ul>
                <li><span>Jackpot</span> <span>{prizeStructure.jackpot}</span></li>
                <li><span>2nd Prize</span> <span>{prizeStructure.second}</span></li>
                <li><span>3rd Prize</span> <span>{prizeStructure.third}</span></li>
                <li><span>Consolation</span> <span>{prizeStructure.consolation}</span></li>
              </ul>
              <div className="total-prize">
                <span>Total Prize Pool</span>
                <span>{prizeStructure.total}</span>
              </div>
            </PrizeStructureContainer>

            <SummaryContainer>
              <p><span>Selected Date:</span> <span>{`${selectedDay.toString().padStart(2, '0')}/${selectedMonth.toString().padStart(2, '0')}/${selectedYear}`} ({dayOfWeek})</span></p>
              <p><span>Eligible Digits:</span> <span>{selectedDigits.length === 0 ? 'None' : (selectedDigits.length === 10 ? 'All' : selectedDigits.join(', '))} {useDefaultDigits ? '(Default)' : ''}</span></p>
              <p><span>Draw Status:</span> <span>{isFetchingDraw ? 'Loading...' : (currentDraw ? currentDraw.status : 'Not Scheduled')}</span></p>
            </SummaryContainer>

          </ConfigurationCard>

          <NextDrawCard>
            {/* Keep Next Draw Info / Countdown as before (mocked) */} 
            {nextDraw ? (
              <>
                <NextDrawHeader>
                  <h3><FaClock /> Next Scheduled Draw</h3>
                  {/* <Button variant="secondary" size="small">View History</Button> */}
                </NextDrawHeader>
                <CountdownTimer>
                  <div className="label">Time Remaining</div>
                  <div className="time">{countdown}</div>
                </CountdownTimer>
                <NextDrawInfo>
                  <NextDrawDetail>
                    <span className="label">Date</span>
                    <span className="value"><FaCalendarAlt /> {new Date(nextDraw.date).toLocaleDateString()}</span>
                  </NextDrawDetail>
                  <NextDrawDetail>
                    <span className="label">Jackpot</span>
                    <span className="value"><FaTrophy /> {nextDraw.prize}</span>
                  </NextDrawDetail>
                </NextDrawInfo>
              </>
            ) : (
              <p>Loading next draw information...</p>
            )}

            {/* Draw Wheel / Winner Display */} 
            {isDrawing && !winnersData && (
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <LoadingSpinner size={40} />
                <p>Executing Draw...</p>
                {/* Optionally show DrawWheel component here */} 
                {/* <DrawWheel isSpinning={isDrawing} /> */}
              </div>
            )}

            {winnersData && winnersData.length > 0 && (
              <WinnerResultsContainer>
                <h3><FaTrophy /> Draw Results</h3>
                {/* Assuming winnersData is an array of Winner objects */} 
                {winnersData.filter(w => w.prizeCategory === 'JACKPOT').map(winner => (
                  <WinnerTier key={winner.id}>
                    <div className="tier-title">Jackpot Winner</div>
                    <div className="winner-info">
                      <span className="msisdn">{maskMsisdn(winner.msisdn)}</span>
                      <div className="status-indicators">
                        <span className={`indicator ${winner.isOptedIn ? 'valid' : 'invalid'}`}>
                          {winner.isOptedIn ? <FaCheckCircle /> : <FaTimesCircle />} Opted-In
                        </span>
                        <span className={`indicator ${winner.isValid ? 'valid' : 'invalid'}`}>
                          {winner.isValid ? <FaCheckCircle /> : <FaTimesCircle />} Valid Win
                        </span>
                      </div>
                      <span className="prize">₦{winner.prizeAmount.toLocaleString()}</span>
                    </div>
                  </WinnerTier>
                ))}
                {/* Add similar sections for 2nd, 3rd prizes if they exist in Winner model */} 
                {/* Example for Consolation */} 
                <WinnerTier>
                  <div className="tier-title">Consolation Winners</div>
                  <ConsolationWinnersList>
                    {winnersData.filter(w => w.prizeCategory === 'CONSOLATION').map(winner => (
                      <li key={winner.id}>
                        <span className="msisdn">{maskMsisdn(winner.msisdn)}</span>
                        <span className="prize">₦{winner.prizeAmount.toLocaleString()}</span>
                      </li>
                    ))}
                  </ConsolationWinnersList>
                </WinnerTier>
              </WinnerResultsContainer>
            )}
            {winnersData && winnersData.length === 0 && (
                 <StatusMessage type="info">
                    <FaInfoCircle /> Draw executed, but no winners were found for the selected criteria.
                 </StatusMessage>
            )}

          </NextDrawCard>
        </DrawGrid>
      </DrawManagementContainer>
    </PageLayout>
  );
};

export default DrawManagement;



