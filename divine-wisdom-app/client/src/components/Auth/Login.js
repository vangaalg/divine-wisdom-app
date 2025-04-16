import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { signIn, signUp } from '../../supabase';

const AuthContainer = styled.div`
  max-width: 500px;
  margin: 60px auto;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.1);
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 15px 0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#2C5F2D' : '#666'};
  border-bottom: 3px solid ${props => props.active ? '#2C5F2D' : 'transparent'};

  &:hover {
    color: #2C5F2D;
  }
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
  font-size: 14px;
  color: #444;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  transition: border 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2C5F2D;
    box-shadow: 0 0 0 2px rgba(44, 95, 45, 0.1);
  }
`;

const Button = styled.button`
  background-color: #2C5F2D;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #234824;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: 5px;
  text-align: center;
`;

const InfoText = styled.p`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 20px;
`;

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        console.log('User logged in:', data);
        navigate('/chat');
      } else {
        // Registration
        if (!name) {
          setError('Please provide your name');
          setLoading(false);
          return;
        }
        
        const { data, error } = await signUp(email, password, name);
        if (error) throw error;
        console.log('User signed up:', data);
        
        // If using email confirmation, show message
        if (!data.session) {
          setError('Please check your email for verification link');
        } else {
          navigate('/chat');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Tabs>
        <Tab 
          active={activeTab === 'login'} 
          onClick={() => handleTabChange('login')}
        >
          Login
        </Tab>
        <Tab 
          active={activeTab === 'register'} 
          onClick={() => handleTabChange('register')}
        >
          Register
        </Tab>
      </Tabs>

      <Form onSubmit={handleSubmit}>
        {activeTab === 'register' && (
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required={activeTab === 'register'}
            />
          </FormGroup>
        )}

        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            minLength={6}
          />
        </FormGroup>

        <Button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : activeTab === 'login' ? 'Login' : 'Register'}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>

      <InfoText>
        {activeTab === 'login' 
          ? "Don't have an account? Click Register above." 
          : "Already have an account? Click Login above."}
      </InfoText>
    </AuthContainer>
  );
};

export default Login; 