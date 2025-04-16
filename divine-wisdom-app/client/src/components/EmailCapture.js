import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { signUp } from '../supabase';
import { useNavigate } from 'react-router-dom';

const EmailCaptureContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const EmailCaptureForm = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Title = styled.h2`
  color: #2C5F2D;
  margin-bottom: 5px;
  font-size: 1.8rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 25px;
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: #2C5F2D;
    box-shadow: 0 0 0 2px rgba(44, 95, 45, 0.2);
  }
`;

const SubmitButton = styled.button`
  background-color: #2C5F2D;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 10px;
  
  &:hover {
    background-color: #4b9e4c;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SkipButton = styled.button`
  background: none;
  border: none;
  color: #666;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 15px;
  font-size: 0.9rem;
  
  &:hover {
    color: #333;
  }
`;

const SuccessMessage = styled.div`
  color: #2C5F2D;
  font-weight: 500;
  margin: 20px 0;
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(44, 95, 45, 0.1);
`;

// API base URL - adjust according to your environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

const EmailCapture = ({ sessionId, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // First, create the account in Supabase auth
      const { data, error: signUpError } = await signUp(email, password, name);
      
      if (signUpError) throw signUpError;
      
      // Next, update the current conversation session with the user details
      await axios.post(`${API_BASE_URL}/register`, {
        email,
        name: name.trim() || undefined,
        sessionId,
        userId: data?.user?.id
      });
      
      setSuccess(true);
      setLoading(false);
      
      // Close after 2 seconds
      setTimeout(() => {
        onClose();
        // If email verification is required, let them know
        if (!data.session) {
          alert('Please check your email to verify your account before logging in.');
        }
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to register. Please try again later.');
      setLoading(false);
      console.error('Registration error:', error);
    }
  };
  
  return (
    <EmailCaptureContainer>
      <EmailCaptureForm>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>Receive Krishna's Blessings</Title>
        <Subtitle>Create an account to save your conversation and receive spiritual guidance in the future</Subtitle>
        
        {success ? (
          <SuccessMessage>Thank you! Your divine connection has been established.</SuccessMessage>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              type="text" 
              placeholder="Your name (optional)" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input 
              type="password" 
              placeholder="Create a password (min 6 characters)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            
            {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}
            
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account & Save Conversation'}
            </SubmitButton>
          </form>
        )}
        
        <SkipButton onClick={onClose}>
          Continue without saving
        </SkipButton>
      </EmailCaptureForm>
    </EmailCaptureContainer>
  );
};

export default EmailCapture; 