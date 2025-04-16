import React from 'react';
import styled, { keyframes } from 'styled-components';
import AuthForm from './AuthForm';

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

const AuthPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 70% 30%, 
                              rgba(255, 193, 7, 0.15) 0%, 
                              rgba(74, 20, 140, 0.05) 70%);
    z-index: -1;
  }
`;

const AuthContainer = styled.div`
  max-width: 500px;
  width: 100%;
  margin: 20px auto;
  padding: 40px;
  background-color: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.divine};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, 
                ${({ theme }) => theme.colors.krishnaBlue}, 
                ${({ theme }) => theme.colors.peacockFeather}, 
                ${({ theme }) => theme.colors.gold}, 
                ${({ theme }) => theme.colors.peacockFeather}, 
                ${({ theme }) => theme.colors.krishnaBlue});
    background-size: 200% 100%;
    animation: ${shimmer} 4s linear infinite;
  }
`;

const KrishnaImageContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto 30px;
  position: relative;
  animation: ${floatAnimation} 5s ease-in-out infinite;
`;

const KrishnaSymbol = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.krishnaGradient};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 80px;
  box-shadow: ${({ theme }) => theme.shadows.divine};
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.krishnaBlue};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.2rem;
  letter-spacing: 1px;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
  font-style: italic;
`;

const Login = () => {
  return (
    <AuthPageContainer>
      <KrishnaImageContainer>
        <KrishnaSymbol>
          <i className="fas fa-om"></i>
        </KrishnaSymbol>
      </KrishnaImageContainer>
      
      <AuthContainer>
        <Title>Divine Connection</Title>
        <Subtitle>Seek Krishna's guidance on your spiritual path</Subtitle>
        <AuthForm />
      </AuthContainer>
    </AuthPageContainer>
  );
};

export default Login; 