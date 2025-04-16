/**
 * Supabase initialization script for Divine Wisdom App
 * 
 * This script creates the necessary tables in Supabase
 * for storing users, conversations, messages, and analytics.
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('Starting Supabase initialization...');
  
  try {
    // Check if users table exists
    const { data: userCheck, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (userCheckError && userCheckError.code === '42P01') {
      console.log('Creating users table...');
      // Create users table
      const { error: createUsersError } = await supabase.rpc('create_users_table');
      if (createUsersError) throw createUsersError;
      console.log('✅ Users table created');
    } else {
      console.log('✅ Users table already exists');
    }
    
    // Check if conversations table exists
    const { data: convCheck, error: convCheckError } = await supabase
      .from('conversations')
      .select('id')
      .limit(1);
    
    if (convCheckError && convCheckError.code === '42P01') {
      console.log('Creating conversations table...');
      // Create conversations table
      const { error: createConvsError } = await supabase.rpc('create_conversations_table');
      if (createConvsError) throw createConvsError;
      console.log('✅ Conversations table created');
    } else {
      console.log('✅ Conversations table already exists');
    }
    
    // Check if messages table exists
    const { data: msgCheck, error: msgCheckError } = await supabase
      .from('messages')
      .select('id')
      .limit(1);
    
    if (msgCheckError && msgCheckError.code === '42P01') {
      console.log('Creating messages table...');
      // Create messages table
      const { error: createMsgsError } = await supabase.rpc('create_messages_table');
      if (createMsgsError) throw createMsgsError;
      console.log('✅ Messages table created');
    } else {
      console.log('✅ Messages table already exists');
    }
    
    // Check if quotes table exists
    const { data: quoteCheck, error: quoteCheckError } = await supabase
      .from('quotes')
      .select('id')
      .limit(1);
    
    if (quoteCheckError && quoteCheckError.code === '42P01') {
      console.log('Creating quotes table...');
      // Create quotes table
      const { error: createQuotesError } = await supabase.rpc('create_quotes_table');
      if (createQuotesError) throw createQuotesError;
      console.log('✅ Quotes table created');
    } else {
      console.log('✅ Quotes table already exists');
    }
    
    // Check if analytics table exists
    const { data: analyticsCheck, error: analyticsCheckError } = await supabase
      .from('analytics')
      .select('id')
      .limit(1);
    
    if (analyticsCheckError && analyticsCheckError.code === '42P01') {
      console.log('Creating analytics table...');
      // Create analytics table
      const { error: createAnalyticsError } = await supabase.rpc('create_analytics_table');
      if (createAnalyticsError) throw createAnalyticsError;
      console.log('✅ Analytics table created');
    } else {
      console.log('✅ Analytics table already exists');
    }
    
    console.log('✅ Supabase initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing Supabase:', error);
  }
}

// Run the initialization
createTables().catch(console.error); 