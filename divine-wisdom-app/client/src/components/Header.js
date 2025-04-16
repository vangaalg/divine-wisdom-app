import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../supabase';

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(26, 35, 126, 0.5); }
  50% { box-shadow: 0 0 15px rgba(26, 35, 126, 0.8); }
  100% { box-shadow: 0 0 5px rgba(26, 35, 126, 0.5); }
`;

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.colors.cardBg};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 12px;
`;

const LogoIcon = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.gold};
  display: flex;
  align-items: center;
  
  i {
    transition: transform 0.5s ease;
  }
  
  &:hover i {
    transform: rotate(15deg);
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const Logo = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 26px;
  color: ${({ theme }) => theme.colors.krishnaBlue};
  text-decoration: none;
  letter-spacing: 0.5px;
`;

const Tagline = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  letter-spacing: 0.5px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: 15px;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme, active }) => 
    active ? theme.colors.krishnaBlue : theme.colors.textPrimary};
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  font-weight: ${({ active }) => active ? '500' : '400'};

  &:after {
    content: '';
    position: absolute;
    width: ${({ active }) => active ? '100%' : '0'};
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: ${({ theme }) => theme.colors.krishnaBlue};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.krishnaBlue};
    
    &:after {
      width: 100%;
    }
  }
`;

const AuthButton = styled.button`
  background: ${({ theme, outlined }) => 
    outlined ? 'transparent' : theme.colors.krishnaGradient};
  color: ${({ theme, outlined }) => 
    outlined ? theme.colors.krishnaBlue : 'white'};
  border: ${({ theme, outlined }) => 
    outlined ? `1px solid ${theme.colors.krishnaBlue}` : 'none'};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
    background: ${({ theme, outlined }) => 
      outlined ? 'transparent' : 'linear-gradient(135deg, #1A237E 20%, #4A148C 80%)'};
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
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.peacockGradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  border: 2px solid white;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.light};
  
  &:hover {
    transform: scale(1.1);
    animation: ${glow} 1.5s infinite ease-in-out;
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
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

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
    <HeaderContainer style={{
      boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.15)' : 'none',
      padding: scrolled ? '10px 0' : '15px 0'
    }}>
      <NavContainer>
        <LogoContainer to="/">
          <LogoIcon>
            <i className="fas fa-om"></i>
          </LogoIcon>
          <LogoText>
            <Logo>Krishna's Wisdom</Logo>
            <Tagline>Divine Guidance for Your Soul</Tagline>
          </LogoText>
        </LogoContainer>
        
        <Nav>
          <NavLink to="/" active={location.pathname === '/' ? 1 : 0}>Home</NavLink>
          <NavLink to="/chat" active={location.pathname === '/chat' ? 1 : 0}>Guidance</NavLink>
          <NavLink to="/about" active={location.pathname === '/about' ? 1 : 0}>About</NavLink>
          
          {isAuthenticated ? (
            <UserInfo>
              <AvatarLink to="/profile">
                <Avatar>
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" />
                  ) : (
                    getInitials(user.user_metadata?.full_name || user.email?.split('@')[0] || 'U')
                  )}
                </Avatar>
              </AvatarLink>
              <AuthButton outlined={1} onClick={handleAuth}>
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </AuthButton>
            </UserInfo>
          ) : (
            <AuthButton onClick={handleAuth}>
              <i className="fas fa-sign-in-alt"></i>
              Login
            </AuthButton>
          )}
        </Nav>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header; 