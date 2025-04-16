import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase';
import ChatHistoryItem from './ChatHistoryItem';

const ProfileContainer = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #e8f4e5;
  margin-bottom: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  span {
    font-size: 3rem;
    color: #2C5F2D;
    font-weight: bold;
  }
`;

const EditOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
  
  &:hover {
    opacity: 1;
  }
`;

const EditIcon = styled.div`
  color: white;
  font-size: 24px;
`;

const UserName = styled.h2`
  margin: 0 0 5px 0;
  color: #2C5F2D;
  font-size: 1.8rem;
`;

const UserEmail = styled.p`
  margin: 0 0 20px 0;
  color: #666;
  font-size: 1rem;
`;

const UploadButton = styled.label`
  display: inline-block;
  background-color: #2C5F2D;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  text-align: center;
  
  &:hover {
    background-color: #234824;
  }
  
  input {
    display: none;
  }
`;

const HistorySection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #2C5F2D;
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8f4e5;
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #666;
  font-style: italic;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 0.9rem;
`;

const StatusMessage = styled.div`
  background-color: rgba(44, 95, 45, 0.1);
  color: #2C5F2D;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  font-size: 0.9rem;
`;

const ChatHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [profileUrl, setProfileUrl] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      try {
        // Try to get profile image if it exists
        const { data: profileData, error: profileError } = await supabase
          .storage
          .from('profile-images')
          .download(`${user.id}/profile.jpg`);
        
        if (profileData && !profileError) {
          const url = URL.createObjectURL(profileData);
          setProfileUrl(url);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        
        // Get all conversations for this user
        const { data: conversations, error: convError } = await supabase
          .from('conversations')
          .select('id, created_at, language, questions_asked, last_message_at')
          .eq('user_id', user.id)
          .order('last_message_at', { ascending: false });
          
        if (convError) throw convError;
        
        if (conversations && conversations.length > 0) {
          // For each conversation, fetch the first message and last message
          const conversationsWithMessages = await Promise.all(
            conversations.map(async (conversation) => {
              // Get first message (system greeting)
              const { data: firstMessage } = await supabase
                .from('messages')
                .select('message, created_at')
                .eq('conversation_id', conversation.id)
                .order('created_at', { ascending: true })
                .limit(1);
                
              // Get last user question
              const { data: lastUserQuestion } = await supabase
                .from('messages')
                .select('message, created_at')
                .eq('conversation_id', conversation.id)
                .eq('is_user', true)
                .order('created_at', { ascending: false })
                .limit(1);
                
              // Get last AI response
              const { data: lastAIResponse } = await supabase
                .from('messages')
                .select('message, created_at')
                .eq('conversation_id', conversation.id)
                .eq('is_user', false)
                .order('created_at', { ascending: false })
                .limit(1);
                
              return {
                ...conversation,
                firstMessage: firstMessage?.[0] || null,
                lastUserQuestion: lastUserQuestion?.[0] || null,
                lastAIResponse: lastAIResponse?.[0] || null
              };
            })
          );
          
          setChatHistory(conversationsWithMessages);
        } else {
          setChatHistory([]);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setError("Failed to load your chat history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
    fetchChatHistory();
  }, [user]);
  
  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setUploading(true);
      setError(null);
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase
        .storage
        .from('profile-images')
        .upload(`${user.id}/profile.jpg`, file, {
          upsert: true,
          contentType: file.type
        });
        
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded image
      const { data } = await supabase
        .storage
        .from('profile-images')
        .createSignedUrl(`${user.id}/profile.jpg`, 31536000); // URL valid for 1 year
        
      // Update user's avatar URL in metadata
      await supabase.auth.updateUser({
        data: { avatar_url: data.signedUrl }
      });
      
      // Display the new image
      setProfileUrl(URL.createObjectURL(file));
      setStatusMessage('Profile picture updated successfully');
      
      // Clear status message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const viewConversation = (conversationId) => {
    navigate(`/conversation/${conversationId}`);
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileImage>
          {profileUrl ? (
            <img src={profileUrl} alt="Profile" />
          ) : (
            <span>{getInitials(user.user_metadata?.full_name || 'User')}</span>
          )}
          <EditOverlay onClick={() => document.getElementById('fileInput').click()}>
            <EditIcon>📷</EditIcon>
          </EditOverlay>
        </ProfileImage>
        
        <UserName>{user.user_metadata?.full_name || 'Krishna Devotee'}</UserName>
        <UserEmail>{user.email}</UserEmail>
        
        <UploadButton htmlFor="fileInput">
          {uploading ? 'Uploading...' : 'Change Profile Picture'}
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </UploadButton>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {statusMessage && <StatusMessage>{statusMessage}</StatusMessage>}
      </ProfileCard>
      
      <HistorySection>
        <SectionTitle>Your Spiritual Conversations</SectionTitle>
        
        {loading ? (
          <LoadingIndicator>Loading your conversations...</LoadingIndicator>
        ) : chatHistory.length === 0 ? (
          <EmptyState>
            You haven't had any conversations with Krishna yet. 
            <br />
            Visit the <a href="/chat">Spiritual Guidance</a> page to begin your journey.
          </EmptyState>
        ) : (
          <ChatHistoryList>
            {chatHistory.map(conversation => (
              <ChatHistoryItem 
                key={conversation.id}
                conversation={conversation}
                onClick={() => viewConversation(conversation.id)}
              />
            ))}
          </ChatHistoryList>
        )}
      </HistorySection>
    </ProfileContainer>
  );
};

export default ProfilePage; 