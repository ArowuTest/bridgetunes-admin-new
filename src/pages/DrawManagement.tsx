import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaDice, FaFilter, FaPlay, FaTrophy, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useDemoMode } from '../context/DemoModeContext';
import { drawService } from '../services/draw.service';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import DrawFilterForm from '../components/draw/DrawFilterForm';
import DrawWheel from '../components/draw/DrawWheel';

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

const DrawGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

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

const WinnerDisplay = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.success}15 0%, ${props => props.theme.colors.info}15 100%);
  border: 1px solid ${props => props.theme.colors.success}30;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  margin-top: 2rem;
  
  h3 {
    margin: 0 0 1rem 0;
    color: ${props => props.theme.colors.success};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .winner-number {
    font-size: 2rem;
    font-weight: 700;
    margin: 1rem 0;
    color: ${props => props.theme.colors.dark};
  }
  
  .winner-details {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    
    .detail {
      text-align: left;
      
      .label {
        font-size: 0.75rem;
        color: ${props => props.theme.colors.gray600};
      }
      
      .value {
        font-weight: 600;
      }
    }
  }
`;

const DrawManagement: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const [isLoading, setIsLoading] = useState(true);
  const [draws, setDraws] = useState<any[]>([]);
  const [nextDraw, setNextDraw] = useState<any>(null);
  const [filterCriteria, setFilterCriteria] = useState<any>({
    dayOfWeek: '',
    endingDigits: []
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [countdown, setCountdown] = useState<string>('00:00:00');
  
  useEffect(() => {
    const fetchDraws = async () => {
      setIsLoading(true);
      try {
        // Use existing service methods - getAllDraws() exists in draw.service.ts
        const response = await drawService.getAllDraws(); 
        setDraws(response);
        
        // Set next draw (in a real app, this would come from the API)
        const nextDrawData = response.find((draw: any) => draw.status === 'Scheduled');
        setNextDraw(nextDrawData || {
          id: 'next-draw',
          name: 'Daily Draw',
          date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          prize: '₦1,000,000',
          status: 'Scheduled'
        });
      } catch (error) {
        console.error('Error fetching draws:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDraws();
  }, [isDemoMode]);
  
  useEffect(() => {
    // Update countdown timer
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
  
  const handleFilterChange = (criteria: any) => {
    setFilterCriteria(criteria);
  };
  
  const handleStartDraw = async () => {
    setIsDrawing(true);
    setWinner(null);
    
    // Simulate draw animation and winner selection (since conductDraw doesn't exist in service)
    setTimeout(() => {
      // Create a mock winner object
      const mockWinner = {
        msisdn: `23480${Math.floor(1000000 + Math.random() * 9000000)}`, // Random MSISDN
        amount: Math.floor(100 + Math.random() * 900), // Random amount
        date: new Date().toISOString(),
        prize: nextDraw?.prize || '₦1,000,000' // Use prize from nextDraw if available
      };
      setWinner(mockWinner);
      setIsDrawing(false);
    }, 3000); // Simulate 3 second draw animation
  };
  
  if (isLoading) {
    return (
      <PageLayout title="Draw Management">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <LoadingSpinner size={60} />
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout title="Draw Management">
      <DrawManagementContainer>
        <DrawHeader>
          <DrawTitle>
            <h2><FaDice /> Draw Management</h2>
            <p>Manage and conduct draws for the MyNumba Don Win promotion</p>
          </DrawTitle>
          
          <Button 
            onClick={handleStartDraw} 
            disabled={isDrawing}
            startIcon={<FaPlay />}
          >
            {isDrawing ? 'Drawing...' : 'Start Draw'}
          </Button>
        </DrawHeader>
        
        <DrawGrid>
          <Card>
            <h3><FaFilter /> Draw Filters</h3>
            <DrawFilterForm onChange={handleFilterChange} />
          </Card>
          
          <NextDrawCard>
            <NextDrawHeader>
              <h3><FaCalendarAlt /> Next Scheduled Draw</h3>
            </NextDrawHeader>
            
            <NextDrawInfo>
              <NextDrawDetail>
                <div className="label">Draw Type</div>
                <div className="value">{nextDraw?.name || 'Daily Draw'}</div>
              </NextDrawDetail>
              
              <NextDrawDetail>
                <div className="label">Prize Amount</div>
                <div className="value">{nextDraw?.prize || '₦1,000,000'}</div>
              </NextDrawDetail>
              
              <NextDrawDetail>
                <div className="label">Date</div>
                <div className="value">
                  <FaCalendarAlt />
                  {nextDraw ? new Date(nextDraw.date).toLocaleDateString() : 'TBD'}
                </div>
              </NextDrawDetail>
            </NextDrawInfo>
            
            <CountdownTimer>
              <div className="label">Time Remaining</div>
              <div className="time">
                <FaClock style={{ marginRight: '0.5rem' }} />
                {countdown}
              </div>
            </CountdownTimer>
            
            <DrawWheel isSpinning={isDrawing} />
            
            {winner && (
              <WinnerDisplay>
                <h3><FaTrophy /> Winner Selected!</h3>
                <div className="winner-number">{winner.msisdn}</div>
                <div className="winner-details">
                  <div className="detail">
                    <div className="label">Top-up Amount</div>
                    <div className="value">₦{winner.amount.toLocaleString()}</div>
                  </div>
                  <div className="detail">
                    <div className="label">Date</div>
                    <div className="value">{new Date(winner.date).toLocaleDateString()}</div>
                  </div>
                  <div className="detail">
                    <div className="label">Prize</div>
                    <div className="value">{winner.prize}</div>
                  </div>
                </div>
              </WinnerDisplay>
            )}
          </NextDrawCard>
        </DrawGrid>
      </DrawManagementContainer>
    </PageLayout>
  );
};

export default DrawManagement;

