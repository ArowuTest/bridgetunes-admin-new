import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaDice, FaFilter, FaPlay, FaTrophy, FaCalendarAlt, FaLock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaEdit, FaSave, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { useDemoMode } from '../context/DemoModeContext';
import { drawService } from '../services/draw.service'; // Assuming updated service file
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import DrawWheel from '../components/draw/DrawWheel';
import Switch from './Switch';
import { Draw, Winner, Prize } from '../types/draw.types'; // Import Prize type

// --- Mock Data (Keep for fallback/initial state if needed) ---
const MOCK_PRIZE_STRUCTURES_LEGACY_FORMAT = {
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

const MOCK_DRAWS: Draw[] = [
    {
    id: 'draw1',
    drawDate: '2024-05-01T10:00:00.000Z', // Corrected to string
    drawType: 'daily',
    status: 'completed',
    eligibleDigits: [1, 2, 3],
    useDefault: true, // Added to match type
    jackpotAmount: 1000000,
    rolloverAmount: 0,
    winners: [
      { id: 'win1', msisdn: '2348031234567', prizeCategory: 'jackpot', prizeAmount: 1000000, drawId: 'draw1', winDate: '2024-05-01T10:00:00.000Z', isOptedIn: true, isValid: true, claimStatus: 'Pending', createdAt: new Date().toISOString() }, // Corrected field name and added missing fields
      { id: 'win2', msisdn: '2348037654321', prizeCategory: 'consolation', prizeAmount: 5000, drawId: 'draw1', winDate: '2024-05-01T10:00:00.000Z', isOptedIn: true, isValid: true, claimStatus: 'Paid', createdAt: new Date().toISOString() }, // Corrected field name and added missing fields
      { id: 'win3', msisdn: '2349098765432', prizeCategory: 'consolation', prizeAmount: 5000, drawId: 'draw1', winDate: '2024-05-01T10:00:00.000Z', isOptedIn: false, isValid: true, claimStatus: 'Pending', createdAt: new Date().toISOString() }, // Corrected field name and added missing fields
    ],
    participantsPoolA: 1500,
    participantsPoolB: 5000,
    createdAt: new Date().toISOString(), // Corrected to string
    updatedAt: new Date().toISOString(), // Corrected to string
    executionLog: 'Draw started.\nSelected jackpot winner: 2348031234567.\nSelected consolation winners: 2348037654321, 2349098765432.\nDraw completed successfully.',
    jackpotWinnerValidationStatus: 'Valid',
    errorMessage: undefined, // Ensure error message is handled
  },
  {
    id: 'draw2',
    drawDate: '2024-05-02T10:00:00.000Z', // Corrected to string
    drawType: 'daily',
    status: 'scheduled',
    eligibleDigits: [4, 5, 6],
    useDefault: true, // Added to match type
    jackpotAmount: 1000000,
    rolloverAmount: 0,
    winners: [],
    participantsPoolA: 0,
    participantsPoolB: 0,
    createdAt: new Date().toISOString(), // Corrected to string
    updatedAt: new Date().toISOString(), // Corrected to string
  },
    {
    id: 'draw3',
    drawDate: '2024-05-04T10:00:00.000Z', // Corrected to string
    drawType: 'saturday',
    status: 'scheduled',
    eligibleDigits: [7, 8, 9],
    useDefault: true, // Added to match type
    jackpotAmount: 5000000,
    rolloverAmount: 150000, // Example rollover
    winners: [],
    participantsPoolA: 0,
    participantsPoolB: 0,
    createdAt: new Date().toISOString(), // Corrected to string
    updatedAt: new Date().toISOString(), // Corrected to string
  },
];

// Helper to convert API prize structure (array) to UI format (object)
const formatPrizeStructureForUI = (prizes: Prize[]) => {
  const uiStructure: any = {};
  prizes.forEach(prize => {
    if (prize.category === 'consolation') {
      uiStructure[prize.category] = `₦${prize.amount.toLocaleString()} x ${prize.numWinners || 1} winners`; // Use numWinners
    } else if (prize.category === 'jackpot' || prize.category === 'second' || prize.category === 'third') {
      uiStructure[prize.category] = `₦${prize.amount.toLocaleString()}`;
    }
    // Add other categories if needed
  });
  // Calculate total (optional, can be done in UI)
  // uiStructure.total = `₦${prizes.reduce((sum, p) => sum + (p.amount * p.count), 0).toLocaleString()}`;
  return uiStructure;
};

// Helper to convert UI format (object) back to API payload (array)
const formatPrizeStructureForAPI = (uiStructure: any, drawType: 'daily' | 'saturday'): Prize[] => {
  const prizes: Prize[] = [];

  const parseAmount = (value: string | undefined): number => parseInt(value?.replace(/[^0-9]/g, '') || '0');

  if (uiStructure.jackpot) {
    prizes.push({ category: 'jackpot', amount: parseAmount(uiStructure.jackpot), numWinners: 1 }); // Use numWinners
  }
  if (uiStructure.second) {
    prizes.push({ category: 'second', amount: parseAmount(uiStructure.second), numWinners: 1 }); // Use numWinners
  }
  if (uiStructure.third) {
    prizes.push({ category: 'third', amount: parseAmount(uiStructure.third), numWinners: 1 }); // Use numWinners
  }
  if (uiStructure.consolation) {
    const amountMatch = uiStructure.consolation.match(/₦([0-9,]+)/)?.[1];
    const countMatch = uiStructure.consolation.match(/x ([0-9]+)/)?.[1];
    prizes.push({
      category: 'consolation',
      amount: parseAmount(amountMatch),
      numWinners: parseInt(countMatch || '0') // Use numWinners
    });
  }

  return prizes.filter(p => p.amount > 0 && p.numWinners && p.numWinners > 0); // Filter out invalid entries, use numWinners
};

// Helper function to mask MSISDN (e.g., 234803****567)
const maskMsisdn = (msisdn: string | undefined): string => {
  if (!msisdn || msisdn.length < 10) return msisdn || 'N/A'; // Basic validation
  // Keep first 6 and last 3 digits
  return `${msisdn.substring(0, 6)}****${msisdn.substring(msisdn.length - 3)}`;
};


// --- Styled Components ---
const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow controls to wrap on smaller screens */
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const DatePicker = styled(FilterInput).attrs({ type: 'date' })``;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  padding: 12px 8px;
  text-align: left;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
`;

const Td = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 10px 8px;
  vertical-align: middle; /* Align content vertically */
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.light};
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  color: white;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'scheduled': return theme.colors.info;
      case 'running': return theme.colors.warning;
      case 'completed': return theme.colors.success;
      case 'failed': return theme.colors.danger;
      default: return theme.colors.secondary;
    }
  }};
`;

const ActionButton = styled(Button)`
  padding: 5px 10px;
  font-size: 0.9em;
  margin-right: 5px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 5px;
  font-size: 1.1em;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  color: ${({ theme }) => theme.colors.text};
`;

const ModalHeader = styled.h2`
  margin-top: 0;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
`;

const ModalFooter = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const WinnerList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
`;

const WinnerItem = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-size: 0.9em;
`;

const LogContainer = styled.pre`
  background-color: ${({ theme }) => theme.colors.light};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 10px;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap; /* Wrap long lines */
  word-wrap: break-word;
  font-size: 0.9em;
`;

// --- Component ---
const DrawManagement: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const [draws, setDraws] = useState<Draw[]>([]);
  const [filteredDraws, setFilteredDraws] = useState<Draw[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrizes, setIsLoadingPrizes] = useState(false); // Separate loading for prizes
  const [error, setError] = useState<string | null>(null);
  const [prizeError, setPrizeError] = useState<string | null>(null); // Separate error for prizes
  const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Schedule Draw State
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleType, setScheduleType] = useState('daily');
  const [scheduleDigits, setScheduleDigits] = useState('');
  const [scheduleUseDefault, setScheduleUseDefault] = useState(true);

  // Prize Structure State
  // Store the API response format { daily: Prize[], saturday: Prize[] }
  const [apiPrizeStructures, setApiPrizeStructures] = useState<{ daily: Prize[], saturday: Prize[] } | null>(null);
  const [editingPrizeType, setEditingPrizeType] = useState<'daily' | 'saturday' | null>(null);
  // Store the UI format for editing { jackpot: '₦...', second: '₦...', ... }
  const [editablePrizesUI, setEditablePrizesUI] = useState<any>(null);

  // Fetch Draws Function
  const fetchDraws = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let fetchedDraws: Draw[];
      if (isDemoMode) {
        console.log("Demo Mode: Using mock draws");
        // Use the mock data defined above, ensuring dates are strings
        fetchedDraws = MOCK_DRAWS.map(draw => ({
          ...draw,
          // Ensure all date fields are strings if Draw type expects strings
          drawDate: typeof draw.drawDate === 'object' ? (draw.drawDate as Date).toISOString() : draw.drawDate,
          createdAt: typeof draw.createdAt === 'object' ? (draw.createdAt as Date).toISOString() : draw.createdAt,
          updatedAt: typeof draw.updatedAt === 'object' ? (draw.updatedAt as Date).toISOString() : draw.updatedAt,
          winners: draw.winners?.map(winner => ({
            ...winner,
            winDate: typeof winner.winDate === 'object' ? (winner.winDate as Date).toISOString() : winner.winDate, // Use winDate
            createdAt: typeof winner.createdAt === 'object' ? (winner.createdAt as Date).toISOString() : winner.createdAt,
          }))
        }));
      } else {
        console.log("Fetching draws from API...");
        fetchedDraws = await drawService.getDraws();
      }
      // Sort after fetching and potential type conversion
      fetchedDraws.sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime());
      setDraws(fetchedDraws);
      setFilteredDraws(fetchedDraws);
    } catch (err: any) {
      console.error("Error fetching draws:", err);
      setError(`Failed to fetch draws: ${err.message}. Using mock data.`);
      // Use the mock data defined above, ensuring dates are strings
      const mockDrawsWithStringDates = MOCK_DRAWS.map(draw => ({
        ...draw,
        drawDate: typeof draw.drawDate === 'object' ? (draw.drawDate as Date).toISOString() : draw.drawDate,
        createdAt: typeof draw.createdAt === 'object' ? (draw.createdAt as Date).toISOString() : draw.createdAt,
        updatedAt: typeof draw.updatedAt === 'object' ? (draw.updatedAt as Date).toISOString() : draw.updatedAt,
        winners: draw.winners?.map(winner => ({
          ...winner,
          winDate: typeof winner.winDate === 'object' ? (winner.winDate as Date).toISOString() : winner.winDate, // Use winDate
          createdAt: typeof winner.createdAt === 'object' ? (winner.createdAt as Date).toISOString() : winner.createdAt,
        }))
      }));
      mockDrawsWithStringDates.sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime());
      setDraws(mockDrawsWithStringDates);
      setFilteredDraws(mockDrawsWithStringDates);
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode]);

  // Fetch Prize Structures Function
  const fetchPrizeStructures = useCallback(async () => {
    setIsLoadingPrizes(true);
    setPrizeError(null);
    try {
      let fetchedStructures;
      if (isDemoMode) {
        console.log("Demo Mode: Using mock prize structures (legacy format)");
        fetchedStructures = {
          daily: formatPrizeStructureForAPI(MOCK_PRIZE_STRUCTURES_LEGACY_FORMAT.daily, 'daily'),
          saturday: formatPrizeStructureForAPI(MOCK_PRIZE_STRUCTURES_LEGACY_FORMAT.saturday, 'saturday'),
        };
      } else {
        console.log("Fetching prize structures from API...");
        fetchedStructures = await drawService.getPrizeStructure();
      }
      setApiPrizeStructures(fetchedStructures);
    } catch (err: any) {
      console.error("Error fetching prize structures:", err);
      setPrizeError(`Failed to fetch prize structures: ${err.message}. Editing may use defaults.`);
      setApiPrizeStructures({
          daily: formatPrizeStructureForAPI(MOCK_PRIZE_STRUCTURES_LEGACY_FORMAT.daily, 'daily'),
          saturday: formatPrizeStructureForAPI(MOCK_PRIZE_STRUCTURES_LEGACY_FORMAT.saturday, 'saturday'),
        });
    } finally {
      setIsLoadingPrizes(false);
    }
  }, [isDemoMode]);

  // Initial Fetch for both Draws and Prizes
  useEffect(() => {
    fetchDraws();
    fetchPrizeStructures();
  }, [fetchDraws, fetchPrizeStructures]);

  // Apply Filters
  useEffect(() => {
    let result = draws;
    if (filterDate) {
      // Ensure comparison is done correctly (string vs string or Date vs Date)
      const filterDateObj = new Date(filterDate);
      result = result.filter(draw => new Date(draw.drawDate).toDateString() === filterDateObj.toDateString());
    }
    if (filterType) {
      result = result.filter(draw => draw.drawType === filterType);
    }
    if (filterStatus) {
      result = result.filter(draw => draw.status === filterStatus);
    }
    setFilteredDraws(result);
  }, [filterDate, filterType, filterStatus, draws]);

  // --- Event Handlers ---
  const handleFilterChange = () => {
    // Triggered by filter input changes, useEffect handles the filtering
  };

  const handleClearFilters = () => {
    setFilterDate('');
    setFilterType('');
    setFilterStatus('');
  };

  const handleViewDetails = (draw: Draw) => {
    setSelectedDraw(draw);
    setIsDetailModalOpen(true);
  };

  const handleExecuteDraw = async (drawId: string) => {
    if (!window.confirm('Are you sure you want to execute this draw? This action cannot be undone.')) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (isDemoMode) {
        console.log(`Demo Mode: Simulating execution for draw ${drawId}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Update mock data, ensuring dates remain strings
        const updatedMockDraws = draws.map(d =>
          d.id === drawId ? { ...d, status: 'completed', executionLog: 'Demo draw executed successfully.', winners: MOCK_DRAWS[0].winners?.map(w => ({...w, winDate: '2024-05-01T10:00:00.000Z', createdAt: new Date().toISOString()})) } : d // Use d.id and fix winner mapping
        );
        setDraws(updatedMockDraws);
        // Apply filters again if necessary, or just update filteredDraws directly
        setFilteredDraws(updatedMockDraws.filter(d => {
            let match = true;
            if (filterDate) match = match && new Date(d.drawDate).toDateString() === new Date(filterDate).toDateString();
            if (filterType) match = match && d.drawType === filterType;
            if (filterStatus) match = match && d.status === filterStatus;
            return match;
        }));

      } else {
        console.log(`Executing draw ${drawId} via API...`);
        await drawService.executeDraw(drawId);
        await fetchDraws(); // Re-fetch draws
      }
      alert('Draw executed successfully!');
    } catch (err: any) {
      console.error(`Error executing draw ${drawId}:`, err);
      setError(`Failed to execute draw ${drawId}: ${err.message}`);
      alert(`Failed to execute draw ${drawId}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleDraw = async () => {
    if (!scheduleDate || !scheduleType || (!scheduleUseDefault && !scheduleDigits)) {
      alert('Please fill in all required fields for scheduling.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        draw_date: new Date(scheduleDate).toISOString().split('T')[0], // Send YYYY-MM-DD
        draw_type: scheduleType.toUpperCase() as 'DAILY' | 'SATURDAY',
        eligible_digits: scheduleUseDefault ? undefined : scheduleDigits.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)),
        use_default: scheduleUseDefault,
      };
      if (isDemoMode) {
        console.log("Demo Mode: Simulating schedule draw", payload);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newDraw: Draw = {
          id: `mock_draw_${Date.now()}`, // Use id instead of _id
          drawDate: new Date(scheduleDate + 'T10:00:00Z').toISOString(), // Store as string
          drawType: scheduleType as 'daily' | 'saturday',
          status: 'scheduled',
          eligibleDigits: scheduleUseDefault ? [] : scheduleDigits.split(",").map(d => parseInt(d.trim())).filter(n => !isNaN(n)), // Parse string to number[] or send empty array for default
          jackpotAmount: scheduleType === 'daily' ? 1000000 : 5000000,
          rolloverAmount: 0,
          winners: [],
          participantsPoolA: 0,
          useDefault: scheduleUseDefault, // Added missing field
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedDraws = [newDraw, ...draws].sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime());
        setDraws(updatedDraws);
        setFilteredDraws(updatedDraws); // Update filtered list too
      } else {
        console.log("Scheduling draw via API...", payload);
        await drawService.scheduleDraw(payload);
        await fetchDraws(); // Re-fetch draws
      }
      alert('Draw scheduled successfully!');
      setIsScheduleModalOpen(false);
      // Reset schedule form
      setScheduleDate('');
      setScheduleType('daily');
      setScheduleDigits('');
      setScheduleUseDefault(true);
    } catch (err: any) {
      console.error("Error scheduling draw:", err);
      setError(`Failed to schedule draw: ${err.message}`);
      alert(`Failed to schedule draw: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPrizeModal = (type: 'daily' | 'saturday') => {
    if (!apiPrizeStructures) {
      setPrizeError("Prize structures not loaded yet. Please wait or try refreshing.");
      return;
    }
    setEditingPrizeType(type);
    // Convert the specific structure from API format (array) to UI format (object)
    const structureToEdit = type === 'daily' ? apiPrizeStructures.daily : apiPrizeStructures.saturday;
    setEditablePrizesUI(formatPrizeStructureForUI(structureToEdit));
    setIsPrizeModalOpen(true);
  };

  const handlePrizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditablePrizesUI((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSavePrizeStructure = async () => {
    if (!editingPrizeType || !editablePrizesUI) return;

    setIsLoadingPrizes(true);
    setPrizeError(null);
    try {
      // Convert UI format back to API payload format (array)
      const apiPayload = formatPrizeStructureForAPI(editablePrizesUI, editingPrizeType);

      if (isDemoMode) {
        console.log(`Demo Mode: Simulating update prize structure for ${editingPrizeType}`, apiPayload);
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Update the mock structure locally
        setApiPrizeStructures(prev => prev ? {
          ...prev,
          [editingPrizeType]: apiPayload
        } : null);
      } else {
        console.log(`Updating prize structure for ${editingPrizeType} via API...`, apiPayload);
        await drawService.updatePrizeStructure(editingPrizeType, apiPayload);
        await fetchPrizeStructures(); // Re-fetch to confirm
      }
      alert('Prize structure updated successfully!');
      setIsPrizeModalOpen(false);
      setEditingPrizeType(null);
      setEditablePrizesUI(null);
    } catch (err: any) {
      console.error(`Error updating prize structure for ${editingPrizeType}:`, err);
      setPrizeError(`Failed to update prize structure: ${err.message}`);
      alert(`Failed to update prize structure: ${err.message}`);
    } finally {
      setIsLoadingPrizes(false);
    }
  };

  // --- Render --- 
  return (
    <PageLayout>
      <Container>
        <Header>
          <Title>Draw Management</Title>
          <div>
            <Button onClick={() => handleOpenPrizeModal('daily')} disabled={isLoadingPrizes}><FaEdit /> Edit Daily Prizes</Button>
            <Button onClick={() => handleOpenPrizeModal('saturday')} disabled={isLoadingPrizes} style={{ marginLeft: '10px' }}><FaEdit /> Edit Saturday Prizes</Button>
            <Button onClick={() => setIsScheduleModalOpen(true)} style={{ marginLeft: '10px' }}><FaCalendarAlt /> Schedule New Draw</Button>
          </div>
        </Header>

        <Card>
          <Controls>
            <DatePicker value={filterDate} onChange={e => setFilterDate(e.target.value)} />
            <Select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              <option value="daily">Daily</option>
              <option value="saturday">Saturday</option>
            </Select>
            <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </Select>
            <Button onClick={handleClearFilters}><FaFilter /> Clear Filters</Button>
          </Controls>

          {isLoading && <LoadingSpinner />} 
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!isLoading && (
            <Table>
              <thead>
                <tr>
                  <Th>Draw Date</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                  <Th>Eligible Digits</Th>
                  <Th>Jackpot (₦)</Th>
                  <Th>Rollover (₦)</Th>
                  <Th>Winners</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredDraws.map((draw) => (
                  <Tr key={draw._id}>
                    <Td>{new Date(draw.drawDate).toLocaleString()}</Td>
                    <Td>{draw.drawType}</Td>
                    <Td><StatusBadge status={draw.status}>{draw.status}</StatusBadge></Td>
                    <Td>{draw.eligibleDigits}</Td>
                    <Td>{draw.jackpotAmount?.toLocaleString()}</Td>
                    <Td>{draw.rolloverAmount?.toLocaleString()}</Td>
                    <Td>{draw.winners?.length ?? 0}</Td>
                    <Td>
                      <IconButton onClick={() => handleViewDetails(draw)} title="View Details"><FaTrophy /></IconButton>
                      {draw.status === 'scheduled' && (
                        <IconButton onClick={() => handleExecuteDraw(draw._id)} title="Execute Draw" disabled={isLoading}><FaPlay /></IconButton>
                      )}
                      {/* Add other actions like cancel if needed */}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        {/* Draw Detail Modal */}
        {isDetailModalOpen && selectedDraw && (
          <ModalOverlay onClick={() => setIsDetailModalOpen(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>Draw Details - {new Date(selectedDraw.drawDate).toLocaleDateString()}</ModalHeader>
              <p><strong>ID:</strong> {selectedDraw._id}</p>
              <p><strong>Type:</strong> {selectedDraw.drawType}</p>
              <p><strong>Status:</strong> <StatusBadge status={selectedDraw.status}>{selectedDraw.status}</StatusBadge></p>
              <p><strong>Eligible Digits:</strong> {selectedDraw.eligibleDigits}</p>
              <p><strong>Jackpot Amount:</strong> ₦{selectedDraw.jackpotAmount?.toLocaleString()}</p>
              <p><strong>Rollover Amount:</strong> ₦{selectedDraw.rolloverAmount?.toLocaleString()}</p>
              <p><strong>Pool A Participants:</strong> {selectedDraw.participantsPoolA ?? 'N/A'}</p>
              <p><strong>Pool B Participants:</strong> {selectedDraw.participantsPoolB ?? 'N/A'}</p>
              <p><strong>Jackpot Winner Validation:</strong> {selectedDraw.jackpotWinnerValidationStatus ?? 'N/A'}</p>
              
              {selectedDraw.errorMessage && (
                  <div>
                      <strong>Error Message:</strong>
                      <LogContainer>{selectedDraw.errorMessage}</LogContainer>
                  </div>
              )}
              {selectedDraw.executionLog && (
                  <div>
                      <strong>Execution Log:</strong>
                      <LogContainer>{selectedDraw.executionLog}</LogContainer>
                  </div>
              )}

              <strong>Winners ({selectedDraw.winners?.length ?? 0}):</strong>
              {selectedDraw.winners && selectedDraw.winners.length > 0 ? (
                <WinnerList>
                  {selectedDraw.winners.map(winner => (
                    <WinnerItem key={winner._id}>
                      {winner.prizeCategory.toUpperCase()}: {maskMsisdn(winner.msisdn)} - ₦{winner.prizeAmount.toLocaleString()} ({winner.claimStatus})
                    </WinnerItem>
                  ))}
                </WinnerList>
              ) : (
                <p>No winners selected for this draw.</p>
              )}

              <ModalFooter>
                <Button onClick={() => setIsDetailModalOpen(false)}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Schedule Draw Modal */}
        {isScheduleModalOpen && (
          <ModalOverlay onClick={() => setIsScheduleModalOpen(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>Schedule New Draw</ModalHeader>
              <div>
                <label>Draw Date:</label>
                <DatePicker value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} required />
              </div>
              <div style={{ marginTop: '10px' }}>
                <label>Draw Type:</label>
                <Select value={scheduleType} onChange={e => setScheduleType(e.target.value)} required>
                  <option value="daily">Daily</option>
                  <option value="saturday">Saturday</option>
                </Select>
              </div>
              <div style={{ marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center' }}>
                  Use Default Eligible Digits:
                  <Switch 
                    checked={scheduleUseDefault} 
                    onChange={() => setScheduleUseDefault(!scheduleUseDefault)} 
                  />
                </label>
              </div>
              {!scheduleUseDefault && (
                <div style={{ marginTop: '10px' }}>
                  <label>Eligible Digits (comma-separated):</label>
                  <FilterInput 
                    value={scheduleDigits} 
                    onChange={e => setScheduleDigits(e.target.value)} 
                    placeholder="e.g., 1, 5, 9" 
                    required={!scheduleUseDefault}
                  />
                </div>
              )}
              <ModalFooter>
                <Button onClick={() => setIsScheduleModalOpen(false)} variant="secondary">Cancel</Button>
                <Button onClick={handleScheduleDraw} disabled={isLoading}>Schedule Draw</Button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Edit Prize Structure Modal */}
        {isPrizeModalOpen && editingPrizeType && editablePrizesUI && (
          <ModalOverlay onClick={() => setIsPrizeModalOpen(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>Edit {editingPrizeType === 'daily' ? 'Daily' : 'Saturday'} Prize Structure</ModalHeader>
              {isLoadingPrizes && <LoadingSpinner />}
              {prizeError && <p style={{ color: 'red' }}>{prizeError}</p>}
              {!isLoadingPrizes && (
                <>
                  {/* Dynamically create inputs based on expected categories */}
                  {Object.keys(editablePrizesUI).map(category => (
                     <div key={category} style={{ marginBottom: '10px' }}>
                       <label style={{ textTransform: 'capitalize', marginRight: '10px' }}>{category}:</label>
                       <FilterInput 
                         name={category} 
                         value={editablePrizesUI[category] || ''} 
                         onChange={handlePrizeInputChange} 
                         placeholder={category === 'consolation' ? 'e.g., ₦5,000 x 7 winners' : 'e.g., ₦1,000,000'} 
                       />
                     </div>
                  ))}
                  {/* Add button to add new prize category if needed */}
                  {/* <Button size="small" onClick={handleAddPrizeCategory}><FaPlusCircle /> Add Category</Button> */}
                  <ModalFooter>
                    <Button onClick={() => setIsPrizeModalOpen(false)} variant="secondary">Cancel</Button>
                    <Button onClick={handleSavePrizeStructure} disabled={isLoadingPrizes}>Save Changes</Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </ModalOverlay>
        )}

      </Container>
    </PageLayout>
  );
};

export default DrawManagement;




