/**
 * Test script for user profiling in Supabase
 * This script tests the creation of a user, conversation and messages
 * with proper fallback to file-based storage if Supabase RLS policies block operations
 */
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { 
  createOrUpdateUser, 
  createConversation, 
  saveMessage, 
  updateConversation, 
  logEvent,
  getUserProfile
} = require('./supabase');

async function testUserProfiling() {
  console.log("Starting test of user profiling functionality...");
  
  try {
    // 1. Create a test user
    console.log("Creating test user...");
    const testUser = await createOrUpdateUser('test-user@example.com', 'Test User');
    if (!testUser || !testUser.id) {
      throw new Error("Failed to create test user");
    }
    console.log(`✅ Created/Retrieved user with ID: ${testUser.id}`);
    console.log(`✅ User profile created with name: ${testUser.profile.full_name}`);
    
    // 2. Create a test conversation
    console.log("\nCreating test conversation...");
    const sessionId = uuidv4();
    const testConversation = await createConversation(testUser.id, sessionId);
    if (!testConversation) {
      throw new Error("Failed to create test conversation");
    }
    console.log(`✅ Created conversation with ID: ${testConversation.id}`);
    
    // 3. Save some test messages
    console.log("\nSaving test messages...");
    const userMessage = "What is the purpose of life according to Krishna?";
    const userMessageObj = await saveMessage(testConversation.id, userMessage, true, 'english');
    if (!userMessageObj) {
      throw new Error("Failed to save user message");
    }
    console.log(`✅ Saved user message with ID: ${userMessageObj.id}`);
    
    // Mock AI response with a quote
    const aiResponse = "According to the Bhagavad Gita, Krishna says: \"For the soul there is neither birth nor death at any time. He has not come into being, does not come into being, and will not come into being. He is unborn, eternal, ever-existing, and primeval. He is not slain when the body is slain.\" This teaching emphasizes that our true purpose is self-realization and understanding our eternal nature.";
    const aiMessageObj = await saveMessage(testConversation.id, aiResponse, false, 'english');
    if (!aiMessageObj) {
      throw new Error("Failed to save AI message");
    }
    console.log(`✅ Saved AI message with ID: ${aiMessageObj.id}`);
    
    // 4. Update conversation metadata
    console.log("\nUpdating conversation metadata...");
    const updatedConversation = await updateConversation(testConversation.id, {
      questions_asked: 1
    });
    if (!updatedConversation) {
      throw new Error("Failed to update conversation");
    }
    console.log(`✅ Updated conversation metadata: ${updatedConversation.questions_asked} questions asked`);
    
    // 5. Log an analytics event
    console.log("\nLogging analytics event...");
    const eventLogged = await logEvent(
      'question_answered',
      testConversation.id,
      testUser.id,
      {
        question_number: 1,
        language: 'english'
      }
    );
    console.log(`✅ Event logged: ${eventLogged}`);
    
    // 6. Get user profile
    console.log("\nRetrieving user profile...");
    const userProfile = await getUserProfile(testUser.id);
    if (userProfile) {
      console.log(`✅ User profile retrieved: ${userProfile.user.email}`);
      console.log(`✅ Stats: ${userProfile.stats.conversations} conversations, ${userProfile.stats.messages} messages`);
    } else {
      console.log("ℹ️ User profile not available");
    }
    
    // Success!
    console.log("\n✅ All tests completed successfully!");
    console.log("Test results:");
    console.log("-------------");
    console.log(`User ID: ${testUser.id}`);
    console.log(`Conversation ID: ${testConversation.id}`);
    console.log(`User Message ID: ${userMessageObj.id}`);
    console.log(`AI Message ID: ${aiMessageObj.id}`);
    
    return {
      userId: testUser.id,
      conversationId: testConversation.id,
      messageIds: [userMessageObj.id, aiMessageObj.id]
    };
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Execute the test
testUserProfiling(); 