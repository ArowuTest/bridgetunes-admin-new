import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUserShield, FaUserPlus, FaEdit, FaTrash, FaKey } from 'react-icons/fa';
import PageLayout from '../components/PageLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import DataTable from '../components/DataTable';
import { useDemoMode } from '../context/DemoModeContext';
import UserTable from '../components/user/UserTable';

// Styled components
const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid ${props => props.theme.colors.light};
  margin-bottom: 1.5rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  margin-bottom: -2px;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray};
  font-weight: ${props => props.active ? props.theme.fontWeights.semibold : props.theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.light};
  width: 300px;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary + '30'};
  }
`;

const RoleBadge = styled.span<{ role: string }>`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.role) {
      case 'super_admin':
        return `
          background-color: ${props.theme.colors.primary + '20'};
          color: ${props.theme.colors.primary};
        `;
      case 'admin':
        return `
          background-color: ${props.theme.colors.info + '20'};
          color: ${props.theme.colors.info};
        `;
      case 'viewer':
        return `
          background-color: ${props.theme.colors.secondary + '20'};
          color: ${props.theme.colors.secondary};
        `;
      default:
        return `
          background-color: ${props.theme.colors.light};
          color: ${props.theme.colors.gray};
        `;
    }
  }}
`;

const PermissionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const PermissionTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  background-color: ${props => props.theme.colors.light};
  color: ${props => props.theme.colors.gray};
`;

// Modal components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: ${props => props.theme.colors.dark};
  }
  
  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${props => props.theme.colors.gray};
    
    &:hover {
      color: ${props => props.theme.colors.danger};
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.dark};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.light};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary + '30'};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.light};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary + '30'};
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.dark};
  
  input {
    margin-right: 0.5rem;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

// Define interfaces for our data types
interface AdminPermissions {
  manage_users: boolean;
  manage_draws: boolean;
  view_analytics: boolean;
  manage_notifications: boolean;
  manage_csv: boolean;
  [key: string]: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: AdminPermissions;
  lastLogin: string;
}

interface Subscriber {
  id: string;
  msisdn: string;
  optInStatus: string;
  points: number;
  totalRecharge: string;
  lastRecharge: string;
}

const UserManagement: React.FC = () => {
  const { isDemoMode } = useDemoMode();
  const [activeTab, setActiveTab] = useState<string>('admins');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'admin',
    permissions: {
      manage_users: false,
      manage_draws: false,
      view_analytics: true,
      manage_notifications: false,
      manage_csv: false
    }
  });
  
  // Mock data for demo mode
  const mockAdmins: AdminUser[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'super_admin',
      permissions: {
        manage_users: true,
        manage_draws: true,
        view_analytics: true,
        manage_notifications: true,
        manage_csv: true
      },
      lastLogin: '2023-04-25T15:30:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'admin',
      permissions: {
        manage_users: false,
        manage_draws: true,
        view_analytics: true,
        manage_notifications: true,
        manage_csv: false
      },
      lastLogin: '2023-04-24T10:15:00Z'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'admin',
      permissions: {
        manage_users: false,
        manage_draws: false,
        view_analytics: true,
        manage_notifications: true,
        manage_csv: true
      },
      lastLogin: '2023-04-23T14:45:00Z'
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'viewer',
      permissions: {
        manage_users: false,
        manage_draws: false,
        view_analytics: true,
        manage_notifications: false,
        manage_csv: false
      },
      lastLogin: '2023-04-22T09:30:00Z'
    }
  ];
  
  const mockSubscribers: Subscriber[] = [
    {
      id: '1',
      msisdn: '08036785165',
      optInStatus: 'Yes',
      points: 15,
      totalRecharge: '₦2,500',
      lastRecharge: '2023-04-25T15:30:00Z'
    },
    {
      id: '2',
      msisdn: '08033724661',
      optInStatus: 'Yes',
      points: 8,
      totalRecharge: '₦1,200',
      lastRecharge: '2023-04-24T10:15:00Z'
    },
    {
      id: '3',
      msisdn: '08037954885',
      optInStatus: 'No',
      points: 3,
      totalRecharge: '₦300',
      lastRecharge: '2023-04-23T14:45:00Z'
    },
    {
      id: '4',
      msisdn: '08031074159',
      optInStatus: 'Yes',
      points: 22,
      totalRecharge: '₦3,800',
      lastRecharge: '2023-04-22T09:30:00Z'
    }
  ];
  
  // Filter users based on search query
  const filteredAdmins = mockAdmins.filter(admin => 
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSubscribers = mockSubscribers.filter(subscriber => 
    subscriber.msisdn.includes(searchQuery)
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [name]: checked
      }
    });
  };
  
  // Open modal for adding new user
  const handleAddUser = () => {
    setModalMode('add');
    setFormData({
      name: '',
      email: '',
      role: 'admin',
      permissions: {
        manage_users: false,
        manage_draws: false,
        view_analytics: true,
        manage_notifications: false,
        manage_csv: false
      }
    });
    setShowModal(true);
  };
  
  // Open modal for editing user
  const handleEditUser = (user: AdminUser) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: { ...user.permissions }
    });
    setShowModal(true);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would call an API to create/update the user
    console.log('Form submitted:', formData);
    
    // Close the modal
    setShowModal(false);
  };
  
  return (
    <PageLayout 
      title="User Management" 
      description="Manage admin users and subscribers for the MyNumba Don Win promotion."
    >
      <TabsContainer>
        <Tab 
          active={activeTab === 'admins'} 
          onClick={() => setActiveTab('admins')}
        >
          <FaUserShield /> Admin Users
        </Tab>
        <Tab 
          active={activeTab === 'subscribers'} 
          onClick={() => setActiveTab('subscribers')}
        >
          <FaUserShield /> Subscribers
        </Tab>
      </TabsContainer>
      
      <ActionBar>
        <SearchInput 
          type="text" 
          placeholder={activeTab === 'admins' ? "Search admins..." : "Search subscribers..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {activeTab === 'admins' && (
          <Button 
            variant="primary" 
            icon={<FaUserPlus />}
            onClick={handleAddUser}
          >
            Add Admin
          </Button>
        )}
      </ActionBar>
      
      {activeTab === 'admins' && (
        <Card title="Admin Users">
          <DataTable
            columns={[
              {
                key: 'name',
                header: 'Name',
                render: (admin: AdminUser) => <div>{admin.name}</div>
              },
              {
                key: 'email',
                header: 'Email',
                render: (admin: AdminUser) => <div>{admin.email}</div>
              },
              {
                key: 'role',
                header: 'Role',
                render: (admin: AdminUser) => (
                  <RoleBadge role={admin.role}>
                    {admin.role.replace('_', ' ')}
                  </RoleBadge>
                )
              },
              {
                key: 'permissions',
                header: 'Permissions',
                render: (admin: AdminUser) => (
                  <PermissionList>
                    {Object.entries(admin.permissions).map(([key, value]) => {
                      return value ? (
                        <PermissionTag key={key}>
                          {key.replace('_', ' ')}
                        </PermissionTag>
                      ) : null;
                    })}
                  </PermissionList>
                )
              },
              {
                key: 'lastLogin',
                header: 'Last Login',
                render: (admin: AdminUser) => <div>{formatDate(admin.lastLogin)}</div>
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (admin: AdminUser) => (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button 
                      variant="primary" 
                      size="small" 
                      outlined
                      icon={<FaEdit />}
                      onClick={() => handleEditUser(admin)}
                    />
                    <Button 
                      variant="danger" 
                      size="small" 
                      outlined
                      icon={<FaTrash />}
                      onClick={() => console.log('Delete user:', admin.id)}
                    />
                    <Button 
                      variant="secondary" 
                      size="small" 
                      outlined
                      icon={<FaKey />}
                      onClick={() => console.log('Reset password:', admin.id)}
                    />
                  </div>
                )
              }
            ]}
            data={filteredAdmins}
            keyExtractor={(item) => item.id}
            emptyMessage="No admin users found."
            pagination={{
              currentPage: 1,
              totalPages: 1,
              totalItems: filteredAdmins.length,
              itemsPerPage: 10,
              onPageChange: (page) => console.log(`Go to page ${page}`)
            }}
          />
        </Card>
      )}
      
      {activeTab === 'subscribers' && (
        <Card title="Subscribers">
          <DataTable
            columns={[
              {
                key: 'msisdn',
                header: 'Phone Number',
                render: (subscriber: Subscriber) => <div>{subscriber.msisdn}</div>
              },
              {
                key: 'optInStatus',
                header: 'Opt-In Status',
                render: (subscriber: Subscriber) => (
                  <div style={{ 
                    color: subscriber.optInStatus === 'Yes' ? 'green' : 'red',
                    fontWeight: 'bold'
                  }}>
                    {subscriber.optInStatus}
                  </div>
                )
              },
              {
                key: 'points',
                header: 'Points',
                render: (subscriber: Subscriber) => <div>{subscriber.points}</div>
              },
              {
                key: 'totalRecharge',
                header: 'Total Recharge',
                render: (subscriber: Subscriber) => <div>{subscriber.totalRecharge}</div>
              },
              {
                key: 'lastRecharge',
                header: 'Last Recharge',
                render: (subscriber: Subscriber) => <div>{formatDate(subscriber.lastRecharge)}</div>
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (subscriber: Subscriber) => (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button 
                      variant="primary" 
                      size="small" 
                      outlined
                      icon={<FaEdit />}
                      onClick={() => console.log('Edit subscriber:', subscriber.id)}
                    />
                    <Button 
                      variant="danger" 
                      size="small" 
                      outlined
                      icon={<FaTrash />}
                      onClick={() => console.log('Delete subscriber:', subscriber.id)}
                    />
                  </div>
                )
              }
            ]}
            data={filteredSubscribers}
            keyExtractor={(item) => item.id}
            emptyMessage="No subscribers found."
            pagination={{
              currentPage: 1,
              totalPages: 1,
              totalItems: filteredSubscribers.length,
              itemsPerPage: 10,
              onPageChange: (page) => console.log(`Go to page ${page}`)
            }}
          />
        </Card>
      )}
      
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <h2>
                {modalMode === 'add' ? 'Add' : 'Edit'} Admin User
              </h2>
              <button onClick={() => setShowModal(false)}>&times;</button>
            </ModalHeader>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>Name</FormLabel>
                <FormInput 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Email</FormLabel>
                <FormInput 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Role</FormLabel>
                <FormSelect
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Permissions</FormLabel>
                <CheckboxGroup>
                  <CheckboxLabel>
                    <input 
                      type="checkbox"
                      name="manage_users"
                      checked={formData.permissions.manage_users}
                      onChange={handleCheckboxChange}
                    />
                    Manage Users
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input 
                      type="checkbox"
                      name="manage_draws"
                      checked={formData.permissions.manage_draws}
                      onChange={handleCheckboxChange}
                    />
                    Manage Draws
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input 
                      type="checkbox"
                      name="view_analytics"
                      checked={formData.permissions.view_analytics}
                      onChange={handleCheckboxChange}
                    />
                    View Analytics
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input 
                      type="checkbox"
                      name="manage_notifications"
                      checked={formData.permissions.manage_notifications}
                      onChange={handleCheckboxChange}
                    />
                    Manage Notifications
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input 
                      type="checkbox"
                      name="manage_csv"
                      checked={formData.permissions.manage_csv}
                      onChange={handleCheckboxChange}
                    />
                    Manage CSV Uploads
                  </CheckboxLabel>
                </CheckboxGroup>
              </FormGroup>
              
              <ModalFooter>
                <Button 
                  variant="secondary" 
                  outlined
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                >
                  {modalMode === 'add' ? 'Add User' : 'Update User'}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageLayout>
  );
};

export default UserManagement;
