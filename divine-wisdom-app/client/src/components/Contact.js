import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ContactContainer = styled.div`
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2C5F2D;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
`;

const Description = styled.p`
  color: #555;
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #2C5F2D;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #2C5F2D;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
  outline: none;
  transition: border-color 0.3s;
  resize: vertical;
  
  &:focus {
    border-color: #2C5F2D;
  }
`;

const SubmitButton = styled.button`
  background-color: #2C5F2D;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #234824;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background-color: #e8f4e5;
  color: #2C5F2D;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-top: 20px;
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-top: 20px;
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      setStatus({
        type: 'success',
        message: 'Thank you for your feedback! Your message has been sent successfully.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'There was an error sending your message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactContainer>
      <Title>Contact Us</Title>
      <Description>
        We value your feedback! Help us improve Krishna's Divine Wisdom by sharing your suggestions,
        experiences, or any spiritual insights you'd like us to incorporate.
      </Description>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Your Email"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="subject">Subject</Label>
          <Input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Subject of your message"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="message">Message</Label>
          <TextArea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Share your thoughts, suggestions, or spiritual experiences..."
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </SubmitButton>
      </Form>

      {status.type === 'success' && (
        <SuccessMessage>{status.message}</SuccessMessage>
      )}
      {status.type === 'error' && (
        <ErrorMessage>{status.message}</ErrorMessage>
      )}
    </ContactContainer>
  );
};

export default Contact; 