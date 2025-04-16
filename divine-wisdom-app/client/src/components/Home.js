import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import fluteImage from '../assets/krishna-flute.png';

const HomeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #e8f4e5 0%, #f5f7fa 100%);
  position: relative;
  overflow: hidden;
`;

const FluteDecoration = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 800px;
  height: 120px;
  background-image: url(${fluteImage});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.9;
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  margin-top: 100px;
  width: 100%;
  z-index: 1;
`;

const HeroSection = styled.section`
  max-width: 800px;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  color: #2C5F2D;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #444;
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const InputContainer = styled.form`
  display: flex;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  gap: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 15px 20px;
  border-radius: 30px;
  border: none;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.3s ease;
  
  &:focus {
    box-shadow: 0 2px 20px rgba(44, 95, 45, 0.2);
  }
`;

const SendButton = styled.button`
  background-color: #2C5F2D;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(44, 95, 45, 0.3);
  font-size: 1.2rem;
  
  &:hover {
    background-color: #4b9e4c;
    transform: scale(1.05);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const OrDivider = styled.div`
  margin: 20px 0;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
  
  &:before, &:after {
    content: "";
    flex: 1;
    border-bottom: 1px solid rgba(44, 95, 45, 0.3);
  }
  
  span {
    margin: 0 10px;
    color: #666;
    font-size: 0.9rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: #2C5F2D;
  color: white;
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(44, 95, 45, 0.3);
  
  &:hover {
    background-color: #4b9e4c;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(44, 95, 45, 0.4);
  }
`;

const FeaturesSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  margin-top: 40px;
  max-width: 1200px;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 30px;
  width: 300px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  border-top: 4px solid #2C5F2D;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #2C5F2D;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
`;

const Quote = styled.div`
  margin: 50px auto;
  max-width: 700px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  font-style: italic;
  position: relative;

  &:before, &:after {
    content: '"';
    font-size: 60px;
    font-family: Georgia, serif;
    color: #2C5F2D;
    opacity: 0.3;
    position: absolute;
  }

  &:before {
    top: 0;
    left: 10px;
  }

  &:after {
    bottom: -20px;
    right: 10px;
  }
`;

const QuoteText = styled.p`
  font-size: 1.2rem;
  color: #333;
  line-height: 1.8;
  margin-bottom: 10px;
`;

const QuoteSource = styled.p`
  font-size: 0.9rem;
  color: #666;
  text-align: right;
  font-weight: bold;
`;

const Home = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    localStorage.setItem('initialQuestion', input);
    navigate('/chat');
  };

  return (
    <HomeContainer>
      <FluteDecoration />
      <ContentWrapper>
        <HeroSection>
          <Title>Krishna's Divine Guidance</Title>
          <Subtitle>
            Connect with the timeless wisdom of Lord Krishna and receive spiritual guidance
            for your life's journey. Experience the divine grace through a personal conversation.
          </Subtitle>
          
          <InputContainer onSubmit={handleSubmit}>
            <MessageInput
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Krishna a question..."
            />
            <SendButton type="submit" disabled={input.trim() === ''}>
              ➤
            </SendButton>
          </InputContainer>
          
          <OrDivider>
            <span>OR</span>
          </OrDivider>
          
          <CTAButton to="/chat">Begin Your Spiritual Journey</CTAButton>
        </HeroSection>
        
        <Quote>
          <QuoteText>
            "Whenever dharma declines and the purpose of life is forgotten, I manifest myself on earth. 
            I am born in every age to protect the good, to destroy evil, and to reestablish dharma."
          </QuoteText>
          <QuoteSource>- Bhagavad Gita 4.7-4.8</QuoteSource>
        </Quote>
        
        <FeaturesSection>
          <FeatureCard>
            <FeatureTitle>Divine Wisdom</FeatureTitle>
            <FeatureDescription>
              Receive guidance based on the eternal teachings of the Bhagavad Gita and Lord Krishna's wisdom.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureTitle>Personal Connection</FeatureTitle>
            <FeatureDescription>
              Experience a one-on-one conversation with divine consciousness through Krishna's teachings.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureTitle>Spiritual Growth</FeatureTitle>
            <FeatureDescription>
              Find answers to life's deepest questions and embark on a journey of self-discovery.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesSection>
      </ContentWrapper>
    </HomeContainer>
  );
};

export default Home; 