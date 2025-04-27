import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaPlay, FaEye } from 'react-icons/fa';
import { Draw } from '../../types/draw.types';
import DrawWheel from '../../components/draw/DrawWheel';
import DrawFilterForm from '../../components/draw/DrawFilterForm';
import { drawService } from '../../services/draw.service';

const DrawManagementContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  color: #212529;
  margin: 0;
`;

const ActionButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: #FFD100;
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #E6BC00;
  }
`;

const DrawsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DrawCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const DrawHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const DrawTitle = styled.h3`
  font-size: 1.25rem;
  color: #212529;
  margin: 0;
`;

const DrawStatus = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => 
    props.status === 'scheduled' ? '#e9ecef' : 
    props.status === 'in-progress' ? '#fff3cd' : 
    props.status === 'completed' ? '#d1e7dd' : 
    '#f8d7da'};
  color: ${props => 
    props.status === 'scheduled' ? '#495057' : 
    props.status === 'in-progress' ? '#856404' : 
    props.status === 'completed' ? '#0f5132' : 
    '#721c24'};
`;

const DrawInfo = styled.div`
  margin-bottom: 1rem;
`;

const DrawInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DrawInfoLabel = styled.span`
  color: #6c757d;
  font-size: 0.875rem;
`;

const DrawInfoValue = styled.span`
  font-weight: 500;
  color: #212529;
  font-size: 0.875rem;
`;

const DrawActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const IconButton = styled(motion.button)<{ variant?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  background-color: ${props => 
    props.variant === 'primary' ? '#FFD100' : 
    props.variant === 'danger' ? '#dc3545' : 
    props.variant === 'success' ? '#28a745' : 
    '#f8f9fa'};
  color: ${props => 
    props.variant === 'primary' ? '#000' : 
    props.variant === 'danger' ? '#fff' : 
    props.variant === 'success' ? '#fff' : 
    '#212529'};
  
  &:hover {
    background-color: ${props => 
      props.variant === 'primary' ? '#E6BC00' : 
      props.variant === 'danger' ? '#c82333' : 
      props.variant === 'success' ? '#218838' : 
      '#e2e6ea'};
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #212529;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #212529;
  }
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: string }>`
  padding: 0.75rem 1.5rem;
  background-color: ${props => 
    props.variant === 'primary' ? '#FFD100' : 
    props.variant === 'danger' ? '#dc3545' : 
    props.variant === 'success' ? '#28a745' : 
    '#f8f9fa'};
  color: ${props => 
    props.variant === 'primary' ? '#000' : 
    props.variant === 'danger' ? '#fff' : 
    props.variant === 'success' ? '#fff' : 
    '#212529'};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => 
      props.variant === 'primary' ? '#E6BC00' : 
      props.variant === 'danger' ? '#c82333' : 
      props.variant === 'success' ? '#218838' : 
      '#e2e6ea'};
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const DrawRunContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const WinnersList = styled.div`
  margin-top: 2rem;
  width: 100%;
  max-width: 500px;
`;

const WinnerItem = styled(motion.div)`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WinnerNumber = styled.span`
  font-weight: 600;
  color: #212529;
`;

const WinnerPrize = styled.span`
  font-weight: 600;
  color: #28a745;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ErrorContainer = styled.div`
  padding: 1.5rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

// Mock data for development/preview
const mockDraws: Draw[] = [
  {
    id: '1',
    name: 'Weekly Draw - April 27',
    date: '2025-04-27',
    status: 'scheduled',
    participantCount: 5000,
    winnerCount: 10,
    totalPrize: 100000,
    filterCriteria: {
      days: ['Monday', 'Tuesday'],
      endingDigits: [0, 1, 2, 3]
    }
  },
  {
    id: '2',
    name: 'Special Weekend Draw',
    date: '2025-04-26',
    status: 'completed',
    participantCount: 8000,
    winnerCount: 20,
    totalPrize: 200000,
    filterCriteria: {
      days: ['Saturday', 'Sunday'],
      endingDigits: [5, 6, 7, 8, 9]
    }
  },
  {
    id: '3',
    name: 'Monthly Grand Draw',
    date: '2025-04-30',
    status: 'scheduled',
    participantCount: 12000,
    winnerCount: 50,
    totalPrize: 500000,
    filterCriteria: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      endingDigits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  }
];

// Mock phone numbers for the wheel
const mockPhoneNumbers = [
  '0801234****',
  '0902345****',
  '0703456****',
  '0804567****',
  '0905678****',
  '0706789****',
  '0807890****',
  '0908901****',
  '0709012****',
  '0800123****',
  '0901234****',
  '0702345****'
];

const DrawManagement: React.FC = () => {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showRunModal, setShowRunModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  
  const [currentDraw, setCurrentDraw] = useState<Draw | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    winnerCount: 10,
    totalPrize: 100000
  });
  
  const [spinning, setSpinning] = useState<boolean>(false);
  const [selectedNumber, setSelectedNumber] = useState<string | undefined>(undefined);
  const [winners, setWinners] = useState<string[]>([]);
  
  // Fetch draws on component mount
  useEffect(() => {
    const fetchDraws = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real implementation, this would fetch from the API
        // const response = await drawService.getAllDraws();
        // setDraws(response);
        
        // Using mock data for now
        setDraws(mockDraws);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load draws');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDraws();
  }, []);
  
  const handleCreateDraw = () => {
    setFormData({
      name: '',
      date: '',
      winnerCount: 10,
      totalPrize: 100000
    });
    setShowCreateModal(true);
  };
  
  const handleEditDraw = (draw: Draw) => {
    setCurrentDraw(draw);
    setFormData({
      name: draw.name,
      date: draw.date,
      winnerCount: draw.winnerCount,
      totalPrize: draw.totalPrize
    });
    setShowEditModal(true);
  };
  
  const handleRunDraw = (draw: Draw) => {
    setCurrentDraw(draw);
    setSpinning(false);
    setSelectedNumber(undefined);
    setWinners([]);
    setShowRunModal(true);
  };
  
  const handleFilterDraw = (draw: Draw) => {
    setCurrentDraw(draw);
    setShowFilterModal(true);
  };
  
  const handleDeleteDraw = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this draw?')) {
      try {
        // In a real implementation, this would call the API
        // await drawService.deleteDraw(id);
        
        // Update local state
        setDraws(draws.filter(draw => draw.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete draw');
      }
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'winnerCount' || name === 'totalPrize' ? Number(value) : value
    });
  };
  
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real implementation, this would call the API
      // const newDraw = await drawService.createDraw({
      //   ...formData,
      //   filterCriteria: {
      //     days: [],
      //     endingDigits: []
      //   }
      // });
      
      // Mock implementation
      const newDraw: Draw = {
        id: String(draws.length + 1),
        name: formData.name,
        date: formData.date,
        status: 'scheduled',
        participantCount: 0,
        winnerCount: formData.winnerCount,
        totalPrize: formData.totalPrize,
        filterCriteria: {
          days: [],
          endingDigits: []
        }
      };
      
      // Update local state
      setDraws([...draws, newDraw]);
      setShowCreateModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create draw');
    }
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentDraw) return;
    
    try {
      // In a real implementation, this would call the API
      // const updatedDraw = await drawService.updateDraw(currentDraw.id, formData);
      
      // Mock implementation
      const updatedDraw: Draw = {
        ...currentDraw,
        name: formData.name,
        date: formData.date,
        winnerCount: formData.winnerCount,
        totalPrize: formData.totalPrize
      };
      
      // Update local state
      setDraws(draws.map(draw => draw.id === currentDraw.id ? updatedDraw : draw));
      setShowEditModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update draw');
    }
  };
  
  const handleFilterSubmit = (filter: any) => {
    if (!currentDraw) return;
    
    try {
      // In a real implementation, this would call the API
      // const updatedDraw = await drawService.updateDraw(currentDraw.id, {
      //   filterCriteria: filter
      // });
      
      // Mock implementation
      const updatedDraw: Draw = {
        ...currentDraw,
        filterCriteria: filter
      };
      
      // Update local state
      setDraws(draws.map(draw => draw.id === currentDraw.id ? updatedDraw : draw));
      setShowFilterModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update filter');
    }
  };
  
  const handleSpinWheel = () => {
    setSpinning(true);
    setSelectedNumber(undefined);
    
    // Simulate selecting a winner after the wheel stops
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockPhoneNumbers.length);
      const winner = mockPhoneNumbers[randomIndex];
      setSelectedNumber(winner);
      
      // Add to winners list
      setWinners(prev => [...prev, winner]);
    }, 5000); // Match the duration of the wheel animation
  };
  
  return (
    <DrawManagementContainer>
      <PageHeader>
        <PageTitle>Draw Management</PageTitle>
        <ActionButton
          onClick={handleCreateDraw}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Create New Draw
        </ActionButton>
      </PageHeader>
      
      {error && (
        <ErrorContainer>
          <strong>Error:</strong> {error}
        </ErrorContainer>
      )}
      
      {loading ? (
        <LoadingContainer>Loading draws...</LoadingContainer>
      ) : (
        <DrawsGrid>
          {draws.map(draw => (
            <DrawCard
              key={draw.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DrawHeader>
                <DrawTitle>{draw.name}</DrawTitle>
                <DrawStatus status={draw.status}>
                  {draw.status}
                </DrawStatus>
              </DrawHeader>
              
              <DrawInfo>
                <DrawInfoItem>
                  <DrawInfoLabel>Date:</DrawInfoLabel>
                  <DrawInfoValue>{draw.date}</DrawInfoValue>
                </DrawInfoItem>
                <DrawInfoItem>
                  <DrawInfoLabel>Participants:</DrawInfoLabel>
                  <DrawInfoValue>{draw.participantCount.toLocaleString()}</DrawInfoValue>
                </DrawInfoItem>
                <DrawInfoItem>
                  <DrawInfoLabel>Winners:</DrawInfoLabel>
                  <DrawInfoValue>{draw.winnerCount}</DrawInfoValue>
                </DrawInfoItem>
                <DrawInfoItem>
                  <DrawInfoLabel>Total Prize:</DrawInfoLabel>
                  <DrawInfoValue>₦{draw.totalPrize.toLocaleString()}</DrawInfoValue>
                </DrawInfoItem>
              </DrawInfo>
              
              <DrawActions>
                <IconButton
                  onClick={() => handleEditDraw(draw)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaEdit />
                </IconButton>
                <IconButton
                  variant="danger"
                  onClick={() => handleDeleteDraw(draw.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTrash />
                </IconButton>
                <IconButton
                  variant="primary"
                  onClick={() => handleFilterDraw(draw)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaEye />
                </IconButton>
                {draw.status === 'scheduled' && (
                  <IconButton
                    variant="success"
                    onClick={() => handleRunDraw(draw)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaPlay />
                  </IconButton>
                )}
              </DrawActions>
            </DrawCard>
          ))}
        </DrawsGrid>
      )}
      
      {/* Create Draw Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Create New Draw</ModalTitle>
                <CloseButton onClick={() => setShowCreateModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleCreateSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Draw Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="date">Draw Date</Label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="winnerCount">Number of Winners</Label>
                  <Input
                    type="number"
                    id="winnerCount"
                    name="winnerCount"
                    min="1"
                    value={formData.winnerCount}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="totalPrize">Total Prize Amount (₦)</Label>
                  <Input
                    type="number"
                    id="totalPrize"
                    name="totalPrize"
                    min="1000"
                    step="1000"
                    value={formData.totalPrize}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                
                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Create Draw
                  </Button>
                </ButtonGroup>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Edit Draw Modal */}
      <AnimatePresence>
        {showEditModal && currentDraw && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Edit Draw</ModalTitle>
                <CloseButton onClick={() => setShowEditModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleEditSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Draw Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="date">Draw Date</Label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="winnerCount">Number of Winners</Label>
                  <Input
                    type="number"
                    id="winnerCount"
                    name="winnerCount"
                    min="1"
                    value={formData.winnerCount}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="totalPrize">Total Prize Amount (₦)</Label>
                  <Input
                    type="number"
                    id="totalPrize"
                    name="totalPrize"
                    min="1000"
                    step="1000"
                    value={formData.totalPrize}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                
                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Save Changes
                  </Button>
                </ButtonGroup>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Run Draw Modal */}
      <AnimatePresence>
        {showRunModal && currentDraw && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRunModal(false)}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Run Draw: {currentDraw.name}</ModalTitle>
                <CloseButton onClick={() => setShowRunModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <DrawRunContainer>
                <DrawWheel
                  numbers={mockPhoneNumbers}
                  spinning={spinning}
                  selectedNumber={selectedNumber}
                  onSpinComplete={() => setSpinning(false)}
                />
                
                <ButtonGroup style={{ marginTop: '2rem' }}>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleSpinWheel}
                    disabled={spinning}
                  >
                    {spinning ? 'Spinning...' : 'Spin the Wheel'}
                  </Button>
                </ButtonGroup>
                
                {winners.length > 0 && (
                  <WinnersList>
                    <h3>Winners</h3>
                    {winners.map((winner, index) => (
                      <WinnerItem
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <WinnerNumber>{winner}</WinnerNumber>
                        <WinnerPrize>₦{(currentDraw.totalPrize / currentDraw.winnerCount).toLocaleString()}</WinnerPrize>
                      </WinnerItem>
                    ))}
                  </WinnersList>
                )}
              </DrawRunContainer>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Filter Draw Modal */}
      <AnimatePresence>
        {showFilterModal && currentDraw && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilterModal(false)}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Filter Criteria: {currentDraw.name}</ModalTitle>
                <CloseButton onClick={() => setShowFilterModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <DrawFilterForm
                onSubmit={handleFilterSubmit}
                initialValues={currentDraw.filterCriteria}
              />
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </DrawManagementContainer>
  );
};

export default DrawManagement;
