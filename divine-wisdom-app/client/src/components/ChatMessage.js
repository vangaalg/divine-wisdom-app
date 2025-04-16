import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const divineGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(26, 35, 126, 0.2); }
  50% { box-shadow: 0 0 15px rgba(26, 35, 126, 0.4); }
  100% { box-shadow: 0 0 5px rgba(26, 35, 126, 0.2); }
`;

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
  animation: ${fadeIn} 0.5s ease forwards;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: ${props => props.isUser ? '0 0 0 12px' : '0 12px 0 0'};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isUser 
    ? props.theme.colors.peacockGradient 
    : props.theme.colors.krishnaGradient};
  color: white;
  font-weight: 500;
  font-size: 16px;
  border: 2px solid white;
  box-shadow: ${props => props.theme.shadows.light};
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  ${props => !props.isUser && `
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 70%);
      animation: ${divineGlow} 3s infinite ease-in-out;
    }
  `}
`;

const KrishnaIcon = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
  z-index: 1;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: ${props => props.isUser 
    ? props.theme.borderRadius.medium + ' ' + props.theme.borderRadius.small + ' ' + props.theme.borderRadius.small + ' ' + props.theme.borderRadius.medium 
    : props.theme.borderRadius.small + ' ' + props.theme.borderRadius.medium + ' ' + props.theme.borderRadius.medium + ' ' + props.theme.borderRadius.small};
  background: ${props => props.isUser 
    ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' 
    : 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)'};
  position: relative;
  box-shadow: ${props => props.theme.shadows.light};
  line-height: 1.5;
  
  ${props => !props.isUser && `
    border-left: 3px solid ${props.theme.colors.gold};
  `}

  ${props => props.isUser && `
    border-right: 3px solid ${props.theme.colors.peacockFeather};
  `}
  
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    
    ${props => props.isUser ? `
      right: -8px;
      top: 10px;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 8px solid #C8E6C9;
    ` : `
      left: -8px;
      top: 10px;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-right: 8px solid #C5CAE9;
    `}
  }
`;

const MessageText = styled.div`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 15px;
  white-space: pre-wrap;
`;

const QuoteBlock = styled.blockquote`
  font-style: italic;
  border-left: 3px solid ${props => props.theme.colors.gold};
  padding-left: 12px;
  margin: 12px 0;
  color: ${props => props.theme.colors.krishnaBlue};
  font-family: ${props => props.theme.fonts.heading};
  line-height: 1.6;
`;

const MessageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.active 
    ? props.theme.colors.gold 
    : props.theme.colors.textSecondary};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: ${props => props.theme.colors.gold};
  }
`;

const Timestamp = styled.div`
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 4px;
  text-align: ${props => props.isUser ? 'right' : 'left'};
`;

const ChatMessage = ({ message, isUser, timestamp, onLike, liked, name, avatarUrl }) => {
  const [showActions, setShowActions] = useState(false);
  
  // Extract quotes from message for Krishna's messages
  const extractQuote = (message) => {
    if (isUser) return null;
    
    const quoteRegex = /"([^"]+)"/;
    const match = message.match(quoteRegex);
    
    if (match && match[1]) {
      return match[1];
    }
    
    return null;
  };
  
  const quote = extractQuote(message);
  
  // Format message content to remove the quote for display
  const formatMessage = (message, quote) => {
    if (!quote) return message;
    
    return message.replace(`"${quote}"`, '');
  };
  
  const getUserInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <MessageContainer 
      isUser={isUser}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar isUser={isUser}>
        {isUser ? (
          avatarUrl ? (
            <img src={avatarUrl} alt="User" />
          ) : (
            getUserInitials(name || 'User')
          )
        ) : (
          <KrishnaIcon>
            <i className="fas fa-om"></i>
          </KrishnaIcon>
        )}
      </Avatar>
      
      <div>
        <MessageBubble isUser={isUser}>
          <MessageText>
            {quote ? formatMessage(message, quote) : message}
            
            {quote && (
              <QuoteBlock>"{quote}"</QuoteBlock>
            )}
          </MessageText>
          
          {!isUser && showActions && (
            <MessageActions>
              <ActionButton active={liked} onClick={onLike}>
                <i className={`${liked ? 'fas' : 'far'} fa-heart`}></i>
                {liked ? 'Liked' : 'Like'}
              </ActionButton>
            </MessageActions>
          )}
        </MessageBubble>
        
        <Timestamp isUser={isUser}>
          {formatTimestamp(timestamp)}
        </Timestamp>
      </div>
    </MessageContainer>
  );
};

export default ChatMessage; 