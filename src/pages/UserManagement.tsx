// /home/ubuntu/bridgetunes-admin-new/src/pages/UserManagement.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUserShield, FaUserPlus, FaEdit, FaTrash, FaKey } from "react-icons/fa";
import PageLayout from "../components/PageLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import { useDemoMode } from "../context/DemoModeContext";
import UserTable from "../components/user/UserTable"; // Assuming this is now using the correct User type
import { User } from "../types/auth.types"; // Import central User type
import { UserCreationParams, UserUpdateParams } from "../types/user.types"; // Keep specific action types

// Styled components (keep as is)
const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid ${(props) => props.theme.colors.light};
  margin-bottom: 1.5rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.active ? props.theme.colors.primary : "transparent")};
  margin-bottom: -2px;
  color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.gray};
  font-weight: ${(props) =>
    props.active
      ? props.theme.fontWeights.semibold
      : props.theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.5rem;
  }

  &:hover {
    color: ${(props) => props.theme.colors.primary};
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
  border: 1px solid ${(props) => props.theme.colors.light};
  width: 300px;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary + "30"};
  }
`;

const RoleBadge = styled.span<{ role: string }>`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${(props) => {
    switch (props.role) {
      // Assuming role values match the central User type ('admin', 'manager', 'viewer')
      case "admin":
        return `
          background-color: ${props.theme.colors.info + "20"};
          color: ${props.theme.colors.info};
        `;
      case "manager": // Added manager style if needed
        return `
          background-color: ${props.theme.colors.success + "20"}; 
          color: ${props.theme.colors.success};
        `;
      case "viewer":
        return `
          background-color: ${props.theme.colors.secondary + "20"};
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

// PermissionList and PermissionTag can remain if permissions are handled separately
// Or removed/adapted if permissions are derived solely from role
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
  background-color: ${(props) => props.theme.colors.light};
  color: ${(props) => props.theme.colors.gray};
`;

// Modal components (keep as is)
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
    color: ${(props) => props.theme.colors.dark};
  }

  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${(props) => props.theme.colors.gray};

    &:hover {
      color: ${(props) => props.theme.colors.danger};
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.dark};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.light};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary + "30"};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.light};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary + "30"};
  }
`;

// CheckboxGroup and CheckboxLabel can remain if permissions are handled separately
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
  color: ${(props) => props.theme.colors.dark};

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

// Remove local AdminUser interface
// interface AdminUser { ... }

// Keep Subscriber interface for now, or move to a central types file later
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
  const [activeTab, setActiveTab] = useState<string>("admins");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Use central User type

  // Form state - adapt if permissions are not separate
  // For simplicity, let's assume permissions are derived from role for now
  const [formData, setFormData] = useState<Partial<UserCreationParams>>({
    name: "",
    email: "",
    username: "", // Add username if needed for creation
    password: "", // Add password for creation
    role: "viewer", // Default role
  });

  // Mock data for demo mode - MUST conform to central User type
  const mockAdmins: User[] = [
    {
      id: "1",
      name: "John Doe",
      username: "johndoe", // Add username
      email: "john.doe@example.com",
      role: "admin", // Use roles defined in central User type
      // permissions: { ... }, // Remove separate permissions if derived from role
      lastLogin: "2023-04-25T15:30:00Z",
      status: "active", // Add status
      createdAt: "2023-01-15T10:00:00Z", // Add createdAt
      updatedAt: "2023-04-25T15:30:00Z", // Add updatedAt
    },
    {
      id: "2",
      name: "Jane Smith",
      username: "janesmith",
      email: "jane.smith@example.com",
      role: "manager",
      lastLogin: "2023-04-24T10:15:00Z",
      status: "active",
      createdAt: "2023-02-10T11:00:00Z",
      updatedAt: "2023-04-24T10:15:00Z",
    },
    {
      id: "3",
      name: "Mike Johnson",
      username: "mikej",
      email: "mike.johnson@example.com",
      role: "viewer",
      lastLogin: "2023-04-23T14:45:00Z",
      status: "inactive",
      createdAt: "2023-03-01T12:00:00Z",
      updatedAt: "2023-04-23T14:45:00Z",
    },
    // Add more mock users as needed, ensuring they match the User type
  ];

  const mockSubscribers: Subscriber[] = [
    // Keep mockSubscribers as is for now
    {
      id: "1",
      msisdn: "08036785165",
      optInStatus: "Yes",
      points: 15,
      totalRecharge: "₦2,500",
      lastRecharge: "2023-04-25T15:30:00Z",
    },
    {
      id: "2",
      msisdn: "08033724661",
      optInStatus: "Yes",
      points: 8,
      totalRecharge: "₦1,200",
      lastRecharge: "2023-04-24T10:15:00Z",
    },
    {
      id: "3",
      msisdn: "08037954885",
      optInStatus: "No",
      points: 3,
      totalRecharge: "₦300",
      lastRecharge: "2023-04-23T14:45:00Z",
    },
    {
      id: "4",
      msisdn: "08031074159",
      optInStatus: "Yes",
      points: 22,
      totalRecharge: "₦3,800",
      lastRecharge: "2023-04-22T09:30:00Z",
    },
  ];

  // Filter users based on search query
  const filteredAdmins = mockAdmins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.username.toLowerCase().includes(searchQuery.toLowerCase()) // Add username search
  );

  const filteredSubscribers = mockSubscribers.filter((subscriber) =>
    subscriber.msisdn.includes(searchQuery)
  );

  // Format date (keep as is)
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle form input change (adapt based on final form fields)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle checkbox change (remove if permissions are derived from role)
  // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, checked } = e.target;
  //   setFormData({
  //     ...formData,
  //     permissions: {
  //       ...formData.permissions,
  //       [name]: checked,
  //     },
  //   });
  // };

  // Open modal for adding new user
  const handleAddUser = () => {
    setModalMode("add");
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      role: "viewer",
    });
    setShowModal(true);
  };

  // Open modal for editing user - Use central User type
  const handleEditUser = (user: User) => {
    setModalMode("edit");
    setSelectedUser(user);
    // Adapt form data based on UserUpdateParams and User type
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      // Password is not typically edited here
    });
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real implementation, this would call an API
    // using userService.createUser or userService.updateUser
    if (modalMode === "add") {
      console.log("Creating user:", formData as UserCreationParams);
      // Call userService.createUser(formData as UserCreationParams);
    } else if (selectedUser) {
      console.log("Updating user:", selectedUser.id, formData as UserUpdateParams);
      // Call userService.updateUser(selectedUser.id, formData as UserUpdateParams);
    }

    // Close the modal
    setShowModal(false);
  };

  // Define columns for the DataTable, using the central User type
  const adminColumns = [
    {
      key: "name",
      header: "Name",
      render: (user: User) => <div>{user.name}</div>,
    },
    {
      key: "email",
      header: "Email",
      render: (user: User) => <div>{user.email}</div>,
    },
    {
      key: "role",
      header: "Role",
      render: (user: User) => (
        <RoleBadge role={user.role}>{user.role}</RoleBadge>
      ),
    },
    // Remove separate permissions column if derived from role
    // {
    //   key: "permissions",
    //   header: "Permissions",
    //   render: (user: User) => (...),
    // },
    {
      key: "status", // Add status column if needed
      header: "Status",
      render: (user: User) => (
        <span
          style={{
            color: user.status === "active" ? "green" : user.status === "inactive" ? "red" : "orange",
          }}
        >
          {user.status ?? "N/A"}
        </span>
      ),
    },
    {
      key: "lastLogin",
      header: "Last Login",
      render: (user: User) => <div>{formatDate(user.lastLogin)}</div>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: User) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            variant="primary"
            size="small"
            outlined
            icon={<FaEdit />}
            onClick={() => handleEditUser(user)}
          />
          <Button
            variant="danger"
            size="small"
            outlined
            icon={<FaTrash />}
            onClick={() => console.log("Delete user:", user.id)} // Replace with actual delete call
          />
          <Button
            variant="secondary"
            size="small"
            outlined
            icon={<FaKey />}
            onClick={() => console.log("Reset password:", user.id)} // Replace with actual reset call
          />
        </div>
      ),
    },
  ];

  const subscriberColumns = [
    // Keep subscriber columns as is for now
    {
      key: "msisdn",
      header: "Phone Number",
      render: (subscriber: Subscriber) => <div>{subscriber.msisdn}</div>,
    },
    {
      key: "optInStatus",
      header: "Opt-In Status",
      render: (subscriber: Subscriber) => (
        <div
          style={{
            color: subscriber.optInStatus === "Yes" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {subscriber.optInStatus}
        </div>
      ),
    },
    {
      key: "points",
      header: "Points",
      render: (subscriber: Subscriber) => <div>{subscriber.points}</div>,
    },
    {
      key: "totalRecharge",
      header: "Total Recharge",
      render: (subscriber: Subscriber) => <div>{subscriber.totalRecharge}</div>,
    },
    {
      key: "lastRecharge",
      header: "Last Recharge",
      render: (subscriber: Subscriber) => (
        <div>{formatDate(subscriber.lastRecharge)}</div>
      ),
    },
  ];

  return (
    <PageLayout
      title="User Management"
      description="Manage admin users and subscribers for the MyNumba Don Win promotion."
    >
      <TabsContainer>
        <Tab active={activeTab === "admins"} onClick={() => setActiveTab("admins")}>
          <FaUserShield /> Admin Users
        </Tab>
        <Tab
          active={activeTab === "subscribers"}
          onClick={() => setActiveTab("subscribers")}
        >
          <FaUserShield /> Subscribers
        </Tab>
      </TabsContainer>

      <ActionBar>
        <SearchInput
          type="text"
          placeholder={
            activeTab === "admins" ? "Search admins..." : "Search subscribers..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {activeTab === "admins" && (
          <Button variant="primary" icon={<FaUserPlus />} onClick={handleAddUser}>
            Add Admin
          </Button>
        )}
      </ActionBar>

      {activeTab === "admins" && (
        <Card title="Admin Users">
          {/* Use DataTable with updated columns and data */}
          <DataTable
            columns={adminColumns}
            data={filteredAdmins}
            keyExtractor={(item) => item.id}
            emptyMessage="No admin users found."
            pagination={{
              currentPage: 1,
              totalPages: 1,
              totalItems: filteredAdmins.length,
              itemsPerPage: 10,
              onPageChange: (page) => console.log(`Go to page ${page}`),
            }}
          />
        </Card>
      )}

      {activeTab === "subscribers" && (
        <Card title="Subscribers">
          <DataTable
            columns={subscriberColumns}
            data={filteredSubscribers}
            keyExtractor={(item) => item.id}
            emptyMessage="No subscribers found."
            pagination={{
              currentPage: 1,
              totalPages: 1,
              totalItems: filteredSubscribers.length,
              itemsPerPage: 10,
              onPageChange: (page) => console.log(`Go to page ${page}`),
            }}
          />
        </Card>
      )}

      {/* Modal for Add/Edit User */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>{modalMode === "add" ? "Add New Admin" : "Edit Admin"}</h2>
              <button onClick={() => setShowModal(false)}>&times;</button>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="name">Name</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormInput
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              {modalMode === "add" && (
                <FormGroup>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormInput
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              )}
              {modalMode === "add" && (
                <FormGroup>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormInput
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              )}
              <FormGroup>
                <FormLabel htmlFor="role">Role</FormLabel>
                <FormSelect
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="viewer">Viewer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </FormSelect>
              </FormGroup>

              {/* Remove separate permissions checkboxes if derived from role */}
              {/* <FormGroup>
                <FormLabel>Permissions</FormLabel>
                <CheckboxGroup>
                  {Object.keys(formData.permissions).map((key) => (
                    <CheckboxLabel key={key}>
                      <input
                        type="checkbox"
                        name={key}
                        checked={formData.permissions[key as keyof AdminPermissions]}
                        onChange={handleCheckboxChange}
                      />
                      {key.replace("_", " ")}
                    </CheckboxLabel>
                  ))}
                </CheckboxGroup>
              </FormGroup> */}

              <ModalFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {modalMode === "add" ? "Create Admin" : "Save Changes"}
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

