import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: ${({ theme }) => `linear-gradient(to top, rgba(26, 35, 126, 0.05), ${theme.colors.cardBg})`};
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  padding: 40px 0 20px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QuoteSection = styled.div`
  text-align: center;
  max-width: 800px;
  margin-bottom: 30px;
  padding: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ theme }) => `linear-gradient(to right, rgba(26, 35, 126, 0.02), rgba(26, 35, 126, 0.08), rgba(26, 35, 126, 0.02))`};
`;

const Quote = styled.p`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.krishnaBlue};
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 10px;
  
  &::before, &::after {
    content: '"';
    color: ${({ theme }) => theme.colors.gold};
    font-size: 24px;
  }
`;

const QuoteSource = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const FooterNav = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
  padding: 0 20px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    max-width: none;
    margin-bottom: 20px;
  }
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.krishnaBlue};
  margin-bottom: 15px;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 30px;
    height: 3px;
    background: ${({ theme }) => theme.colors.gold};
    margin: 8px auto 0;
    border-radius: 2px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 14px;
  text-decoration: none;
  transition: ${({ theme }) => theme.transitions.default};
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    color: ${({ theme }) => theme.colors.peacockFeather};
    font-size: 12px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.krishnaBlue};
    transform: translateX(3px);
  }
`;

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 14px;
  text-decoration: none;
  transition: ${({ theme }) => theme.transitions.default};
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    color: ${({ theme }) => theme.colors.peacockFeather};
    font-size: 12px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.krishnaBlue};
    transform: translateX(3px);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 18px;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.krishnaBlue};
    transform: translateY(-3px);
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.1), transparent);
  margin: 20px 0;
`;

const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <QuoteSection>
          <Quote>
            Whenever there is a decline in righteousness and an increase in unrighteousness, at that time I manifest myself.
          </Quote>
          <QuoteSource>- Lord Krishna, Bhagavad Gita 4.7</QuoteSource>
        </QuoteSection>
        
        <FooterNav>
          <FooterSection>
            <SectionTitle>Navigation</SectionTitle>
            <FooterLinks>
              <FooterLink to="/"><i className="fas fa-home"></i> Home</FooterLink>
              <FooterLink to="/chat"><i className="fas fa-comment-dots"></i> Divine Guidance</FooterLink>
              <FooterLink to="/about"><i className="fas fa-info-circle"></i> About</FooterLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <SectionTitle>Resources</SectionTitle>
            <FooterLinks>
              <ExternalLink href="https://www.holy-bhagavad-gita.org/" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-book"></i> Bhagavad Gita Online
              </ExternalLink>
              <ExternalLink href="https://iskcondesiretree.com/" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-tree"></i> ISKCON Resources
              </ExternalLink>
              <ExternalLink href="https://krishna.org/meditation/" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-om"></i> Meditation Guide
              </ExternalLink>
            </FooterLinks>
          </FooterSection>
          
          <FooterSection>
            <SectionTitle>Connect</SectionTitle>
            <FooterLinks>
              <ExternalLink href="mailto:contact@divinewisdom.com">
                <i className="fas fa-envelope"></i> Contact Us
              </ExternalLink>
              <FooterLink to="/terms"><i className="fas fa-file-contract"></i> Terms of Service</FooterLink>
              <FooterLink to="/privacy"><i className="fas fa-shield-alt"></i> Privacy Policy</FooterLink>
            </FooterLinks>
            <SocialLinks>
              <SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </SocialLink>
              <SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </SocialLink>
              <SocialLink href="#" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </SocialLink>
            </SocialLinks>
          </FooterSection>
        </FooterNav>
        
        <Divider />
        
        <Copyright>
          <i className="fas fa-om" style={{ color: '#FFC107', marginRight: '8px' }}></i>
          &copy; {new Date().getFullYear()} Krishna's Divine Wisdom. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 