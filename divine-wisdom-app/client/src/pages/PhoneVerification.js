import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabase';

const Container = styled.div`
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #2C5F2D;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #234924;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  margin: 10px 0;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  color: #4CAF50;
  margin: 10px 0;
  font-size: 14px;
`;

const PhoneVerification = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber
      });

      if (error) throw error;

      setSuccess('Verification code sent successfully!');
      setShowVerificationInput(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: verificationCode,
        type: 'sms'
      });

      if (error) throw error;

      setSuccess('Phone number verified successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2>Phone Verification</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      {!showVerificationInput ? (
        <Form onSubmit={handleSendVerificationCode}>
          <Input
            type="tel"
            placeholder="Phone Number (e.g., +1234567890)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Verification Code'}
          </Button>
        </Form>
      ) : (
        <Form onSubmit={handleVerifyCode}>
          <Input
            type="text"
            placeholder="Enter Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default PhoneVerification; 