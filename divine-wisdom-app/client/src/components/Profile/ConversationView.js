import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';

const ConversationContainer = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #2C5F2D;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ConversationTitle = styled.h1`
  color: #2C5F2D;
  font-size: 1.8rem;
  margin: 0 0 5px 0;
`;

const ConversationInfo = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 20px;
`;

const MessagesContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  max-height: 600px;
  overflow-y: auto;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 15px;
  border-radius: 18px;
  margin-bottom: 15px;
  line-height: 1.5;
  font-size: 1rem;
  position: relative;
  
  ${({ isUser }) => isUser ? `
    background-color: #2C5F2D;
    color: white;
    align-self: flex-end;
    margin-left: auto;
    border-bottom-right-radius: 5px;
  ` : `
    background-color: #e8f4e5;
    color: #333;
    align-self: flex-start;
    border-bottom-left-radius: 5px;
  `}
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.isUser ? 'rgba(255, 255, 255, 0.7)' : '#666'};
  margin-top: 5px;
`;

const GitaQuote = styled.div`
  font-style: italic;
  font-size: 0.9rem;
  border-top: 1px solid rgba(44, 95, 45, 0.3);
  margin-top: 10px;
  padding-top: 8px;
  color: #2C5F2D;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
`;

const ConversationView = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    if (!user || !conversationId) return;
    
    const fetchConversation = async () => {
      try {
        setLoading(true);
        
        // Fetch the conversation details
        const { data: conversationData, error: convError } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .eq('user_id', user.id)
          .single();
          
        if (convError) throw convError;
        if (!conversationData) throw new Error("Conversation not found");
        
        setConversation(conversationData);
        
        // Fetch all messages for the conversation
        const { data: messagesData, error: msgError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
          
        if (msgError) throw msgError;
        
        setMessages(messagesData || []);
      } catch (error) {
        console.error("Error fetching conversation:", error);
        setError("Could not load the conversation. It may not exist or you don't have permission to view it.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversation();
  }, [conversationId, user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleBack = () => {
    navigate('/profile');
  };
  
  // Format date for display
  const formatMessageTime = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
  };
  
  if (loading) {
    return (
      <ConversationContainer>
        <LoadingIndicator>Loading conversation...</LoadingIndicator>
      </ConversationContainer>
    );
  }
  
  if (error) {
    return (
      <ConversationContainer>
        <BackButton onClick={handleBack}>← Back to Profile</BackButton>
        <ErrorMessage>{error}</ErrorMessage>
      </ConversationContainer>
    );
  }
  
  return (
    <ConversationContainer>
      <Header>
        <BackButton onClick={handleBack}>← Back to Profile</BackButton>
      </Header>
      
      <ConversationTitle>
        Spiritual Guidance in {conversation?.language || 'English'}
      </ConversationTitle>
      
      <ConversationInfo>
        {formatMessageTime(conversation?.created_at)} • 
        {conversation?.questions_asked} question{conversation?.questions_asked !== 1 ? 's' : ''} asked
      </ConversationInfo>
      
      <MessagesContainer>
        {messages.map((msg, index) => (
          <MessageBubble key={index} isUser={msg.is_user}>
            {msg.message}
            {!msg.is_user && msg.message.includes('"') && (
              <GitaQuote>
                {/* Extract quote section if present */}
                {msg.message.match(/"([^"]+)"/) 
                  ? msg.message.match(/"([^"]+)"/)[0]
                  : ''}
              </GitaQuote>
            )}
            <MessageTime isUser={msg.is_user}>
              {formatMessageTime(msg.created_at)}
            </MessageTime>
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
    </ConversationContainer>
  );
};

export default ConversationView; 