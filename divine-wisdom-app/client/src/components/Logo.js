import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LogoWrapper = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(94, 26, 135, 0.1), rgba(162, 57, 202, 0.1));
  border-radius: 8px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(94, 26, 135, 0.2), rgba(162, 57, 202, 0.2));
  }
`;

const LogoText = styled.span`
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  
  .krishna {
    background: linear-gradient(90deg, #fff, #a239ca);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .wisdom {
    color: rgba(255, 255, 255, 0.9);
    margin-left: 4px;
  }
`;

const Logo = () => {
  return (
    <LogoWrapper to="/">
      <LogoText>
        <span className="krishna">Krishna's</span>
        <span className="wisdom">Wisdom</span>
      </LogoText>
    </LogoWrapper>
  );
};

export default Logo; 