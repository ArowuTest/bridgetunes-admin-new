import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaHome, 
  FaRandom, 
  FaUsers, 
  FaBell, 
  FaFileUpload, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

// Styled components
const SidebarContainer = styled.div`
  width: 250px;
  height: 100%;
  background: linear-gradient(180deg, #333333 0%, #1a1a1a 100%);
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow-y: auto;
  padding-top: 70px; /* Space for header */
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0;
  padding: 0;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #e0e0e0;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  
  &:hover {
    background-color: rgba(255, 204, 0, 0.1);
    color: #ffcc00;
  }
  
  &.active {
    background-color: rgba(255, 204, 0, 0.2);
    color: #ffcc00;
    border-left: 4px solid #ffcc00;
  }
  
  svg {
    margin-right: 15px;
    font-size: 1.2rem;
  }
`;

const NavText = styled.span`
  font-size: 1rem;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px 20px;
  background: none;
  border: none;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  border-left: 4px solid transparent;
  
  &:hover {
    background-color: rgba(255, 0, 0, 0.1);
    color: #ff6b6b;
  }
  
  svg {
    margin-right: 15px;
    font-size: 1.2rem;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 10px 0;
`;

const UserSection = styled.div`
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
`;

const UserAvatar = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #ffcc00;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0 auto 15px;
`;

const UserName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
`;

const UserRole = styled.div`
  font-size: 0.85rem;
  color: #bbb;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user || !user.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <SidebarContainer>
      <UserSection>
        <UserAvatar>{getInitials()}</UserAvatar>
        <UserName>{user?.name || 'Admin User'}</UserName>
        <UserRole>{user?.role || 'Admin'}</UserRole>
      </UserSection>
      
      <NavList>
        <NavItem>
          <StyledNavLink to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
            <FaHome />
            <NavText>Dashboard</NavText>
          </StyledNavLink>
        </NavItem>
        
        <NavItem>
          <StyledNavLink to="/draws" className={location.pathname === '/draws' ? 'active' : ''}>
            <FaRandom />
            <NavText>Draw Management</NavText>
          </StyledNavLink>
        </NavItem>
        
        <NavItem>
          <StyledNavLink to="/users" className={location.pathname === '/users' ? 'active' : ''}>
            <FaUsers />
            <NavText>User Management</NavText>
          </StyledNavLink>
        </NavItem>
        
        <NavItem>
          <StyledNavLink to="/notifications" className={location.pathname === '/notifications' ? 'active' : ''}>
            <FaBell />
            <NavText>Notifications</NavText>
          </StyledNavLink>
        </NavItem>
        
        <NavItem>
          <StyledNavLink to="/csv" className={location.pathname === '/csv' ? 'active' : ''}>
            <FaFileUpload />
            <NavText>CSV Upload</NavText>
          </StyledNavLink>
        </NavItem>
        
        <Divider />
        
        <NavItem>
          <LogoutButton onClick={logout}>
            <FaSignOutAlt />
            <NavText>Logout</NavText>
          </LogoutButton>
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
};

export default Navigation;
