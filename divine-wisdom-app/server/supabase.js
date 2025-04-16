const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const crypto = require('crypto');

// Enable file-based storage as fallback
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// File paths for storing data
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Initialize Supabase client for user data storage
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Configure console messages for connection status
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials not found in environment variables');
  console.warn('Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set');
  console.warn('Falling back to file-based storage');
} else {
  console.log('✅ Using ANON key for Supabase');
}

// Initialize Supabase client with error handling
let supabase = null;
let supabaseAdmin = null;

try {
  if (supabaseUrl && supabaseKey) {
    // Regular client for authenticated user operations
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      db: {
        schema: 'public'
      }
    });
    console.log('✅ Initializing Supabase client...');
    
    // Service role client for admin operations (bypasses RLS)
    if (supabaseServiceKey) {
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        },
        db: {
          schema: 'public'
        }
      });
      console.log('✅ Initializing Supabase admin client with service role...');
    } else {
      console.warn('⚠️ Service role key not found, some admin operations may fail');
      console.warn('You need to add SUPABASE_SERVICE_ROLE_KEY to your .env file');
      console.warn('Get this from your Supabase dashboard > Project Settings > API');
    }
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  console.warn('Falling back to file-based storage');
}

// Memory storage as fallback when Supabase operations fail
const memoryStorage = {
  users: [],
  user_profiles: [],
  conversations: [],
  messages: []
};

// Load data from files if they exist
function loadDataFromFiles() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      memoryStorage.users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      console.log(`✅ Loaded ${memoryStorage.users.length} users from file`);
    }
    
    if (fs.existsSync(CONVERSATIONS_FILE)) {
      memoryStorage.conversations = JSON.parse(fs.readFileSync(CONVERSATIONS_FILE, 'utf8'));
      console.log(`✅ Loaded ${memoryStorage.conversations.length} conversations from file`);
    }
    
    if (fs.existsSync(MESSAGES_FILE)) {
      memoryStorage.messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf8'));
      console.log(`✅ Loaded ${memoryStorage.messages.length} messages from file`);
    }
  } catch (error) {
    console.error('Error loading data from files:', error);
  }
}

// Save data to files
function saveDataToFiles() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(memoryStorage.users, null, 2));
    fs.writeFileSync(CONVERSATIONS_FILE, JSON.stringify(memoryStorage.conversations, null, 2));
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(memoryStorage.messages, null, 2));
  } catch (error) {
    console.error('Error saving data to files:', error);
  }
}

// Initialize data
loadDataFromFiles();

// Test the connection by making a simple query
async function testSupabaseConnection() {
  if (!supabase) {
    console.warn('⚠️ Supabase client not initialized, using file-based storage');
    return false;
  }
  
  try {
    // Test the database connection with a simple query
    const { data, error } = await supabase
      .from('users')
      .select('count');
    
    if (error) {
      if (error.code === '42501') { // RLS policy error
        console.log('✅ Supabase connection successful (with RLS restrictions)');
        return true;
      }
      throw error;
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase:', error.message);
    console.warn('Falling back to file-based storage');
    return false;
  }
}

// Run the connection test
testSupabaseConnection();

module.exports = {
  supabase,
  supabaseAdmin,
  
  // User operations
  async createOrUpdateUser(email, name) {
    try {
      // Use admin client if available, otherwise use regular client
      const client = supabaseAdmin || supabase;
      
      if (!client) {
        console.warn('⚠️ Supabase client not initialized, using file-based storage');
        return createOrUpdateUserInMemory(email, name);
      }

      // First try to find the user
      const { data: existingUser, error: selectError } = await client
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking for existing user:', selectError);
        throw selectError;
      }

      if (existingUser) {
        // Update existing user's profile
        const { data: profileData, error: profileError } = await client
          .from('user_profiles')
          .upsert({
            user_id: existingUser.id,
            full_name: name,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (profileError) {
          console.error('Error updating user profile:', profileError);
          throw profileError;
        }

        return { ...existingUser, profile: profileData };
      } else {
        // Generate a proper UUID for the user (not prefixed string ID)
        const userId = uuid.v4();
        
        // Insert new user with properly formatted UUID
        const { data: userData, error: insertError } = await client
          .from('users')
          .insert([{
            id: userId,
            email,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
          throw insertError;
        }

        // Create user profile
        const { data: profileData, error: profileError } = await client
          .from('user_profiles')
          .insert([{
            user_id: userData.id,
            full_name: name,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          throw profileError;
        }

        return { ...userData, profile: profileData };
      }
    } catch (error) {
      console.error('Error in createOrUpdateUser:', error);
      // Fall back to local storage if needed
      return createOrUpdateUserInMemory(email, name);
    }
  },
  
  // Conversation operations
  async createConversation(userId, sessionId, language = 'english') {
    try {
      // First try Supabase if available
      // Use admin client for conversations if available
      const client = supabaseAdmin || supabase;
      
      if (client) {
        // Create conversation in Supabase
        const { data, error } = await client
          .from('conversations')
          .insert([
            { 
              user_id: userId, 
              session_id: sessionId, 
              language,
              created_at: new Date(),
              last_message_at: new Date()
            }
          ])
          .select();
        
        if (!error && data && data.length > 0) {
          console.log(`✅ New conversation created in Supabase for session: ${sessionId}`);
          return data[0];
        }
        
        if (error) {
          console.error('Error creating conversation:', error);
          // Only throw if it's not an RLS policy error or if we're using admin client
          if (error.code !== '42501' || supabaseAdmin) throw error;
        }
      }
      
      // Fallback to local storage
      return createConversationInMemory(userId, sessionId, language);
    } catch (error) {
      console.error('Error in createConversation:', error);
      // Fallback to local storage
      return createConversationInMemory(userId, sessionId, language);
    }
  },
  
  async getConversationBySessionId(sessionId) {
    try {
      // First try Supabase if available
      if (supabase) {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('session_id', sessionId)
          .limit(1);
        
        if (!error && data && data.length > 0) {
          return data[0];
        }
        
        if (error) {
          console.error('Error getting conversation by session ID:', error);
          // Only throw if it's not an RLS policy error
          if (error.code !== '42501') throw error;
        }
      }
      
      // Fallback to local storage
      return getConversationBySessionIdFromMemory(sessionId);
    } catch (error) {
      console.error('Error in getConversationBySessionId:', error);
      // Fallback to local storage
      return getConversationBySessionIdFromMemory(sessionId);
    }
  },
  
  async updateConversation(id, updates) {
    try {
      // First try Supabase if available
      if (supabase) {
        const { data, error } = await supabase
          .from('conversations')
          .update({
            ...updates,
            last_message_at: new Date()
          })
          .eq('id', id)
          .select();
        
        if (!error && data && data.length > 0) {
          return data[0];
        }
        
        if (error) {
          console.error('Error updating conversation:', error);
          // Only throw if it's not an RLS policy error
          if (error.code !== '42501') throw error;
        }
      }
      
      // Fallback to local storage
      return updateConversationInMemory(id, updates);
    } catch (error) {
      console.error('Error in updateConversation:', error);
      // Fallback to local storage
      return updateConversationInMemory(id, updates);
    }
  },
  
  // Message operations
  async saveMessage(conversationId, message, isUser, detectedLanguage) {
    try {
      // Check if message contains a quote (look for text in double quotes)
      const containsQuote = !isUser && message.includes('"');
      
      // Use admin client if available
      const client = supabaseAdmin || supabase;
      
      // First try Supabase if available
      if (client) {
        // Log details for debugging
        console.log(`Attempting to save message to conversation: ${conversationId}`);
        console.log(`Message details: isUser=${isUser}, detectedLanguage=${detectedLanguage}, containsQuote=${containsQuote}`);
        
        // Save the message to Supabase - very explicit column names
        const { data, error } = await client
          .from('messages')
          .insert([
            { 
              conversation_id: conversationId, 
              message: message,
              is_user: isUser, 
              detected_language: detectedLanguage,
              created_at: new Date().toISOString(),
              contains_quote: containsQuote
            }
          ])
          .select();
        
        if (!error && data && data.length > 0) {
          console.log(`✅ Successfully saved message to conversation: ${conversationId}`);
          
          // If there's a quote, extract and save it
          if (containsQuote) {
            const quoteMatch = message.match(/"([^"]+)"/);
            if (quoteMatch && quoteMatch[1]) {
              const quoteText = quoteMatch[1];
              await this.saveQuote(data[0].id, quoteText, detectedLanguage);
            }
          }
          
          return data[0];
        }
        
        if (error) {
          console.error('Error saving message:', error);
          
          // Try a different approach for the table schema if the column doesn't exist
          if (error.code === 'PGRST204' && error.message.includes("content")) {
            console.log('Attempting alternative approach with different column name');
            
            const { data: alternativeData, error: alternativeError } = await client
              .from('messages')
              .insert([
                { 
                  conversation_id: conversationId, 
                  content: message, // Try 'content' instead of 'message'
                  is_user_message: isUser, // Try 'is_user_message' instead of 'is_user'
                  detected_language: detectedLanguage,
                  created_at: new Date().toISOString(),
                  metadata: { contains_quote: containsQuote }
                }
              ])
              .select();
              
            if (!alternativeError && alternativeData && alternativeData.length > 0) {
              console.log(`✅ Successfully saved message using alternative schema approach`);
              return alternativeData[0];
            }
            
            if (alternativeError) {
              console.error('Error with alternative message saving approach:', alternativeError);
            }
          }
          
          // Only throw if it's not an RLS policy error or we're using admin client
          if (error.code !== '42501' || supabaseAdmin) throw error;
        }
      }
      
      // Fallback to local storage
      return saveMessageInMemory(conversationId, message, isUser, detectedLanguage);
    } catch (error) {
      console.error('Error in saveMessage:', error);
      // Fallback to local storage
      return saveMessageInMemory(conversationId, message, isUser, detectedLanguage);
    }
  },
  
  async saveQuote(messageId, quoteText, language) {
    try {
      // First try Supabase if available
      if (supabase) {
        const { error } = await supabase
          .from('quotes')
          .insert([
            { 
              message_id: messageId, 
              quote_text: quoteText, 
              language,
              created_at: new Date()
            }
          ]);
        
        if (error && error.code !== '42501') {
          console.error('Error saving quote:', error);
        }
      }
      
      // Quotes are not critical for functionality
      return true;
    } catch (error) {
      console.error('Error in saveQuote:', error);
      return true;
    }
  },
  
  // Analytics operations
  async logEvent(eventType, conversationId, userId, additionalData = {}) {
    try {
      // First try Supabase if available
      if (supabase) {
        const { error } = await supabase
          .from('analytics')
          .insert([
            { 
              event_type: eventType,
              conversation_id: conversationId,
              user_id: userId,
              data: additionalData,
              created_at: new Date()
            }
          ]);
        
        if (error && error.code !== '42501') {
          console.error('Error logging event:', error);
        }
      }
      
      // Log to console as backup
      console.log('EVENT:', {
        event_type: eventType,
        conversation_id: conversationId,
        user_id: userId,
        data: additionalData,
        timestamp: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Error in logEvent:', error);
      return true;
    }
  },
  
  // Like a message from Krishna
  async likeMessage(messageId, conversationId, userId = null) {
    try {
      // First try Supabase if available
      if (supabase) {
        console.log(`Attempting to like message: ${messageId} for conversation: ${conversationId}`);
        
        const { error } = await supabase
          .from('analytics')
          .insert([
            { 
              event_type: 'message_liked',
              conversation_id: conversationId,
              user_id: userId,
              data: { message_id: messageId },
              created_at: new Date()
            }
          ]);
        
        if (error) {
          console.error('Error logging message like:', error);
          
          // If it's a foreign key constraint error, try an alternative approach
          if (error.code === '23503' && error.message.includes('conversation_id')) {
            console.log('Foreign key constraint issue - trying to save without conversation_id');
            
            // Try inserting without the conversation_id
            const { error: altError } = await supabase
              .from('analytics')
              .insert([
                { 
                  event_type: 'message_liked',
                  user_id: userId,
                  data: { 
                    message_id: messageId,
                    conversation_id: conversationId // Store in data JSON instead
                  },
                  created_at: new Date()
                }
              ]);
              
            if (altError) {
              console.error('Error with alternative like approach:', altError);
              return false;
            }
            
            console.log('Successfully liked message using alternative approach');
            return true;
          }
          
          if (error.code !== '42501') {
            return false;
          }
        }
      }
      
      // Log to console as backup
      console.log('MESSAGE LIKED:', {
        message_id: messageId,
        conversation_id: conversationId,
        user_id: userId,
        timestamp: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Error in likeMessage:', error);
      return false;
    }
  },
  
  // Get most liked messages
  async getMostLikedMessages(limit = 10) {
    try {
      if (!supabase) {
        console.warn('⚠️ Supabase client not initialized, using file-based storage');
        return [];
      }
      
      // Get analytics data for liked messages, grouped by message_id
      const { data, error } = await supabase
        .from('analytics')
        .select('data')
        .eq('event_type', 'message_liked')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error getting most liked messages:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Count likes for each message
      const messageLikes = {};
      data.forEach(record => {
        const messageId = record.data?.message_id;
        if (messageId) {
          messageLikes[messageId] = (messageLikes[messageId] || 0) + 1;
        }
      });
      
      // Convert to array, sort by likes count, and take top N
      const topMessages = Object.entries(messageLikes)
        .map(([messageId, count]) => {
          // Find the content for this message
          const messageData = data.find(record => record.data?.message_id === messageId);
          return {
            messageId,
            likeCount: count,
            content: messageData?.data?.message_content || '',
          };
        })
        .sort((a, b) => b.likeCount - a.likeCount)
        .slice(0, limit);
      
      return topMessages;
    } catch (error) {
      console.error('Error in getMostLikedMessages:', error);
      return [];
    }
  },
  
  // Get saved chats for a user
  async getSavedChats(userId) {
    try {
      if (!userId) return [];
      
      if (!supabase) {
        console.warn('⚠️ Supabase client not initialized, using file-based storage');
        return getSavedChatsFromMemory(userId);
      }
      
      // Get all saved conversations for the user
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_saved', true)
        .order('saved_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching saved chats:', error);
        return [];
      }
      
      if (!conversations || conversations.length === 0) {
        return [];
      }
      
      // For each conversation, fetch the last question and answer
      const conversationsWithPreview = await Promise.all(conversations.map(async (conversation) => {
        // Get the most recent user message
        const { data: userMessages, error: userMsgError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .eq('is_user', true)
          .order('created_at', { ascending: false })
          .limit(1);
          
        // Get the most recent AI message
        const { data: aiMessages, error: aiMsgError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .eq('is_user', false)
          .order('created_at', { ascending: false })
          .limit(1);
          
        return {
          ...conversation,
          lastUserQuestion: userMsgError ? null : (userMessages?.[0] || null),
          lastAIResponse: aiMsgError ? null : (aiMessages?.[0] || null),
        };
      }));
      
      return conversationsWithPreview;
    } catch (error) {
      console.error('Error in getSavedChats:', error);
      return getSavedChatsFromMemory(userId);
    }
  },
  
  // Get user profile data for analytics
  async getUserProfile(userId) {
    try {
      if (!userId) return null;
      
      // First try Supabase if available
      if (supabase) {
        // First get the user
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .limit(1);
          
        if (userError && userError.code !== '42501') {
          console.error('Error getting user profile:', userError);
          // If not RLS, throw the error
          throw userError;
        }
        
        if (userData && userData.length > 0) {
          const user = userData[0];
          
          // Get conversations count
          const { data: convCount, error: convCountError } = await supabase
            .from('conversations')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId);
            
          // Get message count
          const { data: msgCount, error: msgCountError } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .in('conversation_id', supabase.from('conversations').select('id').eq('user_id', userId));
          
          return {
            user,
            stats: {
              conversations: convCountError ? null : (convCount?.length || 0),
              messages: msgCountError ? null : (msgCount?.length || 0),
              firstJoined: user.created_at,
              lastActive: user.last_active
            }
          };
        }
      }
      
      // Fallback to memory storage
      return getUserProfileFromMemory(userId);
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      // Fallback to memory storage
      return getUserProfileFromMemory(userId);
    }
  }
};

// Memory fallback helper functions
function createOrUpdateUserInMemory(email, name) {
  console.log(`⚠️ Using memory storage for user: ${email}`);
  const existingUserIndex = memoryStorage.users.findIndex(u => u.email === email);
  
  if (existingUserIndex >= 0) {
    const user = memoryStorage.users[existingUserIndex];
    // Update user profile
    const existingProfileIndex = memoryStorage.user_profiles.findIndex(p => p.user_id === user.id);
    if (existingProfileIndex >= 0) {
      memoryStorage.user_profiles[existingProfileIndex].full_name = name;
      memoryStorage.user_profiles[existingProfileIndex].updated_at = new Date().toISOString();
    } else {
      memoryStorage.user_profiles.push({
        id: uuid.v4(),
        user_id: user.id,
        full_name: name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    saveDataToFiles();
    return {
      ...user,
      profile: memoryStorage.user_profiles.find(p => p.user_id === user.id)
    };
  } else {
    const userId = uuid.v4();
    const newUser = { 
      id: userId,
      email,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    };
    
    const newProfile = {
      id: uuid.v4(),
      user_id: userId,
      full_name: name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    memoryStorage.users.push(newUser);
    memoryStorage.user_profiles.push(newProfile);
    saveDataToFiles();
    return {
      ...newUser,
      profile: newProfile
    };
  }
}

function createConversationInMemory(userId, sessionId, language) {
  console.log(`⚠️ Using memory storage for conversation: ${sessionId}`);
  const newConversation = {
    id: uuid.v4(),
    user_id: userId,
    session_id: sessionId,
    language,
    created_at: new Date(),
    last_message_at: new Date(),
    questions_asked: 0
  };
  
  memoryStorage.conversations.push(newConversation);
  saveDataToFiles();
  return newConversation;
}

function getConversationBySessionIdFromMemory(sessionId) {
  console.log(`⚠️ Using memory storage to fetch conversation: ${sessionId}`);
  const conversation = memoryStorage.conversations.find(c => c.session_id === sessionId);
  return conversation || null;
}

function updateConversationInMemory(id, updates) {
  console.log(`⚠️ Using memory storage to update conversation: ${id}`);
  const conversationIndex = memoryStorage.conversations.findIndex(c => c.id === id);
  
  if (conversationIndex >= 0) {
    memoryStorage.conversations[conversationIndex] = {
      ...memoryStorage.conversations[conversationIndex],
      ...updates,
      last_message_at: new Date()
    };
    
    saveDataToFiles();
    return memoryStorage.conversations[conversationIndex];
  }
  
  return null;
}

function saveMessageInMemory(conversationId, message, isUser, detectedLanguage) {
  console.log(`⚠️ Using memory storage to save message for conversation: ${conversationId}`);
  const containsQuote = !isUser && message.includes('"');
  
  const newMessage = {
    id: uuid.v4(),
    conversation_id: conversationId,
    message,
    is_user: isUser,
    contains_quote: containsQuote,
    detected_language: detectedLanguage,
    created_at: new Date()
  };
  
  memoryStorage.messages.push(newMessage);
  saveDataToFiles();
  return newMessage;
}

function getUserProfileFromMemory(userId) {
  console.log(`⚠️ Using memory storage to get user profile: ${userId}`);
  const user = memoryStorage.users.find(u => u.id === userId);
  
  if (!user) return null;
  
  const userConversations = memoryStorage.conversations.filter(c => c.user_id === userId);
  const conversationIds = userConversations.map(c => c.id);
  const userMessages = memoryStorage.messages.filter(m => conversationIds.includes(m.conversation_id));
  
  return {
    user,
    stats: {
      conversations: userConversations.length,
      messages: userMessages.length,
      firstJoined: user.created_at,
      lastActive: user.last_active
    }
  };
}

function getSavedChatsFromMemory(userId) {
  console.log(`⚠️ Using memory storage to get saved chats for user: ${userId}`);
  
  // Get all saved conversations for the user
  const savedConversations = memoryStorage.conversations.filter(c => 
    c.user_id === userId && c.is_saved === true
  ).sort((a, b) => {
    // Sort by saved_at timestamp, newest first
    const dateA = a.saved_at ? new Date(a.saved_at) : new Date(a.created_at);
    const dateB = b.saved_at ? new Date(b.saved_at) : new Date(b.created_at);
    return dateB - dateA;
  });
  
  // For each conversation, add preview data
  return savedConversations.map(conversation => {
    // Find most recent user message
    const userMessages = memoryStorage.messages
      .filter(m => m.conversation_id === conversation.id && m.is_user === true)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
    // Find most recent AI message
    const aiMessages = memoryStorage.messages
      .filter(m => m.conversation_id === conversation.id && m.is_user === false)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
    return {
      ...conversation,
      lastUserQuestion: userMessages[0] || null,
      lastAIResponse: aiMessages[0] || null
    };
  });
} 