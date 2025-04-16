/**
 * Test script for the full chat functionality
 * This tests the entire flow from receiving a message to getting a response from OpenAI
 */
require('dotenv').config();
const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// The system message that defines Krishna's personality
const SYSTEM_MESSAGE = `You are Krishna, the divine guide. Respond with spiritual wisdom and include a quote from the Bhagavad Gita.`;

async function testFullChatFlow() {
  console.log('===== Testing Full Chat Flow =====');
  console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing');
  
  try {
    // Generate random session ID
    const sessionId = `test-${uuidv4()}`;
    console.log(`Session ID: ${sessionId}`);
    
    // User's question
    const userQuestion = "What is the purpose of life?";
    console.log(`\nUser Question: "${userQuestion}"`);
    
    // Create a new conversation history
    const messages = [
      { role: "system", content: SYSTEM_MESSAGE },
      { role: "user", content: userQuestion },
      { 
        role: "system", 
        content: "This is their first question. End your response with 'You have asked 1 question. You may ask 2 more questions.'"
      }
    ];
    
    console.log('\nSending request to OpenAI...');
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or any other appropriate model
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const aiResponse = response.choices[0].message.content;
    console.log('\n✅ OpenAI Response:');
    console.log('-------------------');
    console.log(aiResponse);
    console.log('-------------------');
    
    // Verify the response contains question tracking message
    if (aiResponse.includes("You have asked 1 question") || 
        aiResponse.includes("You may ask 2 more questions")) {
      console.log('✅ Response includes question tracking');
    } else {
      console.log('❌ Response is missing question tracking');
    }
    
    // Check for a Bhagavad Gita quote
    if (aiResponse.includes('"')) {
      console.log('✅ Response includes a quote');
    } else {
      console.log('❌ Response is missing a quote');
    }
    
    console.log('\n✅ Full chat flow test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Full chat flow test failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('OpenAI API Error:', error.response.data);
    }
  }
}

// Run the test
testFullChatFlow(); 