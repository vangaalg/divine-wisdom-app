import React from 'react';
import styled, { keyframes } from 'styled-components';
import Header from '../components/Layout/Header';
import Chat from '../components/Chat';

const twinkle = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const shooting = keyframes`
  0% {
    transform: translateX(0) translateY(0) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: translateX(-1000px) translateY(1000px) rotate(-45deg);
    opacity: 0;
  }
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0524 0%, #3b0d4a 30%, #5e1a87 60%, #341d5e 100%);
  background-attachment: fixed;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: fixed;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(2px 2px at ${() => Math.random() * 100}% ${() => Math.random() * 100}%,
      rgba(255, 255, 255, 0.7) 0%,
      rgba(0, 0, 0, 0) 100%),
      radial-gradient(2px 2px at ${() => Math.random() * 100}% ${() => Math.random() * 100}%,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(0, 0, 0, 0) 100%),
      radial-gradient(2px 2px at ${() => Math.random() * 100}% ${() => Math.random() * 100}%,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(0, 0, 0, 0) 100%);
    background-size: 800px 800px, 1000px 1000px, 1200px 1200px;
    animation: ${twinkle} 8s infinite;
    opacity: 0.6;
    z-index: 0;
  }
`;

const ShootingStar = styled.div`
  position: fixed;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), transparent);
  animation: ${shooting} ${props => props.duration || '6s'} linear infinite;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  opacity: 0;
  animation-delay: ${props => props.delay || '0s'};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  position: relative;
  z-index: 1;
`;

const ChatPage = () => {
  return (
    <PageContainer>
      <ShootingStar top={20} left={80} duration="4s" delay="2s" />
      <ShootingStar top={50} left={90} duration="6s" delay="4s" />
      <ShootingStar top={70} left={85} duration="5s" delay="6s" />
      <Header />
      <MainContent>
        <Chat />
      </MainContent>
    </PageContainer>
  );
};

export default ChatPage; 