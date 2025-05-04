import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaFilter, FaSave, FaTimes, FaCheck } from 'react-icons/fa';
import { useDemoMode } from '../context/DemoModeContext';
import { winnerService } from '../services/winner.service'; // Import the new service
import { Winner } from '../types/draw.types';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

// --- Mock Data (For Demo Mode) ---
const MOCK_WINNERS: Winner[] = [
  { id: 'win1', msisdn: '2348031234567', prizeCategory: 'jackpot', prizeAmount: 1000000, drawId: 'draw1', winDate: new Date('2024-05-01T10:00:00Z').toISOString(), claimStatus: 'Pending', createdAt: new Date().toISOString(), isOptedIn: true, isValid: true },
  { id: 'win2', msisdn: '2348037654321', prizeCategory: 'consolation', prizeAmount: 5000, drawId: 'draw1', winDate: new Date('2024-05-01T10:00:00Z').toISOString(), claimStatus: 'Paid', createdAt: new Date().toISOString(), isOptedIn: true, isValid: true },
  { id: 'win3', msisdn: '2349098765432', prizeCategory: 'consolation', prizeAmount: 5000, drawId: 'draw1', winDate: new Date('2024-05-01T10:00:00Z').toISOString(), claimStatus: 'Pending', createdAt: new Date().toISOString(), isOptedIn: true, isValid: true },
  { id: 'win4', msisdn: '2347061112222', prizeCategory: 'jackpot', prizeAmount: 5000000, drawId: 'draw3', winDate: new Date('2024-05-04T10:00:00Z').toISOString(), claimStatus: 'Failed', createdAt: new Date().toISOString(), isOptedIn: true, isValid: true }, // Example Saturday winner
];

// --- Styled Components (reuse or adapt from DrawManagement) ---
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
  flex-wrap: wrap;
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
  vertical-align: middle;
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
      case 'Pending': return theme.colors.warning;
      case 'Paid': return theme.colors.success;
      case 'Failed': return theme.colors.danger;
      default: return theme.colors.secondary;
    }
  }};
`;

const ActionButton = styled(Button)`
  padding: 5px 10px;
  font-size: 0.9em;
  margin-right: 5px;
`;

// --- Component ---
const WinnerManagement: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const [winners, setWinners] = useState<Winner[]>([]);
  const [filteredWinners, setFilteredWinners] = useState<Winner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDrawType, setFilterDrawType] = useState('');

  // Fetch Winners Function
  const fetchWinners = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let fetchedWinners: Winner[];
      const filters = {
        startDate: filterStartDate || undefined,
        endDate: filterEndDate || undefined,
        status: filterStatus || undefined,
        drawType: filterDrawType as "daily" | "saturday" | undefined,
      };

      if (isDemoMode) {
        console.log("Demo Mode: Using mock winners");
        // Apply basic filtering to mock data for demo
        fetchedWinners = MOCK_WINNERS.filter(w => {
          const winDate = new Date(w.winDate); // Use winDate
          const start = filters.startDate ? new Date(filters.startDate) : null;
          const end = filters.endDate ? new Date(filters.endDate) : null;
          if (start && winDate < start) return false; // Use winDate
          if (end && winDate > end) return false; // Use winDate
          if (filters.status && w.claimStatus !== filters.status) return false;
          // Note: Mock data doesn't have drawType, so can't filter by it in demo
          return true;
        });
      } else {
        console.log("Fetching winners from API with filters:", filters);
        fetchedWinners = await winnerService.getWinners(filters);
      }
      // Sort by date descending
      fetchedWinners.sort((a, b) => new Date(b.winDate).getTime() - new Date(a.winDate).getTime()); // Use winDate
      setWinners(fetchedWinners);
      setFilteredWinners(fetchedWinners); // Initially show all fetched
    } catch (err: any) {
      console.error("Error fetching winners:", err);
      setError(`Failed to fetch winners: ${err.message}. Using mock data.`);
      setWinners(MOCK_WINNERS);
      setFilteredWinners(MOCK_WINNERS);
    } finally {
      setIsLoading(false);
    }
  }, [isDemoMode, filterStartDate, filterEndDate, filterStatus, filterDrawType]);

  // Initial Fetch
  useEffect(() => {
    fetchWinners();
  }, [fetchWinners]); // Re-fetch when filters change

  // --- Event Handlers ---
  const handleClearFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterStatus('');
    setFilterDrawType('');
    // fetchWinners will be called by useEffect due to state change
  };

  const handleUpdateStatus = async (winnerId: string, newStatus: string) => {
    if (!window.confirm(`Are you sure you want to update status to ${newStatus} for winner ${winnerId}?`)) {
      return;
    }
    setIsLoading(true); // Consider a more granular loading state if needed
    setError(null);
    try {
      if (isDemoMode) {
        console.log(`Demo Mode: Simulating update status to ${newStatus} for winner ${winnerId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        setWinners(prev => prev.map(w => w.id === winnerId ? { ...w, claimStatus: newStatus } : w)); // Use id
        setFilteredWinners(prev => prev.map(w => w.id === winnerId ? { ...w, claimStatus: newStatus } : w)); // Use id
      } else {
        console.log(`Updating status for winner ${winnerId} to ${newStatus} via API...`);
        await winnerService.updateWinnerStatus(winnerId, newStatus);
        await fetchWinners(); // Re-fetch to confirm update and get latest list
      }
      alert('Winner status updated successfully!');
    } catch (err: any) {
      console.error(`Error updating status for winner ${winnerId}:`, err);
      setError(`Failed to update status: ${err.message}`);
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Helper Functions ---
  const formatDateTime = (date: Date | string) => {
    try {
      return new Date(date).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    } catch { return 'Invalid Date'; }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return `₦${amount.toLocaleString()}`;
  };

  // --- Render ---
  return (
    <PageLayout title="Winner Management">
      <Container>
        <Header>
          <Title>Winner Management</Title>
        </Header>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {/* Filters Card */}
        <Card title="Filters">
          <Controls>
            <DatePicker placeholder="Start Date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} />
            <DatePicker placeholder="End Date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} />
            <Select value={filterDrawType} onChange={e => setFilterDrawType(e.target.value)}>
              <option value="">All Draw Types</option>
              <option value="daily">Daily</option>
              <option value="saturday">Saturday</option>
            </Select>
            <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </Select>
            <Button onClick={handleClearFilters} icon={<FaFilter />} secondary>Clear Filters</Button>
          </Controls>
        </Card>

        {isLoading && <LoadingSpinner />}

        {/* Winners Table */}
        <Card title="Winners List">
          <Table>
            <thead>
              <tr>
                <Th>Draw Date</Th>
                <Th>MSISDN</Th>
                <Th>Prize Category</Th>
                <Th>Prize Amount</Th>
                <Th>Claim Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredWinners.length > 0 ? (
                filteredWinners.map((winner) => (
                  <Tr key={winner.id}>
                    <Td>{formatDateTime(winner.winDate)}</Td> // Use winDate
                    {/* Display full MSISDN here */}
                    <Td>{winner.msisdn}</Td>
                    <Td>{winner.prizeCategory}</Td>
                    <Td>{formatCurrency(winner.prizeAmount)}</Td>
                    <Td><StatusBadge status={winner.claimStatus}>{winner.claimStatus}</StatusBadge></Td>
                    <Td>
                      {winner.claimStatus === 'Pending' && (
                        <>
                          <ActionButton
                            onClick={() => handleUpdateStatus(winner._id, 'Paid')}
                            icon={<FaCheck />}
                            disabled={isLoading}
                            success
                            small
                          >
                            Mark Paid
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleUpdateStatus(winner._id, 'Failed')}
                            icon={<FaTimes />}
                            disabled={isLoading}
                            danger
                            small
                          >
                            Mark Failed
                          </ActionButton>
                        </>
                      )}
                       {winner.claimStatus !== 'Pending' && (
                           <ActionButton
                            onClick={() => handleUpdateStatus(winner._id, 'Pending')}
                            icon={<FaTimes />} // Or a different icon like FaUndo
                            disabled={isLoading}
                            warning // Use warning color for revert
                            small
                          >
                            Mark Pending
                          </ActionButton>
                      )}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={6} style={{ textAlign: 'center' }}>No winners found matching filters.</Td>
                </Tr>
              )}
            </tbody>
          </Table>
        </Card>

      </Container>
    </PageLayout>
  );
};

export default WinnerManagement;





