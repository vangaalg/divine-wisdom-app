import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const AboutTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
`;

const AboutContent = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  color: #555;
  line-height: 1.7;
  margin-bottom: 20px;
`;

const About = () => {
  return (
    <AboutContainer>
      <AboutTitle>About Divine Wisdom</AboutTitle>
      <AboutContent>
        <Section>
          <SectionTitle>Our Mission</SectionTitle>
          <Paragraph>
            Divine Wisdom was created to provide spiritual guidance and insight through
            the power of artificial intelligence. Our mission is to help people connect with
            divine wisdom and find answers to life's most profound questions.
          </Paragraph>
          <Paragraph>
            We believe that technology can be a powerful tool for spiritual growth and
            self-discovery. By combining ancient spiritual teachings with modern AI,
            we hope to make divine wisdom accessible to everyone, anywhere.
          </Paragraph>
        </Section>
        
        <Section>
          <SectionTitle>How It Works</SectionTitle>
          <Paragraph>
            Divine Wisdom uses OpenAI's advanced language models that have been
            trained on diverse spiritual texts, philosophical works, and wisdom traditions
            from around the world. When you ask a question, the AI draws upon this
            vast knowledge to provide thoughtful, nuanced responses.
          </Paragraph>
          <Paragraph>
            While our AI is powerful, we acknowledge that true spiritual experience
            transcends what technology alone can provide. We offer this as a
            supplementary tool for your spiritual journey, not a replacement for
            personal practice, community, or direct experience.
          </Paragraph>
        </Section>
        
        <Section>
          <SectionTitle>Our Values</SectionTitle>
          <Paragraph>
            We are committed to creating a respectful space that honors all spiritual
            traditions while not imposing any specific belief system. Our responses aim
            to be inclusive, compassionate, and thoughtful, recognizing the deeply
            personal nature of spiritual inquiry.
          </Paragraph>
          <Paragraph>
            We value privacy, authenticity, and the freedom to explore spiritual
            questions without judgment. Your conversations are private, and we do not
            share personal information with third parties.
          </Paragraph>
        </Section>
      </AboutContent>
    </AboutContainer>
  );
};

export default About; 