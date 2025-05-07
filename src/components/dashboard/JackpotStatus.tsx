import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaSyncAlt, FaHistory } from 'react-icons/fa';
import { useDemoMode } from '../../context/DemoModeContext';
import { drawService } from '../../services/draw.service';
import LoadingSpinner from '../LoadingSpinner';
import Card from '../Card'; // Reuse Card component

// --- Types (Define based on expected API response) ---
interface JackpotStatusData {
  currentAmount: number;
  lastRolloverAmount?: number; // Optional
  lastDrawDate?: string; // Optional
  // Add other relevant fields from API
}

interface RolloverEntry {
  _id: string;
  drawDate: string;
  amount: number;
  drawId: string;
  // Add other relevant fields
}

// --- Mock Data ---
const MOCK_JACKPOT_STATUS: JackpotStatusData = {
  currentAmount: 5150000, // Example: Base + Last Rollover
  lastRolloverAmount: 150000,
  lastDrawDate: '2024-05-04T10:00:00Z',
};

const MOCK_ROLLOVER_HISTORY: RolloverEntry[] = [
  { _id: 'roll1', drawDate: '2024-05-04T10:00:00Z', amount: 150000, drawId: 'draw3' },
  { _id: 'roll2', drawDate: '2024-04-27T10:00:00Z', amount: 100000, drawId: 'drawSatPrev' },
];

// --- Styled Components ---
const StatusContainer = styled(Card)`
  margin-bottom: 20px;
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const StatusTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.2em;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatusContent = styled.div`
  font-size: 1.1em;
`;

const AmountHighlight = styled.span`
  font-weight: bold;
  font-size: 1.5em;
  color: ${({ theme }) => theme.colors.success};
`;

const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
  max-height: 150px;
  overflow-y: auto;
`;

const HistoryItem = styled.li`
  font-size: 0.9em;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 5px;
`;

// --- Component ---
const JackpotStatus: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const [status, setStatus] = useState<JackpotStatusData | null>(null);
  const [history, setHistory] = useState<RolloverEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let statusData: JackpotStatusData;
      let historyData: RolloverEntry[];

      if (isDemoMode) {
        console.log("Demo Mode: Using mock jackpot data");
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay
        statusData = MOCK_JACKPOT_STATUS;
        historyData = MOCK_ROLLOVER_HISTORY;
      } else {
        console.log("Fetching jackpot status and history from API...");
        // Fetch in parallel
        [statusData, historyData] = await Promise.all([
          drawService.getJackpotStatus(),
          drawService.getRolloverHistory(),
        ]);
      }
      setStatus(statusData);
      // Sort history by date descending
      historyData.sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime());
      setHistory(historyData);
    } catch (err) {
      console.error("Error fetching jackpot data:", err);
      setError(`Failed to load jackpot data: ${err.message}`);
      // Use mock data on error as fallback
      setStatus(MOCK_JACKPOT_STATUS);
      setHistory(MOCK_ROLLOVER_HISTORY);
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-CA'); // YYYY-MM-DD
    } catch { return 'Invalid Date'; }
  };

  return (
    <StatusContainer>
      <StatusHeader>
        <StatusTitle>Current Jackpot Status</StatusTitle>
        <RefreshButton onClick={fetchData} disabled={isLoading} title="Refresh Status">
          <FaSyncAlt />
        </RefreshButton>
      </StatusHeader>

      {isLoading && <LoadingSpinner />}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {status && (
        <StatusContent>
          <p>
            Estimated Next Jackpot: <AmountHighlight>{formatCurrency(status.currentAmount)}</AmountHighlight>
          </p>
          {status.lastRolloverAmount !== undefined && status.lastRolloverAmount > 0 && (
            <p style={{ fontSize: '0.9em', color: 'grey' }}>
              (Includes rollover of {formatCurrency(status.lastRolloverAmount)} from {formatDate(status.lastDrawDate)})
            </p>
          )}

          {history.length > 0 && (
            <>
              <h4 style={{ marginTop: '15px', marginBottom: '5px' }}><FaHistory /> Recent Rollovers</h4>
              <HistoryList>
                {history.slice(0, 5).map(item => ( // Show latest 5
                  <HistoryItem key={item._id}>
                    {formatDate(item.drawDate)}: +{formatCurrency(item.amount)}
                  </HistoryItem>
                ))}
              </HistoryList>
            </>
          )}
        </StatusContent>
      )}
    </StatusContainer>
  );
};

export default JackpotStatus;

