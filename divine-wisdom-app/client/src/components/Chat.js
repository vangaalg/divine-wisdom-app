import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import EmailCapture from './EmailCapture';
import { useAuth } from '../context/AuthContext';
import { FaVolumeUp, FaVolumeMute, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSend, IoMicSharp, IoMicOutline } from 'react-icons/io5';

const ChatContainer = styled.div`
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90px);
  align-items: center;
  justify-content: center;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;
`;

const VoiceControlsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const VoiceButton = styled.button`
  background-color: ${props => props.active ? '#5e1a87' : 'rgba(94, 26, 135, 0.6)'};
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
    background-color: #5e1a87;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const MicrophoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
  </svg>
);

const SpeakerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);

const DonateButton = styled.button`
  background-color: #a239ca;
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
    background-color: #8e33b5;
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
  margin-bottom: 20px;
`;

const ChatTitle = styled.h1`
  font-size: 2.2rem;
  background: linear-gradient(90deg, #fff, #a239ca);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
`;

const ChatSubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const QuestionCounter = styled.div`
  font-size: 1rem;
  color: #fff;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
  padding: 8px 15px;
  background-color: rgba(94, 26, 135, 0.3);
  border-radius: 20px;
  display: inline-block;
  backdrop-filter: blur(5px);
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  border-radius: 15px;
  background: rgba(15, 5, 36, 0.4);
  backdrop-filter: blur(10px);
  padding: 20px;
  width: 100%;
  max-height: 60vh;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  scroll-padding-bottom: 20px;
  
  /* Ensure the container maintains its position during form submission */
  overscroll-behavior: contain;
  
  /* Prevent scroll chaining to the main page */
  overscroll-behavior-y: contain;
  
  /* Create a stacking context to contain the scrolling */
  isolation: isolate;
  
  /* Add padding at the bottom to ensure messages aren't hidden */
  &::after {
    content: '';
    padding-bottom: 10px;
  }
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 15px;
  border-radius: 18px;
  margin-bottom: 15px;
  line-height: 1.5;
  font-size: 1rem;
  position: relative;
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  ${({ isUser }) => isUser ? `
    background: linear-gradient(135deg, #5e1a87, #a239ca);
    color: white;
    align-self: flex-end;
    margin-left: auto;
    border-bottom-right-radius: 5px;
    box-shadow: 0 3px 10px rgba(94, 26, 135, 0.3);
  ` : `
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    align-self: flex-start;
    border-bottom-left-radius: 5px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  `}
`;

const GitaQuote = styled.div`
  font-style: italic;
  font-size: 0.9rem;
  border-top: 1px solid rgba(94, 26, 135, 0.3);
  margin-top: 10px;
  padding-top: 8px;
  color: #a239ca;
`;

const SystemMessage = styled.div`
  text-align: center;
  margin: 20px 0;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: rgba(15, 5, 36, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  margin-top: 20px;
  width: 100%;
  position: relative;
`;

const RecordingFeedbackContainer = styled.div`
  position: absolute;
  top: -30px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 14px;
  color: ${props => props.isFinishing ? '#ff5252' : '#fff'};
  background-color: rgba(15, 5, 36, 0.4);
  padding: 5px 10px;
  border-radius: 10px;
  transition: opacity 0.3s ease;
  opacity: ${props => props.isRecording ? 1 : 0};
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 15px 20px;
  border-radius: 30px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  margin-right: 10px;
  
  &:focus {
    box-shadow: 0 2px 20px rgba(94, 26, 135, 0.4);
    transform: translateY(-2px);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #5e1a87, #a239ca);
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
  box-shadow: 0 2px 10px rgba(94, 26, 135, 0.5);
  
  &:hover {
    transform: scale(1.05) rotate(5deg);
    box-shadow: 0 4px 15px rgba(94, 26, 135, 0.6);
  }
  
  &:disabled {
    background: rgba(150, 150, 150, 0.5);
    cursor: not-allowed;
    transform: none;
  }
`;

const SaveChatButton = styled.button`
  background-color: transparent;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.5);
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
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.8);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SavedConfirmation = styled.div`
  background-color: rgba(94, 26, 135, 0.2);
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  text-align: center;
  animation: fadeOut 3s forwards;
  backdrop-filter: blur(5px);
  
  @keyframes fadeOut {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const LanguageInfo = styled.div`
  margin-top: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  font-style: italic;
`;

const SpiritualReminderMessage = styled.div`
  text-align: center;
  margin: 15px auto;
  padding: 10px 15px;
  background: rgba(94, 26, 135, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 10px;
  font-style: italic;
  color: white;
  font-size: 0.9rem;
  max-width: 90%;
  border-left: 3px solid #a239ca;
`;

const LikeButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: -15px;
  background: linear-gradient(135deg, #5e1a87, #a239ca);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  
  &:hover {
    transform: scale(1.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
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

const VoiceSettingsContainer = styled.div`
  width: 100%;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const VoiceSelector = styled.select`
  background-color: white;
  border: 1px solid #1a3b1a;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 14px;
  color: #1a3b1a;
  cursor: pointer;
  margin-top: 8px;
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: #5e1a87;
    box-shadow: 0 0 0 2px rgba(94, 26, 135, 0.2);
  }
`;

const VoiceOptionGroup = styled.optgroup`
  font-weight: 500;
`;

const VoiceToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active ? '#1a3b1a' : 'white'};
  color: ${props => props.active ? 'white' : '#1a3b1a'};
  border: 1px solid #1a3b1a;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#1a3b1a' : '#e9f3e9'};
  }
`;

// API base URL - adjust according to your environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api');

// Custom hook for scroll management
const useScrollManagement = () => {
  const messagesEndRef = useRef(null);
  
  // Improved scroll function with better control
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      // Use scrollIntoView with nearest to prevent extreme scrolling
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "nearest" 
      });
    }
  }, []);

  return { messagesEndRef, scrollToBottom };
};

// Voice button for individual messages
const MessageVoiceButton = styled.button`
  position: absolute;
  right: 45px;
  bottom: -15px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #5e1a87;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #5e1a87;
  
  &:hover {
    transform: scale(1.1);
    background: #5e1a87;
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Add styled components for audio visualization
const AudioVisualization = styled(motion.div)`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 280px;
`;

const VisualizationBars = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 200px;
  gap: 5px;
`;

const AudioBar = styled(motion.div)`
  width: 5px;
  background-color: #5e1a87;
  border-radius: 3px;
`;

const RecordingStatus = styled.div`
  font-size: 14px;
  color: ${props => props.isFinishing ? '#e74c3c' : '#5e1a87'};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RecordingDot = styled(motion.div)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e74c3c;
`;

const StopButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: #c0392b;
  }
`;

const MicButton = styled.button`
  background: ${props => props.isRecording 
    ? props.isSpeaking 
      ? '#ff5252' // Active speaking
      : '#ff9e9e' // Recording but silent 
    : '#eaeaea'};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  cursor: pointer;
  transform: ${props => props.isRecording ? 'scale(1.1)' : 'scale(1)'};
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.isRecording ? '#ff5252' : '#d1d1d1'};
  }
  
  ${props => props.isRecording && css`
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${props => 100 + props.audioLevel * 40}%;
      height: ${props => 100 + props.audioLevel * 40}%;
      background: rgba(255, 82, 82, 0.3);
      border-radius: 50%;
      z-index: -1;
      animation: pulse 1.5s infinite ease-in-out;
    }
    
    @keyframes pulse {
      0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.7;
      }
      70% {
        transform: translate(-50%, -50%) scale(1.1);
        opacity: 0.3;
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.7;
      }
    }
  `}
`;

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
  const [hasEngaged, setHasEngaged] = useState(false);
  
  // Voice-related state
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(() => {
    return localStorage.getItem('selectedVoice') || 'male_1';
  });
  const [spokenMessages, setSpokenMessages] = useState([]);

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevels, setAudioLevels] = useState([20, 30, 25, 40, 35, 20, 15, 30, 25, 20]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState('');
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [isFinishingRecording, setIsFinishingRecording] = useState(false);
  const [speechDetected, setSpeechDetected] = useState(false);
  const [recordingFeedback, setRecordingFeedback] = useState('');
  
  // Use refs for better tracking
  const recognition = useRef(null);
  const analyser = useRef(null);
  const audioContext = useRef(null);
  const mediaStream = useRef(null);
  const silenceTimer = useRef(null);
  const silenceStartTime = useRef(null);
  const recordingStartTime = useRef(null);
  const speechTimeoutRef = useRef(null);
  
  // Audio recording constants
  const SILENCE_THRESHOLD = 7000; // 7 seconds of silence before stopping
  const MIN_RECORDING_TIME = 3000; // Minimum 3 seconds recording time
  const MAX_RECORDING_TIME = 120000; // Maximum 2 minutes recording time

  // Use the custom scroll management hook
  const { messagesEndRef, scrollToBottom } = useScrollManagement();

  // Helper functions for chat
  const getRemainingQuestions = () => {
    return Math.max(0, 3 - questionCount);
  };

  const hasReachedQuestionLimit = questionCount >= 3;

  const getRandomSpiritualReminder = () => {
    const reminders = [
      "Remember, true peace comes from within, not from external possessions.",
      "The soul is eternal and cannot be destroyed by any weapon.",
      "Success in spiritual life is measured by how much we have loved.",
      "Like the lotus remains pure despite being in muddy water, remain pure in all situations.",
      "Perform your duties without attachment to results.",
      "Find joy in the journey, not just the destination.",
      "The greatest form of wisdom is self-knowledge."
    ];
    return reminders[Math.floor(Math.random() * reminders.length)];
  };

  const getDonationMessage = () => {
    const messages = [
      "Your generous offering helps spread Krishna's divine wisdom to seekers worldwide.",
      "Support this spiritual service with a dakshina (donation) as a token of gratitude.",
      "Contribute to keeping Krishna's teachings accessible to all spiritual seekers.",
      "Your support is a form of seva (service) that helps this divine wisdom reach more souls."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleSubmit = (e, fromVoice = false) => {
    if (e) e.preventDefault();
    if (isLoading || !input.trim() || hasReachedQuestionLimit) return;

    // Reset audio if active for text-to-speech (but not microphone)
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const userMessage = { text: input, isUser: true, id: uuidv4() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setHasEngaged(true);
    
    // Only clear the input if not from voice recording
    // Voice recording already clears its input in submitRecordedQuestion
    if (!fromVoice) {
      setInput('');
    }

    // Scroll to bottom immediately after user's message
    setTimeout(scrollToBottom, 100);

    // Determine if this is the 2nd question
    const isSecondQuestion = questionCount === 1;
    // Check if this will be the last allowed question
    const isLastQuestion = questionCount === 2;

    // Tracking analytics
    try {
      if (window.gtag) {
        window.gtag('event', 'ask_question', {
          question_count: questionCount + 1,
          session_id: sessionId
        });
      }
    } catch (error) {
      console.error('Error tracking question:', error);
    }

    // Make API call
    axios.post(`${API_BASE_URL}/chat`, {
      message: userMessage.text,
      sessionId,
      questionCount: questionCount + 1
    })
    .then(response => {
      const aiMessageId = uuidv4();
      
      setMessages(prev => [
        ...prev,
        { 
          text: response.data.message, 
          isUser: false, 
          id: aiMessageId
        }
      ]);
      
      setQuestionCount(prev => prev + 1);
      setIsLoading(false);
      
      // Always clear the input field after receiving a response
      setInput('');
      
      // Scroll to bottom after receiving AI's message
      setTimeout(scrollToBottom, 100);
      
      // Show spiritual reminder every 2 messages
      if (messages.length % 4 === 0) {
        setShowSpiritualReminder(true);
        setTimeout(() => {
          setShowSpiritualReminder(false);
          scrollToBottom();
        }, 10000);
      }
      
      // Show email capture after second question if not shown before
      if (isSecondQuestion && !hasShownEmailCapture) {
        setShowEmailCapture(true);
        setHasShownEmailCapture(true);
        
        try {
          if (window.gtag) {
            window.gtag('event', 'show_email_capture', {
              session_id: sessionId
            });
          }
        } catch (error) {
          console.error('Error tracking email capture:', error);
        }
      }
      
      // Show donation popup occasionally
      if (Math.random() < 0.3 && questionCount >= 1) {
        setTimeout(() => {
          setShowDonationPopup(true);
        }, 3000);
      }
      
      // If voice is enabled, speak the response
      if (voiceEnabled) {
        handleSpeakMessage(response.data.message, aiMessageId);
      }
      
      // If this was the last allowed question, show a message
      if (isLastQuestion) {
        setTimeout(() => {
          setRecordingFeedback('You have reached your question limit. Please donate to ask more questions.');
          setTimeout(() => setRecordingFeedback(''), 5000);
        }, 1000);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { 
          text: "Forgive me, but I'm unable to receive Krishna's wisdom at this moment. Please try again later.", 
          isUser: false, 
          id: uuidv4() 
        }
      ]);
      setIsLoading(false);
      
      // Clear input even on error
      setInput('');
      
      setTimeout(scrollToBottom, 100);
    });
  };

  const handleLikeMessage = (messageId, conversationId, text) => {
    if (likedMessages.includes(messageId)) return;
    
    setLikedMessages(prev => [...prev, messageId]);
    
    // Send like to backend
    axios.post(`${API_BASE_URL}/like-message`, {
      messageId,
      sessionId,
      text
    })
    .catch(error => {
      console.error('Error liking message:', error);
    });
    
    // Track event
    try {
      if (window.gtag) {
        window.gtag('event', 'like_message', {
          session_id: sessionId
        });
      }
    } catch (error) {
      console.error('Error tracking like:', error);
    }
    
    // Show donation popup with higher probability when liking a message
    // This ensures users who appreciate the wisdom are encouraged to donate
    if (Math.random() < 0.7) {
      setTimeout(() => {
        setShowDonationPopup(true);
      }, 500);
    }
  };

  const handleSaveChat = () => {
    if (!user || isSaving) return;
    
    setIsSaving(true);
    
    axios.post(`${API_BASE_URL}/save-chat`, {
      userId: user.uid,
      messages: messages.map(msg => ({
        text: msg.text,
        isUser: msg.isUser,
        timestamp: new Date().toISOString()
      })),
      sessionId
    })
    .then(() => {
      setIsSaving(false);
      setShowSavedConfirmation(true);
      
      setTimeout(() => {
        setShowSavedConfirmation(false);
      }, 3000);
      
      // Track event
      try {
        if (window.gtag) {
          window.gtag('event', 'save_chat', {
            session_id: sessionId
          });
        }
      } catch (error) {
        console.error('Error tracking save:', error);
      }
    })
    .catch(error => {
      console.error('Error saving chat:', error);
      setIsSaving(false);
      alert('There was an error saving your chat. Please try again.');
    });
  };

  const handleSpeakMessage = (text, messageId) => {
    // If already speaking this message, stop it
    if (isPlayingAudio && spokenMessages.includes(messageId)) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      setIsSpeaking(false);
      setSpokenMessages(prev => prev.filter(id => id !== messageId));
      return;
    }
    
    // If another message is being spoken, stop it
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpokenMessages([]);
    }
    
    // Mark this message as being spoken
    setSpokenMessages([messageId]);
    setIsPlayingAudio(true);
    setIsSpeaking(true);
    
    // Remove any quotes from the text before speaking
    let cleanText = text;
    if (text.includes('"')) {
      // Remove quoted text from speech
      cleanText = text.replace(/"([^"]*)"/g, '');
    }
    
    // Use speech synthesis
    if (window.speechSynthesis) {
      const speech = new SpeechSynthesisUtterance(cleanText);
      
      // Set language based on detected text
      speech.lang = 'en-US'; // Default
      
      // Set voice based on user preference
      speech.voice = getSelectedVoice();
      speech.rate = 0.9; // Slightly slower for spiritual content
      speech.pitch = 1;
      
      speech.onend = () => {
        setIsPlayingAudio(false);
        setIsSpeaking(false);
        setSpokenMessages([]);
      };
      
      speech.onerror = () => {
        setIsPlayingAudio(false);
        setIsSpeaking(false);
        setSpokenMessages([]);
      };
      
      window.speechSynthesis.speak(speech);
      
      // Track event
      try {
        if (window.gtag) {
          window.gtag('event', 'speak_message', {
            session_id: sessionId,
            voice: selectedVoice
          });
        }
      } catch (error) {
        console.error('Error tracking speech:', error);
      }
    }
  };

  const getSelectedVoice = () => {
    if (!window.speechSynthesis) return null;
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;
    
    // Map voice selection to actual voices
    switch (selectedVoice) {
      case 'male_1':
        return voices.find(v => v.name.includes('Male') || v.name.includes('Google UK English Male')) || voices[0];
      case 'female_1':
        return voices.find(v => v.name.includes('Female') || v.name.includes('Google UK English Female')) || voices[0];
      case 'male_2': 
        return voices.find(v => v.name.includes('Microsoft David')) || voices[1] || voices[0];
      case 'female_2':
        return voices.find(v => v.name.includes('Microsoft Zira')) || voices[2] || voices[0];
      default:
        return voices[0];
    }
  };

  const handleCloseEmailCapture = () => {
    setShowEmailCapture(false);
  };
  
  const handleDonate = () => {
    // Close popup if open
    setShowDonationPopup(false);
    
    // Redirect to donation page
    window.open('https://www.paypal.com/donate/?hosted_button_id=ABCDEFG', '_blank');
    
    // Track donation click
    try {
      if (window.gtag) {
        window.gtag('event', 'click_donate', {
          session_id: sessionId
        });
      }
    } catch (error) {
      console.error('Error tracking donation click:', error);
    }
  };
  
  const closeDonationPopup = () => {
    setShowDonationPopup(false);
  };

  // IMPORTANT NEW FUNCTION: Force clear input
  const forceClearInput = () => {
    console.log("Forcing input clear");
    setInput('');
    if (document.querySelector('input[type="text"]')) {
      document.querySelector('input[type="text"]').value = '';
    }
  };

  // Toggle speech input - MODIFIED to force clear input
  const toggleSpeechInput = () => {
    console.log("Toggle speech input called");
    // IMPORTANT: Clear input immediately 
    forceClearInput();
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    console.log("Start recording called");
    // IMPORTANT: Clear input again to be certain
    forceClearInput();

    if (!recognition.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setRecordingFeedback('Speech recognition not supported in this browser');
        return;
      }
      
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      
      // Clear any previous transcript
      setTranscript('');
      forceClearInput();
      
      recognition.current.onstart = () => {
        setIsRecording(true);
        recordingStartTime.current = Date.now();
        setRecordingFeedback('Listening...');
        setRecordingTimer(0);
        
        // Initialize audio context for visualization
        if (!audioContext.current) {
          audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          .then(stream => {
            mediaStream.current = stream;
            const source = audioContext.current.createMediaStreamSource(stream);
            analyser.current = audioContext.current.createAnalyser();
            analyser.current.fftSize = 256;
            source.connect(analyser.current);
            startVisualization();
          })
          .catch(error => {
            console.error('Error accessing microphone:', error);
            setRecordingFeedback('Microphone access denied');
            stopRecording();
          });
      };
      
      // Keep a running transcript to accumulate all speech
      let fullTranscript = '';
      
      recognition.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            // Add to our full transcript
            fullTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // If we have any transcript, reset silence detection
        if (finalTranscript || interimTranscript) {
          setIsSpeaking(true);
          setSpeechDetected(true);
          restartSilenceDetection();
          setRecordingFeedback('Recording...');
          
          // Update the input with the full accumulated transcript
          // plus any current interim results
          setInput(fullTranscript + interimTranscript);
        }
      };
      
      recognition.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setRecordingFeedback(`Error: ${event.error}`);
        stopRecording(false); // Don't submit on error
      };
      
      recognition.current.onend = () => {
        console.log('Speech recognition ended');
        
        // Only submit if we have a transcript and we're not still recording
        // This prevents premature submission when the browser times out
        if (!isRecording) {
          const finalInputValue = input.trim();
          if (finalInputValue && finalInputValue.length > 0) {
            // Add a small delay to ensure final processing is complete
            setTimeout(() => {
              // Now force direct submission without handleSubmit
              directSubmitVoiceInput(finalInputValue);
            }, 500);
          }
        } else if (isFinishingRecording) {
          // If we're finishing recording, clean up
          finalizeRecording();
        } else if (isRecording) {
          // If browser ended recognition but we're still recording, restart it
          try {
            recognition.current.start();
            console.log('Restarted speech recognition after auto-end');
          } catch (error) {
            console.error('Failed to restart speech recognition', error);
            stopRecording(false); // Don't submit if restart fails
          }
        }
      };
    }
    
    // Start the recognition process
    try {
      recognition.current.start();
      startSilenceDetection();
      // Start the recording timer
      const interval = setInterval(() => {
        if (isRecording) {
          setRecordingTimer(prev => prev + 1);
          
          // Check for max recording time
          const elapsed = Date.now() - recordingStartTime.current;
          if (elapsed > MAX_RECORDING_TIME) {
            clearInterval(interval);
            setRecordingFeedback('Maximum recording time reached');
            stopRecording(true); // Submit after max time
          }
        } else {
          clearInterval(interval);
        }
      }, 1000);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setRecordingFeedback('Error starting speech recognition');
    }
  };

  // NEW FUNCTION: Direct voice input submission
  const directSubmitVoiceInput = (voiceText) => {
    console.log("Directly submitting voice input:", voiceText);
    if (!voiceText || isLoading || hasReachedQuestionLimit) return;
    
    // Create user message object
    const userMessage = { text: voiceText, isUser: true, id: uuidv4() };
    
    // Update messages state
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setHasEngaged(true);
    
    // Clear input immediately
    forceClearInput();
    
    // Scroll to bottom
    setTimeout(scrollToBottom, 100);
    
    // Get current question count
    const isSecondQuestion = questionCount === 1;
    const isLastQuestion = questionCount === 2;
    
    // Make API call
    axios.post(`${API_BASE_URL}/chat`, {
      message: voiceText,
      sessionId,
      questionCount: questionCount + 1
    })
    .then(response => {
      const aiMessageId = uuidv4();
      
      setMessages(prev => [
        ...prev,
        { 
          text: response.data.message, 
          isUser: false, 
          id: aiMessageId
        }
      ]);
      
      setQuestionCount(prev => prev + 1);
      setIsLoading(false);
      
      // Ensure input is clear
      forceClearInput();
      
      // Scroll to bottom after receiving AI's message
      setTimeout(scrollToBottom, 100);
      
      // Show spiritual reminder every 2 messages
      if (messages.length % 4 === 0) {
        setShowSpiritualReminder(true);
        setTimeout(() => {
          setShowSpiritualReminder(false);
          scrollToBottom();
        }, 10000);
      }
      
      // Show email capture after second question if not shown before
      if (isSecondQuestion && !hasShownEmailCapture) {
        setShowEmailCapture(true);
        setHasShownEmailCapture(true);
      }
      
      // If voice is enabled, speak the response
      if (voiceEnabled) {
        handleSpeakMessage(response.data.message, aiMessageId);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { 
          text: "Forgive me, but I'm unable to receive Krishna's wisdom at this moment. Please try again later.", 
          isUser: false, 
          id: uuidv4() 
        }
      ]);
      setIsLoading(false);
      forceClearInput();
      setTimeout(scrollToBottom, 100);
    });
  };

  const stopRecording = (shouldSubmit = true) => {
    console.log("Stop recording called, shouldSubmit:", shouldSubmit);
    setIsFinishingRecording(true);
    setRecordingFeedback('Finishing recording...');
    
    // Capture the current input value before stopping
    const currentInput = input.trim();
    console.log("Current input at stop:", currentInput);
    
    if (recognition.current) {
      try {
        recognition.current.stop();
        
        // Wait a moment to ensure final transcript is processed
        if (shouldSubmit && currentInput && currentInput.length > 0) {
          console.log("Will submit after delay");
          setTimeout(() => {
            directSubmitVoiceInput(currentInput);
          }, 500);
        }
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    
    // Clean up resources
    finalizeRecording();
  };
  
  // New function to handle the cleanup of recording resources
  const finalizeRecording = () => {
    // Clean up audio resources
    if (audioContext.current) {
      if (audioContext.current.state !== 'closed') {
        audioContext.current.close().catch(err => console.error('Error closing audio context:', err));
      }
      audioContext.current = null;
    }
    
    // Stop microphone
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    
    // Clear timers
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
    
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
    
    // Reset state
    setIsRecording(false);
    setIsFinishingRecording(false);
    setIsSpeaking(false);
    setRecordingFeedback('');
    analyser.current = null;
  };

  // Handle silence detection - when silence is detected for too long, submit
  const startSilenceDetection = () => {
    silenceStartTime.current = Date.now();
    
    silenceTimer.current = setTimeout(() => {
      const totalRecordingTime = Date.now() - recordingStartTime.current;
      const currentInput = input.trim();
      
      // Only stop if we've been recording long enough and have some transcript
      if (totalRecordingTime > MIN_RECORDING_TIME && currentInput.length > 0) {
        setRecordingFeedback('Finished recording');
        stopRecording(true); // Submit after silence
      } else if (totalRecordingTime > MIN_RECORDING_TIME * 3 && !currentInput) {
        // If no input after 3x minimum time, stop anyway
        setRecordingFeedback('No speech detected');
        stopRecording(false); // Don't submit if no speech
      } else {
        // Otherwise, restart silence detection
        restartSilenceDetection();
      }
    }, SILENCE_THRESHOLD);
  };

  const restartSilenceDetection = () => {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
    startSilenceDetection();
  };

  const startVisualization = () => {
    if (!analyser.current) return;
    
    const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
    
    const updateVisualization = () => {
      if (!analyser.current || !isRecording) return;
      
      analyser.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const scaledLevel = Math.min(1, average / 128); // Scale to 0-1
      
      // Update audio level visualization
      setAudioLevels([
        Math.floor(scaledLevel * 40) + 5,
        Math.floor(scaledLevel * 50) + 5,
        Math.floor(scaledLevel * 30) + 5,
        Math.floor(scaledLevel * 45) + 5,
        Math.floor(scaledLevel * 35) + 5,
        Math.floor(scaledLevel * 25) + 5,
        Math.floor(scaledLevel * 55) + 5,
        Math.floor(scaledLevel * 30) + 5,
        Math.floor(scaledLevel * 40) + 5,
        Math.floor(scaledLevel * 35) + 5
      ]);
      
      // Detect speech based on audio level
      const speechDetected = scaledLevel > 0.05; // Lower threshold to be more sensitive
      setIsSpeaking(speechDetected);
      
      // If speech detected, reset silence timer
      if (speechDetected) {
        silenceStartTime.current = Date.now();
        setRecordingFeedback('Recording...');
      } else if (silenceStartTime.current) {
        const silentDuration = Date.now() - silenceStartTime.current;
        if (silentDuration > 2000) {
          setRecordingFeedback('Silence detected...');
        }
      }
      
      // Continue visualization loop
      requestAnimationFrame(updateVisualization);
    };
    
    // Start visualization loop
    requestAnimationFrame(updateVisualization);
  };

  // Add input handling functions for keyboard navigation
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading && input.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <ChatContainer>
      <TopBar>
        <div></div>
        
        <DonateButton onClick={handleDonate} title="Support Krishna's Divine Wisdom">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
          </svg>
          Donate
        </DonateButton>
      </TopBar>
      
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
      
      {/* Update visualization popup for recording */}
      <AnimatePresence>
        {isRecording && (
          <AudioVisualization
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <RecordingStatus isFinishing={isFinishingRecording}>
              {isFinishingRecording ? (
                "Finishing recording..."
              ) : (
                <>
                  <RecordingDot 
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  {recordingFeedback || `Recording... ${recordingTimer}s`}
                </>
              )}
            </RecordingStatus>
            
            <VisualizationBars>
              {Array.isArray(audioLevels) ? 
                audioLevels.map((height, index) => (
                  <AudioBar
                    key={index}
                    initial={{ height: 10 }}
                    animate={{ height }}
                    transition={{ duration: 0.1 }}
                  />
                ))
                :
                Array(10).fill(0).map((_, index) => (
                  <AudioBar
                    key={index}
                    initial={{ height: 10 }}
                    animate={{ height: 10 + Math.floor(Math.random() * 30) }}
                    transition={{ duration: 0.1 }}
                  />
                ))
              }
            </VisualizationBars>
            
            <StopButton onClick={stopRecording} title="Stop recording">
              <span style={{ width: '12px', height: '12px', backgroundColor: 'white' }}></span>
            </StopButton>
          </AudioVisualization>
        )}
      </AnimatePresence>
      
      {/* Add visualization popup for speaking */}
      <AnimatePresence>
        {isSpeaking && !isRecording && (
          <AudioVisualization
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <RecordingStatus>
              Krishna is speaking...
            </RecordingStatus>
            
            <VisualizationBars>
              {Array(10).fill(0).map((_, index) => (
                <AudioBar
                  key={index}
                  initial={{ height: 10 }}
                  animate={{ height: 10 + Math.floor(Math.random() * 30) }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </VisualizationBars>
            
            <StopButton onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              setIsSpeaking(false);
              setIsPlayingAudio(false);
            }} title="Stop speaking">
              <span style={{ width: '12px', height: '12px', backgroundColor: 'white' }}></span>
            </StopButton>
          </AudioVisualization>
        )}
      </AnimatePresence>
      
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
              <>
                <LikeButton 
                  onClick={() => handleLikeMessage(msg.id, msg.conversationId, msg.text)}
                  disabled={likedMessages.includes(msg.id)}
                  title="Express gratitude for this wisdom"
                  className={likedMessages.includes(msg.id) ? 'liked' : ''}
                >
                  {likedMessages.includes(msg.id) ? '❤️' : '🤍'}
                </LikeButton>
                
                <MessageVoiceButton 
                  onClick={() => handleSpeakMessage(msg.text, msg.id)}
                  disabled={isPlayingAudio && !isSpeaking}
                  title={isSpeaking && spokenMessages.includes(msg.id) ? "Stop speaking" : "Listen to Krishna's voice"}
                >
                  {isSpeaking && spokenMessages.includes(msg.id) ? <FaVolumeMute /> : <FaVolumeUp />}
                </MessageVoiceButton>
              </>
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
      
      <InputContainer>
        <RecordingFeedbackContainer 
          isRecording={isRecording} 
          isFinishing={isFinishingRecording}
        >
          {recordingFeedback} {recordingTimer > 0 && `(${recordingTimer}s)`}
        </RecordingFeedbackContainer>
        <StyledInput
          placeholder={isRecording 
            ? 'Recording your question...' 
            : isLoading 
              ? 'Please wait...' 
              : hasReachedQuestionLimit 
                ? 'Donation required for more questions' 
                : 'Type your question...'}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading || hasReachedQuestionLimit || isRecording}
        />
        <SendButton 
          onClick={handleSubmit} 
          disabled={isLoading || !input.trim() || hasReachedQuestionLimit}
        >
          <IoSend />
        </SendButton>
        <MicButton
          onClick={() => {
            console.log("Mic button clicked");
            // Force clear input before toggling
            forceClearInput();
            toggleSpeechInput();
          }}
          isRecording={isRecording}
          isSpeaking={isSpeaking}
          audioLevel={typeof audioLevels === 'number' ? audioLevels : 0}
          disabled={isLoading || hasReachedQuestionLimit}
          title={isRecording ? "Stop recording" : "Record your question"}
        >
          {isRecording ? <IoMicSharp /> : <IoMicOutline />}
        </MicButton>
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