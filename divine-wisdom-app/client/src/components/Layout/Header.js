import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(15, 5, 36, 0.7);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(94, 26, 135, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #fff;
  font-weight: 500;
  position: relative;
  padding: 0.5rem 0;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background: linear-gradient(90deg, #5e1a87, #a239ca);
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1.2rem;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.signin {
    background: transparent;
    color: #fff;
    border: 1px solid rgba(94, 26, 135, 0.7);
    
    &:hover {
      background: rgba(94, 26, 135, 0.2);
    }
  }
  
  &.signup {
    background: linear-gradient(90deg, #5e1a87, #a239ca);
    color: #fff;
    border: none;
    box-shadow: 0 4px 15px rgba(94, 26, 135, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(94, 26, 135, 0.4);
    }
  }
  
  &.logout {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <HeaderContainer>
      <Logo />
      
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/wisdom">Wisdom</NavLink>
        {user && <NavLink to="/profile">Profile</NavLink>}
      </Nav>
      
      <AuthButtons>
        {user ? (
          <Button className="logout" onClick={handleSignOut}>Sign Out</Button>
        ) : (
          <>
            <Button className="signin" onClick={() => navigate('/login')}>Sign In</Button>
            <Button className="signup" onClick={() => navigate('/signup')}>Sign Up</Button>
          </>
        )}
      </AuthButtons>
    </HeaderContainer>
  );
}

export default Header; 