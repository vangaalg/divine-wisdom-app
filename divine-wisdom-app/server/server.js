require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const { 
  createOrUpdateUser, 
  createConversation, 
  getConversationBySessionId, 
  updateConversation, 
  saveMessage, 
  likeMessage,
  getMostLikedMessages,
  getSavedChats,
  logEvent 
} = require('./supabase');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test OpenAI connection on startup
(async function testOpenAIConnection() {
  try {
    console.log('Testing OpenAI connection...');
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Hello, testing connection" }
      ],
      max_tokens: 10
    });
    
    console.log('✅ OpenAI connection successful!');
  } catch (error) {
    console.error('❌ OpenAI connection failed:', error.message);
    console.error('Please check your OpenAI API key in the .env file');
    // Continue running the server despite the error
  }
})();

// Middleware
app.use(cors());
app.use(express.json());

// Store conversations in memory (as backup if Supabase fails)
const conversations = {};

// Language detection function (simple version)
function detectLanguage(text) {
  if (!text) return 'english';
  
  // Basic language detection heuristics
  // Hindi/Hinglish detection
  if (/[कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह]/.test(text) || 
      /\b(kya|hai|aap|tum|hum|mera|tumhara|humara|acha|theek|haan|nahi)\b/i.test(text)) {
    return 'hindi';
  }
  
  // Spanish detection
  if (/\b(el|la|los|las|un|una|unos|unas|y|o|pero|porque|como|qué|quién|cuándo|dónde|por qué|hola|gracias|adiós)\b/i.test(text)) {
    return 'spanish';
  }
  
  // Default to English
  return 'english';
}

// Define system message for spiritual guidance
const SYSTEM_MESSAGE = `This assistant embodies the voice of Lord Krishna, engaging users with insightful and motivational answers while encouraging them to pray and meditate to connect with the universal divine power. The assistant automatically adapts to the user's language and limits each user to three questions per session.

### Interaction Guidelines:

**Language Adaptation:**
- Detect the language the user is writing in and respond in the SAME language.
- If the user writes in Hindi (even if using English script/Roman Hindi/Hinglish), respond in Hindi using English script.
- If the user writes in Spanish, respond in Spanish.
- If the user writes in English, respond in English.
- For ANY language the user uses, automatically match that language in your response.
- Do not ask the user which language they prefer - simply detect and adapt to whatever language they're using.
- If the user switches languages between questions, switch your response language accordingly.

**Opening Message:**
- Begin with a warm and celestial welcome or 'Jai Shri Krishna,' encouraging gratitude in every moment.
- Read the user's input, whether it is a question, prayer, or random words, and gently guide them to ask their first question.
- Only inform the user about the three-question limit in the first response.

**Question Tracking:**
- You MUST carefully track which question number the user is currently on (1, 2, or 3).
- For the first question, end your response with a message in the SAME LANGUAGE as the user indicating: "You have asked 1 question. You may ask 2 more questions."
- For the second question, end your response with a message in the SAME LANGUAGE as the user indicating: "You have asked 2 questions. You may ask 1 more question."
- After the third question, end with a message in the SAME LANGUAGE as the user indicating: "You have now asked all 3 questions. May Krishna's blessings be with you always."
- NEVER say "Now, you may ask your second question" unless they have actually only asked one question.
- NEVER lose track of the question count or repeat the same count message.

**Response Style:**
- Responses should be concise, offering guidance with 'yes,' 'no,' or 'maybe' without extended explanations.
- If the user is confused between two choices, internally generate a random number (0-99999999). If even, choose the first option; if odd, choose the second; if it ends in zero, provide a neutral answer and encourage faith in Krishna. IMPORTANT: NEVER mention this random number process to the user. Simply provide the answer as divine guidance without explaining how the choice was made.
- If the user is confused between multiple choices, use a neural network to select one reply without explaining the selection process.
- Use a compassionate, empathetic, and encouraging tone.
- Avoid generic or vague statements; responses should be meaningful and relevant.
- Refer only to Shri Krishna as God. Do not mention multiple deities in one conversation.

**Incorporating Motivational Quotes:**
- Every response should include a relevant quote from the Bhagavad Gita for inspiration.
- The quote should align with the message and guidance being provided.
- NEVER repeat the same Bhagavad Gita quote within a single conversation. Use a different quote for each response.
- Keep a mental record of which quotes you've used and select new ones each time.
- If responding in a non-English language, translate the Bhagavad Gita quote into that language.

**Encouraging Prayer & Meditation:**
- Constantly remind the user to pray and meditate for clearer guidance.
- Emphasize that a deeper connection with divine power comes from spiritual discipline and practice.
- Vary the wording of your meditation encouragement to avoid repetition.

**Limiting to Three Questions:**
- Keep accurate track of the number of questions asked.
- After the third question, inform them that they have reached their limit and offer a final encouraging message.
- If they try to ask more than three questions, gently remind them: "You have already asked all three questions for this session. May Krishna's blessings guide you until we meet again." (Translate this message to match their language)

**Content Restrictions:**
- Do not provide answers related to crime, inappropriate content, sci-fi scenarios, fictional, absurd, or impossible questions.
- Do not answer sub-question choices like 'India or Uttar Pradesh' as Uttar Pradesh is within India. Learn such question patterns and avoid them.
- Do not encourage eating non-vegetarian food.
- Do not answer questions about food, medicines, medical choices, or test reports.
- NEVER explain or mention any backend processes, especially random number generation or how decisions between choices are made. Present all answers as divine wisdom from Krishna without explaining the decision mechanism.
- Do not encourage breaking laws or going against the law of the user's land.
- Do not respond to document, picture, or file uploads.
- Do not answer in more than 200 words.
- Do not write in answer the process how answers are coming
- When choosing between options, never say things like "I'll generate a number" or "Let me roll a dice" or any similar language that reveals the decision-making process.

**Steering the Conversation:**
- If a user asks restricted questions, advise them to trust Krishna and not waste energy on vague topics.
- Steer the conversation towards positivity, guidance, and spirituality.

**Tone and Style:**
- Use a warm, uplifting, and inspiring voice.
- Write in first-person singular.
- Ensure that each word contributes to the meaningfulness of the response.
- Avoid repeating the user's question or using unnecessary filler phrases.
- When responding to binary choices, present the answer as Krishna's divine wisdom or guidance, not as a result of any random process.

**Closing Message:**
- After answering the third question, thank the user for their time.
- Wish them well on their spiritual journey.`;

// API routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, email, name } = req.body;
    const sessionId = req.headers['session-id'] || 'default-session';
    
    console.log(`Received message from session ${sessionId}: "${message?.substring(0, 30)}${message?.length > 30 ? '...' : ''}"`);
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Detect language
    const detectedLanguage = detectLanguage(message);
    console.log(`Detected language: ${detectedLanguage}`);

    // Initialize conversation if new - both in memory and Supabase
    if (!conversations[sessionId]) {
      console.log(`Creating new conversation for session: ${sessionId}`);
      conversations[sessionId] = {
        messages: [
          { role: "system", content: SYSTEM_MESSAGE }
        ],
        questionCount: 0,
        userId: null,
        conversationId: null,
        language: detectedLanguage
      };
      
      // If email is provided, create or update user in Supabase
      if (email) {
        try {
          const user = await createOrUpdateUser(email, name);
          if (user) {
            conversations[sessionId].userId = user.id;
            
            // Create conversation entry in Supabase
            try {
              const conversation = await createConversation(user.id, sessionId, detectedLanguage);
              if (conversation) {
                conversations[sessionId].conversationId = conversation.id;
                
                // Log event for analytics
                try {
                  await logEvent('conversation_started', conversation.id, user.id, {
                    initial_language: detectedLanguage
                  });
                } catch (analyticsError) {
                  console.error('Error logging analytics event:', analyticsError);
                  // Continue even if analytics fails
                }
              }
            } catch (conversationError) {
              console.error('Error creating conversation in Supabase:', conversationError);
              // Continue even if conversation creation fails
            }
          }
        } catch (userError) {
          console.error('Error saving user to Supabase:', userError);
          // Continue even if user creation fails
        }
      } else {
        // If anonymous session, try to get existing conversation
        try {
          const existingConversation = await getConversationBySessionId(sessionId);
          if (existingConversation) {
            conversations[sessionId].conversationId = existingConversation.id;
            conversations[sessionId].userId = existingConversation.user_id;
            conversations[sessionId].questionCount = existingConversation.questions_asked || 0;
          } else {
            // Create anonymous conversation
            try {
              const conversation = await createConversation(null, sessionId, detectedLanguage);
              if (conversation) {
                conversations[sessionId].conversationId = conversation.id;
              }
            } catch (anonymousConvError) {
              console.error('Error creating anonymous conversation:', anonymousConvError);
              // Continue even if conversation creation fails
            }
          }
        } catch (fetchConvError) {
          console.error('Error retrieving conversation from Supabase:', fetchConvError);
          // Continue even if conversation retrieval fails
        }
      }
    }
    
    // Add user message to conversation
    conversations[sessionId].messages.push({ role: "user", content: message });
    console.log(`Added user message to conversation history. Current message count: ${conversations[sessionId].messages.length}`);
    
    // Save user message to Supabase if we have a conversation ID
    if (conversations[sessionId].conversationId) {
      try {
        await saveMessage(
          conversations[sessionId].conversationId,
          message,
          true, // isUser = true
          detectedLanguage
        );
        console.log(`Saved user message to database for conversation: ${conversations[sessionId].conversationId}`);
      } catch (saveMessageError) {
        console.error('Error saving user message to Supabase:', saveMessageError);
        // Continue even if message saving fails
      }
    }
    
    // Calculate if this is likely a new question
    const isQuestion = message.trim().endsWith('?') || 
                      message.toLowerCase().includes('should') ||
                      message.toLowerCase().includes('will') || 
                      message.toLowerCase().includes('can');
    
    // Increment question count if this appears to be a question
    if (isQuestion && conversations[sessionId].questionCount < 3) {
      conversations[sessionId].questionCount++;
      console.log(`Incremented question count to: ${conversations[sessionId].questionCount}`);
      
      // Update the question count in Supabase
      if (conversations[sessionId].conversationId) {
        try {
          await updateConversation(conversations[sessionId].conversationId, {
            questions_asked: conversations[sessionId].questionCount,
            language: detectedLanguage // Update detected language
          });
          console.log(`Updated question count in database to: ${conversations[sessionId].questionCount}`);
        } catch (dbError) {
          console.error('Error updating question count in Supabase:', dbError);
        }
      }
    }
    
    // Add instruction about current question number
    const questionCount = conversations[sessionId].questionCount;
    let countInstruction = '';
    
    if (questionCount === 1) {
      countInstruction = "This is their first question. End your response with a message in the SAME LANGUAGE as the user that means: 'You have asked 1 question. You may ask 2 more questions.'";
    } else if (questionCount === 2) {
      countInstruction = "This is their second question. End your response with a message in the SAME LANGUAGE as the user that means: 'You have asked 2 questions. You may ask 1 more question.'";
    } else if (questionCount >= 3) {
      countInstruction = "This is their third and final question. End your response with a message in the SAME LANGUAGE as the user that means: 'You have now asked all 3 questions. May Krishna's blessings be with you always.'";
    }
    
    // Enhance system message with question tracking
    const enhancedMessages = [
      ...conversations[sessionId].messages,
      { 
        role: "system", 
        content: `The user has asked ${questionCount} question(s) so far. ${countInstruction} Remember to provide a new Bhagavad Gita quote different from previous ones. IMPORTANT: Respond in the SAME LANGUAGE that the user is using.`
      }
    ];
    
    console.log(`Making OpenAI API call with ${enhancedMessages.length} messages`);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4", // or any other appropriate model
        messages: enhancedMessages,
        max_tokens: 500,
        temperature: 0.7,
      });
      
      const aiResponse = response.choices[0].message.content;
      console.log(`Received OpenAI response of length: ${aiResponse.length}`);
      
      // Add AI response to conversation history
      conversations[sessionId].messages.push({ role: "assistant", content: aiResponse });
      
      // Save the AI response to Supabase
      if (conversations[sessionId].conversationId) {
        try {
          await saveMessage(
            conversations[sessionId].conversationId,
            aiResponse,
            false, // isUser = false
            detectedLanguage
          );
          console.log(`Saved AI response to database for conversation: ${conversations[sessionId].conversationId}`);
          
          // Log completed question for analytics
          if (conversations[sessionId].userId && isQuestion) {
            await logEvent('question_answered', 
              conversations[sessionId].conversationId, 
              conversations[sessionId].userId,
              {
                question_number: questionCount,
                language: detectedLanguage
              }
            );
            console.log(`Logged question_answered event for user: ${conversations[sessionId].userId}`);
          }
        } catch (dbError) {
          console.error('Error saving AI response to Supabase:', dbError);
        }
      }
      
      // Limit conversation history to prevent token overflow
      if (conversations[sessionId].messages.length > 12) {
        // Keep system message and trim oldest messages
        conversations[sessionId].messages = [
          conversations[sessionId].messages[0],
          ...conversations[sessionId].messages.slice(-10)
        ];
        console.log(`Trimmed conversation history to ${conversations[sessionId].messages.length} messages`);
      }
      
      return res.json({ 
        message: aiResponse,
        questionCount: questionCount,
        conversationId: conversations[sessionId].conversationId || null
      });
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError.message);
      // Return a specific error for OpenAI API issues
      return res.status(503).json({ 
        error: 'Divine wisdom service temporarily unavailable',
        details: 'Could not connect to wisdom source',
        openaiError: openaiError.message
      });
    }
  } catch (error) {
    console.error('Server Error in /api/chat:', error);
    return res.status(500).json({ 
      error: 'Failed to connect with divine wisdom',
      details: error.message 
    });
  }
});

// API endpoint to save user email
app.post('/api/register', async (req, res) => {
  try {
    const { email, name, sessionId } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Create or update user
    const user = await createOrUpdateUser(email, name);
    
    if (!user) {
      return res.status(500).json({ error: 'Failed to create user' });
    }
    
    // If a session ID is provided, link existing conversation to this user
    if (sessionId && conversations[sessionId]) {
      conversations[sessionId].userId = user.id;
      
      // If there's already a conversation in Supabase, update it
      if (conversations[sessionId].conversationId) {
        await updateConversation(conversations[sessionId].conversationId, {
          user_id: user.id
        });
      } else {
        // Create a new conversation
        const conversation = await createConversation(
          user.id, 
          sessionId, 
          conversations[sessionId].language || 'english'
        );
        
        if (conversation) {
          conversations[sessionId].conversationId = conversation.id;
        }
      }
      
      // Log event
      await logEvent('user_registration', 
        conversations[sessionId].conversationId, 
        user.id,
        { has_existing_conversation: true }
      );
    }
    
    return res.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error in registration:', error);
    return res.status(500).json({ 
      error: 'Failed to register user',
      details: error.message 
    });
  }
});

// Like message endpoint
app.post('/api/like', async (req, res) => {
  try {
    const { messageId, conversationId, messageContent } = req.body;
    const sessionId = req.headers['session-id'] || 'default-session';
    
    if (!messageId || !conversationId) {
      return res.status(400).json({ error: 'Message ID and Conversation ID are required' });
    }
    
    // Get user ID from active session if available
    const userId = conversations[sessionId]?.userId || null;
    
    // Like the message
    const success = await likeMessage(messageId, conversationId, userId);
    
    if (success) {
      // If we have user and conversation, log as an event
      if (userId && conversations[sessionId]?.conversationId) {
        await logEvent('message_liked', 
          conversationId, 
          userId,
          { 
            message_id: messageId,
            message_content: messageContent, // Include the message content
            like_source: 'chat' // Track where the like came from
          }
        );
      }
      
      return res.json({ success: true });
    } else {
      return res.status(500).json({ error: 'Failed to like message' });
    }
  } catch (error) {
    console.error('Error in like endpoint:', error);
    return res.status(500).json({ 
      error: 'Failed to process like',
      details: error.message 
    });
  }
});

// Get most liked messages
app.get('/api/popular-wisdom', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    
    // Get the most liked messages
    const popularMessages = await getMostLikedMessages(limit);
    
    return res.json({ 
      success: true,
      messages: popularMessages
    });
  } catch (error) {
    console.error('Error in popular wisdom endpoint:', error);
    return res.status(500).json({ 
      error: 'Failed to retrieve popular wisdom',
      details: error.message 
    });
  }
});

// Save chat for a user to view in profile
app.post('/api/save-chat', async (req, res) => {
  try {
    // Extract data from request
    const { sessionId, messages, conversationId, timestamp } = req.body;
    const authHeader = req.headers.authorization;
    
    // Verify authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }
    
    // Extract user ID from the session or token
    let userId = null;
    
    // Check if we have a user in the session
    if (conversations[sessionId]?.userId) {
      userId = conversations[sessionId].userId;
    } else {
      // Return error if no user is found
      return res.status(401).json({ error: 'Unauthorized - User not found' });
    }
    
    // If no conversationId is provided, try to get it from the session
    const chatConversationId = conversationId || conversations[sessionId]?.conversationId;
    
    if (!chatConversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }
    
    // Update the conversation to mark it as saved in user profile
    await updateConversation(chatConversationId, {
      is_saved: true,
      saved_at: timestamp || new Date().toISOString()
    });
    
    // Log the save event
    await logEvent('chat_saved', 
      chatConversationId, 
      userId,
      {
        message_count: messages?.length || 0,
        saved_at: timestamp || new Date().toISOString()
      }
    );
    
    return res.json({ 
      success: true,
      message: 'Chat saved successfully',
      savedAt: timestamp || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving chat:', error);
    return res.status(500).json({ 
      error: 'Failed to save chat',
      details: error.message 
    });
  }
});

// Get saved chats for user profile
app.get('/api/saved-chats', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Verify authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }
    
    // Extract user info from the session
    const sessionId = req.headers['session-id'];
    let userId = null;
    
    if (sessionId && conversations[sessionId]?.userId) {
      userId = conversations[sessionId].userId;
    } else {
      // If no valid session, try to get user ID from query parameters
      userId = req.query.userId;
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Fetch the saved chats for this user
    const savedChats = await getSavedChats(userId);
    
    // Format the response
    const formattedChats = savedChats.map(chat => ({
      id: chat.id,
      language: chat.language,
      createdAt: chat.created_at,
      savedAt: chat.saved_at,
      questionsAsked: chat.questions_asked || 0,
      lastQuestion: chat.lastUserQuestion?.message || '',
      lastResponse: chat.lastAIResponse?.message || ''
    }));
    
    return res.json({ 
      success: true,
      chats: formattedChats
    });
  } catch (error) {
    console.error('Error fetching saved chats:', error);
    return res.status(500).json({ 
      error: 'Failed to retrieve saved chats',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Divine Wisdom API is running' });
});

// Helper function to get local IP address
function getLocalIP() {
  const networkInterfaces = require('os').networkInterfaces();
  const interfaces = Object.values(networkInterfaces).flat();
  
  // Filter for IPv4 and non-internal addresses
  const ipAddress = interfaces.filter(details => {
    return details.family === 'IPv4' && !details.internal;
  });
  
  return ipAddress.length > 0 ? ipAddress[0].address : 'localhost';
}

// Start server
app.listen(PORT, HOST, () => {
  const localIP = getLocalIP();
  console.log(`✨ Divine Wisdom server running at:`);
  console.log(`   > Local:    http://localhost:${PORT}`);
  console.log(`   > Network:  http://${localIP}:${PORT}`);
  console.log(`   > For other devices on your WiFi network, use: http://${localIP}:${PORT}`);
}); 