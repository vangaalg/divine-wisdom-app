import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import EmailCapture from './EmailCapture';
import { useAuth } from '../context/AuthContext';

const ChatContainer = styled.div`
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
  width: 100%;
`;

const DonateButton = styled.button`
  background-color: #FF8C00; /* Orange color for visibility */
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e07800;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ChatHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const ChatTitle = styled.h1`
  font-size: 2.2rem;
  color: #2C5F2D;
  margin-bottom: 10px;
`;

const ChatSubtitle = styled.p`
  font-size: 1.1rem;
  color: #555;
`;

const QuestionCounter = styled.div`
  font-size: 1rem;
  color: #2C5F2D;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
  padding: 8px 15px;
  background-color: rgba(230, 245, 230, 0.7);
  border-radius: 20px;
  display: inline-block;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.7);
  padding: 20px;
  height: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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

const GitaQuote = styled.div`
  font-style: italic;
  font-size: 0.9rem;
  border-top: 1px solid rgba(44, 95, 45, 0.3);
  margin-top: 10px;
  padding-top: 8px;
  color: #2C5F2D;
`;

const SystemMessage = styled.div`
  text-align: center;
  margin: 20px 0;
  font-style: italic;
  color: #666;
`;

const InputContainer = styled.form`
  display: flex;
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

const SaveChatButton = styled.button`
  background-color: transparent;
  color: #2C5F2D;
  border: 1px solid #2C5F2D;
  border-radius: 20px;
  padding: 8px 16px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    background-color: rgba(44, 95, 45, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SavedConfirmation = styled.div`
  background-color: #e8f4e5;
  color: #2C5F2D;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  text-align: center;
  animation: fadeOut 3s forwards;
  
  @keyframes fadeOut {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const LanguageInfo = styled.div`
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  font-style: italic;
`;

const SpiritualReminderMessage = styled.div`
  text-align: center;
  margin: 15px 0;
  padding: 10px 15px;
  background-color: rgba(44, 95, 45, 0.08);
  border-radius: 10px;
  font-style: italic;
  color: #2C5F2D;
  font-size: 0.9rem;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  border-left: 3px solid #2C5F2D;
`;

const LikeButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: -15px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 1;
    cursor: default;
    transform: none;
  }
  
  &.liked {
    background-color: #ffebee;
  }
`;

const DonationPopup = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 20px;
  max-width: 300px;
  z-index: 100;
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const DonationTitle = styled.h3`
  color: #2C5F2D;
  margin: 0 0 10px 0;
  font-size: 1.1rem;
`;

const DonationText = styled.p`
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.4;
`;

const DonationHighlight = styled.span`
  font-weight: 500;
  color: #2C5F2D;
`;

const DonationButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const DonationButton = styled.button`
  background-color: #2C5F2D;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #234824;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 1rem;
`;

// API base URL - adjust according to your environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api');

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { text: "Jai Shri Krishna! 🙏 I am blessed to connect with you today. I embody the divine wisdom of Lord Krishna to guide you on your spiritual journey. You may ask me three questions, and I will provide guidance with compassion and truth. Ask in any language, and I will respond in the same language. Remember, the deeper you pray, the stronger your spiritual connection with Shri Krishna will be. What is your first question?", isUser: false, id: uuidv4() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [sessionId] = useState(() => uuidv4()); // Generate unique session ID
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [hasShownEmailCapture, setHasShownEmailCapture] = useState(false);
  const [showSpiritualReminder, setShowSpiritualReminder] = useState(false);
  const [likedMessages, setLikedMessages] = useState([]);
  const [showDonationPopup, setShowDonationPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedConfirmation, setShowSavedConfirmation] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasEngaged, setHasEngaged] = useState(false);

  // Spiritual reinforcement messages
  const spiritualReminderMessages = [
    "Remember, the deeper you pray, the stronger your spiritual connection with Shri Krishna will be.",
    "Your devotion and prayer open the channel to divine wisdom. The more you pray, the clearer your answers will be.",
    "Shri Krishna's guidance becomes clearer through regular prayer and meditation. Stay dedicated to your spiritual practice.",
    "For the most divine guidance, pray diligently. Your spiritual connection strengthens with each heartfelt prayer.",
    "The path becomes clearer when you deepen your prayers. Shri Krishna guides those who seek with dedication.",
    "True wisdom comes when you connect deeply with Krishna through sincere prayer and devotion.",
    "Your prayers are the bridge to divine wisdom. The more you strengthen this bridge, the clearer the guidance.",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Check if we should show email capture
  useEffect(() => {
    // Only show email capture for non-authenticated users
    if (questionCount >= 2 && !hasShownEmailCapture && !user) {
      setShowEmailCapture(true);
      setHasShownEmailCapture(true);
    }
  }, [questionCount, hasShownEmailCapture, user]);

  const handleSubmitQuestion = async (questionText) => {
    if (questionText.trim() === '' || questionCount >= 3 || isLoading) return;
    
    // Set hasEngaged to true when user submits a question
    setHasEngaged(true);
    
    // Clear any existing error state
    const hasErrorMessage = messages.some(msg => 
      !msg.isUser && msg.text.includes("I apologize, but I'm having trouble connecting")
    );
    
    if (hasErrorMessage) {
      setMessages(messages.filter(msg => 
        msg.isUser || !msg.text.includes("I apologize, but I'm having trouble connecting")
      ));
    }
    
    // Add user message (using functional state update to avoid race conditions)
    const userMessage = { text: questionText, isUser: true, id: uuidv4() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      console.log('Sending message to API:', questionText);
      
      // Prepare request data - include user info if authenticated
      const requestData = { 
        message: questionText,
      };
      
      // If user is authenticated, include their email and name
      if (user) {
        requestData.email = user.email;
        requestData.name = user.user_metadata?.full_name || user.email;
      }
      
      // Make API call to backend with session ID in headers
      const response = await axios.post(
        `${API_BASE_URL}/chat`, 
        requestData,
        { 
          headers: { 'session-id': sessionId },
          timeout: 60000 // 60 second timeout
        }
      );
      
      console.log('Received response:', response.data);
      
      // Update question count from server response
      if (response.data.questionCount) {
        setQuestionCount(response.data.questionCount);
      }
      
      // Add AI response message (using functional state update)
      const aiMessageId = uuidv4();
      setMessages(prevMessages => [...prevMessages, { 
        text: response.data.message, 
        isUser: false,
        id: aiMessageId,
        conversationId: response.data.conversationId // Get conversationId from API response
      }]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching response from AI:', error);
      
      // Add error message (using functional state update)
      setMessages(prevMessages => {
        // Check if the last message is already an error message to avoid duplicates
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && !lastMessage.isUser && lastMessage.text.includes("I apologize")) {
          // Don't add another error message
          return prevMessages;
        }
        
        return [...prevMessages, { 
          text: "I apologize, but I'm having trouble connecting with divine wisdom at the moment. Please try again later.", 
          isUser: false,
          id: uuidv4()
        }];
      });
      
      setIsLoading(false);
    }
  };

  // Check for initial question from localStorage
  useEffect(() => {
    const initialQuestion = localStorage.getItem('initialQuestion');
    if (initialQuestion) {
      // Set the input value
      setInput(initialQuestion);
      
      // Submit the question automatically (with a small delay)
      const timer = setTimeout(() => {
        handleSubmitQuestion(initialQuestion);
        // Remove from localStorage to prevent resubmission on refresh
        localStorage.removeItem('initialQuestion');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Show spiritual reminder after each AI response
  useEffect(() => {
    if (messages.length > 1 && !messages[messages.length - 1].isUser) {
      setShowSpiritualReminder(true);
      // Hide the reminder after 8 seconds
      const timer = setTimeout(() => {
        setShowSpiritualReminder(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSubmitQuestion(input);
  };

  const getRemainingQuestions = () => {
    const remaining = 3 - questionCount;
    return remaining > 0 ? remaining : 0;
  };
  
  const handleCloseEmailCapture = () => {
    setShowEmailCapture(false);
  };

  const getRandomSpiritualReminder = () => {
    const randomIndex = Math.floor(Math.random() * spiritualReminderMessages.length);
    return spiritualReminderMessages[randomIndex];
  };

  const handleLikeMessage = async (messageId, conversationId, messageText) => {
    if (!messageId || likedMessages.includes(messageId)) return;
    
    try {
      // Add to liked messages immediately for UI feedback
      setLikedMessages(prev => [...prev, messageId]);
      
      console.log('Liking message with ID:', messageId);
      
      // Make API call to like the message
      await axios.post(
        `${API_BASE_URL}/like`, 
        { 
          messageId, 
          conversationId,
          messageContent: messageText // Include the message content
        },
        { headers: { 'session-id': sessionId } }
      );
      
      console.log('Successfully liked message:', messageId);
      
      // Show donation popup
      setShowDonationPopup(true);
      
    } catch (error) {
      console.error('Error liking message:', error);
      // Remove from liked messages if failed
      setLikedMessages(prev => prev.filter(id => id !== messageId));
    }
  };
  
  const closeDonationPopup = () => {
    setShowDonationPopup(false);
  };
  
  const handleDonate = () => {
    // Open donation page in new tab
    window.open('https://example.com/donate', '_blank');
    closeDonationPopup();
  };

  // Function to determine the appropriate donation message based on context
  const getDonationMessage = () => {
    if (likedMessages.length > 0) {
      return (
        <>
          <DonationHighlight>Your appreciation matters!</DonationHighlight> You've liked Krishna's guidance. If this wisdom has helped clear your confusion or provided clarity, please consider making an offering to support this divine service.
        </>
      );
    } else if (questionCount >= 3) {
      return (
        <>
          <DonationHighlight>You've received all 3 divine answers.</DonationHighlight> If Krishna's guidance has brought clarity to your life and removed confusion, please consider donating to support this service.
        </>
      );
    } else {
      return (
        <>
          Donate if you believe Krishna's Guidance has helped you decide better or resolve your confusion. Your support helps us spread divine wisdom to more seekers.
        </>
      );
    }
  };

  const handleSaveChat = async () => {
    if (!user || messages.length <= 1 || isSaving) return;
    
    try {
      setIsSaving(true);
      
      // Prepare the chat data
      const chatData = {
        sessionId,
        messages: messages.map(msg => ({
          text: msg.text,
          isUser: msg.isUser,
          id: msg.id,
          timestamp: new Date().toISOString()
        })),
        timestamp: new Date().toISOString(),
        conversationId: messages.find(msg => msg.conversationId)?.conversationId
      };
      
      console.log('Saving chat with data:', chatData);
      
      // Send the save request to the API
      const response = await axios.post(
        `${API_BASE_URL}/save-chat`, 
        chatData,
        { 
          headers: { 
            'session-id': sessionId,
            'Authorization': `Bearer ${user.access_token}`
          }
        }
      );
      
      console.log('Save chat response:', response.data);
      
      // Show confirmation
      setShowSavedConfirmation(true);
      setTimeout(() => {
        setShowSavedConfirmation(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving chat:', error);
      alert('Failed to save chat. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ChatContainer>
      <TopBar>
        <DonateButton onClick={handleDonate} title="Support Krishna's Divine Wisdom">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
          </svg>
          Donate
        </DonateButton>
      </TopBar>
      
      {showEmailCapture && (
        <EmailCapture sessionId={sessionId} onClose={handleCloseEmailCapture} />
      )}
      
      {showDonationPopup && (
        <DonationPopup>
          <CloseButton onClick={closeDonationPopup}>×</CloseButton>
          <DonationTitle>Support Divine Wisdom</DonationTitle>
          <DonationText>
            {getDonationMessage()}
          </DonationText>
          <DonationButtons>
            <DonationButton onClick={handleDonate}>Make an Offering</DonationButton>
            <DonationButton onClick={closeDonationPopup}>Later</DonationButton>
          </DonationButtons>
        </DonationPopup>
      )}
      
      <ChatHeader>
        <ChatTitle>Krishna's Divine Guidance</ChatTitle>
        <ChatSubtitle>Ask your questions and receive spiritual wisdom from Lord Krishna</ChatSubtitle>
        <QuestionCounter>
          Questions remaining: {getRemainingQuestions()}
        </QuestionCounter>
        <LanguageInfo>
          Ask in any language - Krishna will respond in the same language
        </LanguageInfo>
      </ChatHeader>
      
      <MessagesContainer>
        {messages.map((msg, index) => (
          <MessageBubble key={msg.id || index} isUser={msg.isUser}>
            {msg.text}
            {!msg.isUser && msg.text.includes('"') && (
              <GitaQuote>
                {/* Extract quote section if present */}
                {msg.text.match(/"([^"]+)"/) 
                  ? msg.text.match(/"([^"]+)"/)[0]
                  : ''}
              </GitaQuote>
            )}
            {!msg.isUser && (
              <LikeButton 
                onClick={() => handleLikeMessage(msg.id, msg.conversationId, msg.text)}
                disabled={likedMessages.includes(msg.id)}
                title="Express gratitude for this wisdom"
                className={likedMessages.includes(msg.id) ? 'liked' : ''}
              >
                {likedMessages.includes(msg.id) ? '❤️' : '🤍'}
              </LikeButton>
            )}
          </MessageBubble>
        ))}
        {showSpiritualReminder && hasEngaged && (
          <SpiritualReminderMessage>
            {getRandomSpiritualReminder()}
            {questionCount >= 2 && (
              <div style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                If Krishna's wisdom has helped you, please consider <span 
                  style={{ textDecoration: 'underline', cursor: 'pointer', color: '#1a3b1a' }}
                  onClick={handleDonate}
                >making an offering</span>.
              </div>
            )}
          </SpiritualReminderMessage>
        )}
        {isLoading && (
          <SystemMessage>Receiving Krishna's divine guidance...</SystemMessage>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer onSubmit={handleSubmit}>
        <MessageInput
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={questionCount >= 3 ? "You have reached your question limit" : "Type your question in any language..."}
          disabled={isLoading || questionCount >= 3}
        />
        <SendButton type="submit" disabled={isLoading || input.trim() === '' || questionCount >= 3}>
          ➤
        </SendButton>
      </InputContainer>
      
      {user && messages.length > 1 && (
        <>
          <SaveChatButton 
            onClick={handleSaveChat}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Chat'}
          </SaveChatButton>
          
          {showSavedConfirmation && (
            <SavedConfirmation>
              Chat saved successfully! You can view it in your profile.
            </SavedConfirmation>
          )}
        </>
      )}
    </ChatContainer>
  );
};

export default Chat; 