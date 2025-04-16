import React from 'react';
import styled from 'styled-components';
import { format, formatDistanceToNow } from 'date-fns';

const HistoryItem = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid #2C5F2D;
  
  &:hover {
    background: #f0f8f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ConversationDate = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const QuestionsCount = styled.div`
  font-size: 0.85rem;
  color: #2C5F2D;
  font-weight: 500;
`;

const ConversationTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const QuestionPreview = styled.div`
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const AnswerPreview = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const ChatHistoryItem = ({ conversation, onClick }) => {
  // Format dates for display
  const formattedDate = conversation.created_at 
    ? format(new Date(conversation.created_at), 'MMMM d, yyyy')
    : 'Unknown date';
    
  const timeAgo = conversation.last_message_at
    ? formatDistanceToNow(new Date(conversation.last_message_at), { addSuffix: true })
    : '';
  
  // Extract preview content
  const questionPreview = conversation.lastUserQuestion?.message || 'No questions asked';
  const answerPreview = conversation.lastAIResponse?.message || 'No response yet';
  
  // Create a title based on first message or language
  const conversationTitle = (() => {
    if (conversation.firstMessage?.message) {
      // Try to extract a meaningful title from the first system message
      const message = conversation.firstMessage.message;
      const firstSentence = message.split('.')[0];
      if (firstSentence.length < 60) return firstSentence;
      return `Conversation in ${conversation.language || 'English'}`;
    }
    return `Spiritual Guidance (${conversation.language || 'English'})`;
  })();

  return (
    <HistoryItem onClick={onClick}>
      <HistoryHeader>
        <ConversationDate>{formattedDate}</ConversationDate>
        <QuestionsCount>
          {conversation.questions_asked} question{conversation.questions_asked !== 1 ? 's' : ''} asked
        </QuestionsCount>
      </HistoryHeader>
      
      <ConversationTitle>{conversationTitle}</ConversationTitle>
      
      <QuestionPreview>
        <strong>Q:</strong> {questionPreview}
      </QuestionPreview>
      
      <AnswerPreview>
        <strong>A:</strong> {answerPreview}
      </AnswerPreview>
      
      <ConversationDate>Last activity: {timeAgo}</ConversationDate>
    </HistoryItem>
  );
};

export default ChatHistoryItem; 