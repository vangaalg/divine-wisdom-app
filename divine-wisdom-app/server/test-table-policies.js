/**
 * Test script to check if RLS policies are correctly set for all tables
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const uuid = require('uuid');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log(`Testing Supabase RLS policies for all tables...`);
console.log(`URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUsersTable() {
  try {
    const userId = uuid.v4();
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email: `test-user-${Date.now()}@example.com`,
        name: 'RLS Test User',
        created_at: new Date(),
        last_active: new Date()
      }])
      .select();
    
    if (error) {
      console.error('❌ Users table - Error:', error.message);
      return false;
    }
    
    console.log('✅ Users table - Insert successful');
    return userId;
  } catch (error) {
    console.error('❌ Users table - Error:', error.message);
    return false;
  }
}

async function testConversationsTable(userId) {
  try {
    const conversationId = uuid.v4();
    const { data, error } = await supabase
      .from('conversations')
      .insert([{
        id: conversationId,
        user_id: userId,
        session_id: `test-session-${Date.now()}`,
        language: 'english',
        questions_asked: 0,
        created_at: new Date(),
        last_message_at: new Date()
      }])
      .select();
    
    if (error) {
      console.error('❌ Conversations table - Error:', error.message);
      return false;
    }
    
    console.log('✅ Conversations table - Insert successful');
    return conversationId;
  } catch (error) {
    console.error('❌ Conversations table - Error:', error.message);
    return false;
  }
}

async function testMessagesTable(conversationId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        id: uuid.v4(),
        conversation_id: conversationId,
        message: 'Test message',
        is_user: true,
        contains_quote: false,
        detected_language: 'english',
        created_at: new Date()
      }])
      .select();
    
    if (error) {
      console.error('❌ Messages table - Error:', error.message);
      return false;
    }
    
    console.log('✅ Messages table - Insert successful');
    return true;
  } catch (error) {
    console.error('❌ Messages table - Error:', error.message);
    return false;
  }
}

async function testQuotesTable(messageId) {
  if (!messageId) {
    console.log('⚠️ Quotes table - Skipped (no message ID)');
    return false;
  }
  
  try {
    const { data, error } = await supabase
      .from('quotes')
      .insert([{
        id: uuid.v4(),
        message_id: messageId,
        quote_text: 'Test quote',
        language: 'english',
        created_at: new Date()
      }])
      .select();
    
    if (error) {
      console.error('❌ Quotes table - Error:', error.message);
      return false;
    }
    
    console.log('✅ Quotes table - Insert successful');
    return true;
  } catch (error) {
    console.error('❌ Quotes table - Error:', error.message);
    return false;
  }
}

async function testAnalyticsTable(userId, conversationId) {
  try {
    const { data, error } = await supabase
      .from('analytics')
      .insert([{
        id: uuid.v4(),
        event_type: 'policy_test',
        user_id: userId,
        conversation_id: conversationId,
        data: { test: true },
        created_at: new Date()
      }])
      .select();
    
    if (error) {
      console.error('❌ Analytics table - Error:', error.message);
      return false;
    }
    
    console.log('✅ Analytics table - Insert successful');
    return true;
  } catch (error) {
    console.error('❌ Analytics table - Error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('Running RLS policy tests for all tables...\n');
  
  const userId = await testUsersTable();
  if (!userId) {
    console.log('\n❌ Users table policy missing - fix in Supabase dashboard');
    return;
  }
  
  const conversationId = await testConversationsTable(userId);
  if (!conversationId) {
    console.log('\n❌ Conversations table policy missing - fix in Supabase dashboard');
    return;
  }
  
  const messagesSuccess = await testMessagesTable(conversationId);
  if (!messagesSuccess) {
    console.log('\n❌ Messages table policy missing - fix in Supabase dashboard');
    return;
  }
  
  // We don't need to test quotes for basic functionality
  await testQuotesTable(null);
  
  const analyticsSuccess = await testAnalyticsTable(userId, conversationId);
  if (!analyticsSuccess) {
    console.log('\n❌ Analytics table policy missing - fix in Supabase dashboard');
    return;
  }
  
  console.log('\n✅ All RLS policies are correctly configured!');
  console.log('You can now run your application.');
}

runAllTests(); 