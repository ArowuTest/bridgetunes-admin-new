import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaUserCog, FaChartBar } from 'react-icons/fa';
import UserTable from '../components/user/UserTable';
import { userService } from '../services/user.service';
import { User, UserCreationParams, UserUpdateParams, UserStats } from '../types/user.types';

const UserManagementContainer = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  text-transform: uppercase;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
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
  max-width: 600px;
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
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

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ActivityList = styled.div`
  margin-top: 1rem;
`;

const ActivityItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityTime = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
`;

const ActivityAction = styled.div`
  font-weight: 500;
  color: #212529;
`;

const ActivityDetails = styled.div`
  font-size: 0.875rem;
  color: #495057;
  margin-top: 0.5rem;
`;

// Mock data for development/preview
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@bridgetunes.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-04-26T10:30:00Z',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-04-26T10:30:00Z'
  },
  {
    id: '2',
    username: 'manager1',
    email: 'manager1@bridgetunes.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2025-04-25T14:20:00Z',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-04-25T14:20:00Z'
  },
  {
    id: '3',
    username: 'viewer1',
    email: 'viewer1@bridgetunes.com',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '2025-03-10T09:15:00Z',
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-04-01T00:00:00Z'
  },
  {
    id: '4',
    username: 'manager2',
    email: 'manager2@bridgetunes.com',
    role: 'manager',
    status: 'pending',
    createdAt: '2025-04-20T00:00:00Z',
    updatedAt: '2025-04-20T00:00:00Z'
  }
];

const mockUserStats: UserStats = {
  totalUsers: 4,
  activeUsers: 2,
  inactiveUsers: 1,
  pendingUsers: 1,
  adminCount: 1,
  managerCount: 2,
  viewerCount: 1
};

const mockUserActivity = [
  {
    id: '1',
    userId: '1',
    action: 'Login',
    details: 'User logged in from 192.168.1.1',
    ipAddress: '192.168.1.1',
    timestamp: '2025-04-26T10:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    action: 'Create Draw',
    details: 'Created draw "Weekly Draw - April 27"',
    ipAddress: '192.168.1.1',
    timestamp: '2025-04-26T10:45:00Z'
  },
  {
    id: '3',
    userId: '1',
    action: 'Update User',
    details: 'Updated user "manager2" status to pending',
    ipAddress: '192.168.1.1',
    timestamp: '2025-04-26T11:15:00Z'
  }
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState<boolean>(false);
  const [showActivityModal, setShowActivityModal] = useState<boolean>(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<UserCreationParams>({
    username: '',
    email: '',
    password: '',
    role: 'viewer'
  });
  
  const [editFormData, setEditFormData] = useState<UserUpdateParams>({
    username: '',
    email: '',
    role: 'viewer',
    status: 'active'
  });
  
  const [resetEmail, setResetEmail] = useState<string>('');
  
  // Fetch users and stats on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real implementation, this would fetch from the API
        // const [usersData, statsData] = await Promise.all([
        //   userService.getAllUsers(),
        //   userService.getUserStats()
        // ]);
        // setUsers(usersData);
        // setUserStats(statsData);
        
        // Using mock data for now
        setUsers(mockUsers);
        setUserStats(mockUserStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleCreateUser = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'viewer'
    });
    setShowCreateModal(true);
  };
  
  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setEditFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
  };
  
  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // In a real implementation, this would call the API
        // await userService.deleteUser(id);
        
        // Update local state
        setUsers(users.filter(user => user.id !== id));
        
        // Update stats
        if (userStats) {
          const deletedUser = users.find(user => user.id === id);
          if (deletedUser) {
            setUserStats({
              ...userStats,
              totalUsers: userStats.totalUsers - 1,
              activeUsers: deletedUser.status === 'active' ? userStats.activeUsers - 1 : userStats.activeUsers,
              inactiveUsers: deletedUser.status === 'inactive' ? userStats.inactiveUsers - 1 : userStats.inactiveUsers,
              pendingUsers: deletedUser.status === 'pending' ? userStats.pendingUsers - 1 : userStats.pendingUsers,
              adminCount: deletedUser.role === 'admin' ? userStats.adminCount - 1 : userStats.adminCount,
              managerCount: deletedUser.role === 'manager' ? userStats.managerCount - 1 : userStats.managerCount,
              viewerCount: deletedUser.role === 'viewer' ? userStats.viewerCount - 1 : userStats.viewerCount
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete user');
      }
    }
  };
  
  const handleResetPassword = (id: string) => {
    const user = users.find(user => user.id === id);
    if (user) {
      setCurrentUser(user);
      setResetEmail(user.email);
      setShowResetPasswordModal(true);
    }
  };
  
  const handleViewActivity = async (id: string) => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from the API
      // const activity = await userService.getUserActivity(id);
      // setUserActivity(activity);
      
      // Using mock data for now
      setUserActivity(mockUserActivity);
      
      const user = users.find(user => user.id === id);
      if (user) {
        setCurrentUser(user);
        setShowActivityModal(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user activity');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real implementation, this would call the API
      // const newUser = await userService.createUser(formData);
      
      // Mock implementation
      const newUser: User = {
        id: String(users.length + 1),
        username: formData.username,
        email: formData.email,
        role: formData.role,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update local state
      setUsers([...users, newUser]);
      
      // Update stats
      if (userStats) {
        setUserStats({
          ...userStats,
          totalUsers: userStats.totalUsers + 1,
          pendingUsers: userStats.pendingUsers + 1,
          adminCount: formData.role === 'admin' ? userStats.adminCount + 1 : userStats.adminCount,
          managerCount: formData.role === 'manager' ? userStats.managerCount + 1 : userStats.managerCount,
          viewerCount: formData.role === 'viewer' ? userStats.viewerCount + 1 : userStats.viewerCount
        });
      }
      
      setShowCreateModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      // In a real implementation, this would call the API
      // const updatedUser = await userService.updateUser(currentUser.id, editFormData);
      
      // Mock implementation
      const updatedUser: User = {
        ...currentUser,
        username: editFormData.username || currentUser.username,
        email: editFormData.email || currentUser.email,
        role: editFormData.role || currentUser.role,
        status: editFormData.status || currentUser.status,
        updatedAt: new Date().toISOString()
      };
      
      // Update local state
      setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
      
      // Update stats if role or status changed
      if (userStats && (currentUser.role !== updatedUser.role || currentUser.status !== updatedUser.status)) {
        const statsUpdate = { ...userStats };
        
        // Update role counts
        if (currentUser.role !== updatedUser.role) {
          if (currentUser.role === 'admin') statsUpdate.adminCount--;
          if (currentUser.role === 'manager') statsUpdate.managerCount--;
          if (currentUser.role === 'viewer') statsUpdate.viewerCount--;
          
          if (updatedUser.role === 'admin') statsUpdate.adminCount++;
          if (updatedUser.role === 'manager') statsUpdate.managerCount++;
          if (updatedUser.role === 'viewer') statsUpdate.viewerCount++;
        }
        
        // Update status counts
        if (currentUser.status !== updatedUser.status) {
          if (currentUser.status === 'active') statsUpdate.activeUsers--;
          if (currentUser.status === 'inactive') statsUpdate.inactiveUsers--;
          if (currentUser.status === 'pending') statsUpdate.pendingUsers--;
          
          if (updatedUser.status === 'active') statsUpdate.activeUsers++;
          if (updatedUser.status === 'inactive') statsUpdate.inactiveUsers++;
          if (updatedUser.status === 'pending') statsUpdate.pendingUsers++;
        }
        
        setUserStats(statsUpdate);
      }
      
      setShowEditModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };
  
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real implementation, this would call the API
      // await userService.resetPassword({ email: resetEmail });
      
      alert(`Password reset email sent to ${resetEmail}`);
      setShowResetPasswordModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    }
  };
  
  return (
    <UserManagementContainer>
      <PageHeader>
        <PageTitle>User Management</PageTitle>
        <ActionButton
          onClick={handleCreateUser}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus /> Create New User
        </ActionButton>
      </PageHeader>
      
      {userStats && (
        <StatsGrid>
          <StatCard>
            <StatTitle>Total Users</StatTitle>
            <StatValue>{userStats.totalUsers}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Active Users</StatTitle>
            <StatValue>{userStats.activeUsers}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Inactive Users</StatTitle>
            <StatValue>{userStats.inactiveUsers}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Pending Users</StatTitle>
            <StatValue>{userStats.pendingUsers}</StatValue>
          </StatCard>
        </StatsGrid>
      )}
      
      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}
      
      {loading && !users.length ? (
        <LoadingContainer>Loading users...</LoadingContainer>
      ) : (
        <UserTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onResetPassword={handleResetPassword}
          onViewActivity={handleViewActivity}
        />
      )}
      
      {/* Create User Modal */}
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
                <ModalTitle>Create New User</ModalTitle>
                <CloseButton onClick={() => setShowCreateModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleCreateSubmit}>
                <FormGroup>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="viewer">Viewer</option>
                  </Select>
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
                    Create User
                  </Button>
                </ButtonGroup>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && currentUser && (
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
                <ModalTitle>Edit User: {currentUser.username}</ModalTitle>
                <CloseButton onClick={() => setShowEditModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleEditSubmit}>
                <FormGroup>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    value={editFormData.username}
                    onChange={handleEditFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    id="role"
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="viewer">Viewer</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </Select>
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
      
      {/* Reset Password Modal */}
      <AnimatePresence>
        {showResetPasswordModal && currentUser && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResetPasswordModal(false)}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>Reset Password: {currentUser.username}</ModalTitle>
                <CloseButton onClick={() => setShowResetPasswordModal(false)}>×</CloseButton>
              </ModalHeader>
              
              <form onSubmit={handleResetSubmit}>
                <p>Send password reset email to:</p>
                
                <FormGroup>
                  <Label htmlFor="resetEmail">Email</Label>
                  <Input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </FormGroup>
                
                <ButtonGroup>
                  <Button
                    type="button"
                    onClick={() => setShowResetPasswordModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Send Reset Email
                  </Button>
                </ButtonGroup>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* User Activity Modal */}
      <AnimatePresence>
        {showActivityModal && currentUser && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowActivityModal(false)}
          >
            <ModalContent
              onClick={e => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <ModalTitle>User Activity: {currentUser.username}</ModalTitle>
                <CloseButton onClick={() => setShowActivityModal(false)}>×</CloseButton>
              </ModalHeader>
              
              {userActivity.length === 0 ? (
                <p>No activity found for this user.</p>
              ) : (
                <ActivityList>
                  {userActivity.map((activity) => (
                    <ActivityItem key={activity.id}>
                      <ActivityTime>
                        {new Date(activity.timestamp).toLocaleString()}
                      </ActivityTime>
                      <ActivityAction>{activity.action}</ActivityAction>
                      <ActivityDetails>{activity.details}</ActivityDetails>
                    </ActivityItem>
                  ))}
                </ActivityList>
              )}
              
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                >
                  Close
                </Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </UserManagementContainer>
  );
};

export default UserManagement;
