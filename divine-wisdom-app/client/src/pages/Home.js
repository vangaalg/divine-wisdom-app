import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 0 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(94, 26, 135, 0.3) 0%, transparent 70%);
    z-index: -1;
  }
`;

const MeditationFigure = styled.div`
  width: 160px;
  height: 200px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 80px 80px 0 0;
  position: relative;
  margin-bottom: 3rem;
  
  &::before {
    content: '';
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(162, 57, 202, 0.4) 0%, rgba(94, 26, 135, 0.1) 50%, transparent 70%);
    top: -130px;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 30px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const StarsBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 3px;
    background: white;
    border-radius: 50%;
    box-shadow: 
      15vw 10vh 0 0 rgba(255, 255, 255, 0.8),
      25vw 20vh 0 1px rgba(255, 255, 255, 0.6),
      35vw 15vh 0 0 rgba(255, 255, 255, 0.9),
      45vw 35vh 0 1px rgba(255, 255, 255, 0.7),
      55vw 25vh 0 0 rgba(255, 255, 255, 0.8),
      65vw 45vh 0 0 rgba(255, 255, 255, 0.7),
      75vw 55vh 0 1px rgba(255, 255, 255, 0.9),
      85vw 65vh 0 0 rgba(255, 255, 255, 0.6),
      10vw 75vh 0 0 rgba(255, 255, 255, 0.8),
      20vw 85vh 0 1px rgba(255, 255, 255, 0.7),
      30vw 70vh 0 0 rgba(255, 255, 255, 0.9),
      40vw 80vh 0 0 rgba(255, 255, 255, 0.6),
      50vw 60vh 0 1px rgba(255, 255, 255, 0.8),
      60vw 90vh 0 0 rgba(255, 255, 255, 0.7),
      70vw 50vh 0 0 rgba(255, 255, 255, 0.9),
      80vw 40vh 0 1px rgba(255, 255, 255, 0.6),
      90vw 30vh 0 0 rgba(255, 255, 255, 0.8);
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #fff, #a239ca);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  max-width: 700px;
  margin-bottom: 2.5rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(90deg, #5e1a87, #a239ca);
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(94, 26, 135, 0.4);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(94, 26, 135, 0.6);
  }
`;

const Home = () => {
  return (
    <HomeContainer>
      <Header />
      <HeroSection>
        <StarsBackground />
        <MeditationFigure />
        <HeroTitle>Discover Divine Wisdom</HeroTitle>
        <HeroSubtitle>
          Explore the cosmic knowledge of ancient texts and spiritual teachings to guide your journey towards enlightenment and inner peace.
        </HeroSubtitle>
        <CTAButton to="/wisdom">Begin Your Journey</CTAButton>
      </HeroSection>
    </HomeContainer>
  );
};

export default Home; 