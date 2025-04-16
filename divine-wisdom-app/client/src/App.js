import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Chat from './components/Chat';
import About from './components/About';
import Login from './components/Auth/Login';
import ProfilePage from './components/Profile/ProfilePage';
import ConversationView from './components/Profile/ConversationView';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <Header />
          <Main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/conversation/:conversationId" 
                element={
                  <ProtectedRoute>
                    <ConversationView />
                  </ProtectedRoute>
                } 
              />
              <Route path="/about" element={<About />} />
            </Routes>
          </Main>
          <Footer />
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App; 