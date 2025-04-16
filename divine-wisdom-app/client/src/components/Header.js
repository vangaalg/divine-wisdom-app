import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../supabase';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px 0;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 600;
  color: #2C5F2D;
  text-decoration: none;
  display: flex;
  align-items: center;

  &:hover {
    color: #4b9e4c;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #2C5F2D;
  font-size: 16px;
  text-decoration: none;
  transition: color 0.3s ease;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: #4b9e4c;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #4b9e4c;
    
    &:after {
      width: 100%;
    }
  }
`;

const AuthButton = styled.button`
  background-color: #2C5F2D;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #234824;
    transform: translateY(-2px);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AvatarLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  position: relative;
  
  &:hover::after {
    content: 'View Profile';
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 5px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e8f4e5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2C5F2D;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  border: 2px solid #2C5F2D;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(44, 95, 45, 0.3);
  }
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (isAuthenticated) {
      // Logout
      await signOut();
      navigate('/');
    } else {
      // Navigate to login
      navigate('/login');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <HeaderContainer>
      <NavContainer>
        <Logo to="/">Krishna's Divine Wisdom</Logo>
        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/chat">Spiritual Guidance</NavLink>
          <NavLink to="/about">About</NavLink>
          
          {isAuthenticated ? (
            <UserInfo>
              <AvatarLink to="/profile">
                <Avatar>
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" />
                  ) : (
                    getInitials(user.user_metadata?.full_name || 'User')
                  )}
                </Avatar>
              </AvatarLink>
              <NavLink to="/profile">My Profile</NavLink>
              <AuthButton onClick={handleAuth}>Logout</AuthButton>
            </UserInfo>
          ) : (
            <AuthButton onClick={handleAuth}>Login</AuthButton>
          )}
        </Nav>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header; 