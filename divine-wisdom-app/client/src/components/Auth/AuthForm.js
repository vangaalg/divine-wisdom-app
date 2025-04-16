import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase, signInWithGoogle, handleOAuthUserProfile } from '../../supabase';
import { useNavigate } from 'react-router-dom';

const AuthContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
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

const SocialButton = styled(Button)`
  background-color: ${props => props.provider === 'google' ? '#DB4437' : '#2C5F2D'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    background-color: ${props => props.provider === 'google' ? '#B33225' : '#234924'};
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

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px;
  background-color: ${props => props.active ? '#2C5F2D' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  cursor: pointer;
  
  &:first-child {
    border-radius: 4px 0 0 4px;
  }
  
  &:last-child {
    border-radius: 0 4px 4px 0;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 15px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
  }
  
  span {
    padding: 0 10px;
    color: #666;
    font-size: 14px;
  }
`;

const AuthForm = () => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth redirect
    const handleOAuthResponse = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user && !error) {
        await handleOAuthUserProfile(session.user);
        navigate('/chat');
      }
    };

    handleOAuthResponse();
  }, [navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setSuccess('Login successful!');
      navigate('/chat');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      setSuccess('Registration successful! Please check your email for verification.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setSuccess('Password reset instructions have been sent to your email.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
      });
      
      if (error) throw error;
      
      setSuccess('OTP has been sent to your phone number.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <TabContainer>
        <Tab 
          active={mode === 'login'} 
          onClick={() => setMode('login')}
        >
          Login
        </Tab>
        <Tab 
          active={mode === 'register'} 
          onClick={() => setMode('register')}
        >
          Register
        </Tab>
      </TabContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <Form onSubmit={
        mode === 'login' ? handleEmailLogin : 
        mode === 'register' ? handleRegister :
        mode === 'resetPassword' ? handlePasswordReset :
        handlePhoneAuth
      }>
        {mode !== 'phoneAuth' && (
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        
        {(mode === 'login' || mode === 'register') && (
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        
        {mode === 'phoneAuth' && (
          <Input
            type="tel"
            placeholder="Phone Number (e.g., +1234567890)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        )}

        <Button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : 
           mode === 'login' ? 'Login' :
           mode === 'register' ? 'Register' :
           mode === 'resetPassword' ? 'Send Reset Link' :
           'Send OTP'}
        </Button>

        {mode === 'login' && (
          <Button 
            type="button" 
            onClick={() => setMode('resetPassword')}
            style={{ backgroundColor: 'transparent', color: '#2C5F2D' }}
          >
            Forgot Password?
          </Button>
        )}
      </Form>

      <Divider><span>OR</span></Divider>

      <SocialButton 
        type="button"
        onClick={handleGoogleLogin}
        provider="google"
        disabled={loading}
      >
        <img 
          src="https://www.google.com/favicon.ico" 
          alt="Google"
          style={{ width: '20px', height: '20px' }}
        />
        Continue with Google
      </SocialButton>

      <Button 
        type="button"
        onClick={() => setMode('phoneAuth')}
        style={{ marginTop: '10px' }}
      >
        Login with Phone Number
      </Button>
    </AuthContainer>
  );
};

export default AuthForm; 