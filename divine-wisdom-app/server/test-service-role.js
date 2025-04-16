/**
 * Test script for using Supabase service role to bypass RLS
 * This requires the SUPABASE_SERVICE_ROLE_KEY to be set in your .env file
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const uuid = require('uuid');

// Initialize Supabase client with service role if available
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if service role key is available
if (!supabaseServiceKey) {
  console.log('⚠️ No SUPABASE_SERVICE_ROLE_KEY found in .env file');
  console.log('You can find this key in your Supabase dashboard under Project Settings > API');
  console.log('Add it to your .env file as: SUPABASE_SERVICE_ROLE_KEY=your-key-here');
  console.log('\nTrying with anon key instead...');
}

const supabase = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function testServiceRole() {
  try {
    console.log(`Testing with ${supabaseServiceKey ? 'SERVICE ROLE KEY' : 'ANON KEY'}`);
    
    // Try to insert a user
    const testId = uuid.v4();
    const testEmail = `test-${Date.now()}@example.com`;
    
    console.log(`Attempting to insert user with ID: ${testId} and email: ${testEmail}`);
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          id: testId,
          email: testEmail, 
          name: 'Service Role Test User',
          created_at: new Date(),
          last_active: new Date()
        }
      ])
      .select();
    
    if (error) {
      console.error('Error inserting user:', error);
      return false;
    }
    
    console.log('✅ Successfully inserted user:', data);
    return true;
  } catch (error) {
    console.error('Exception during service role test:', error);
    return false;
  }
}

// Run the test
testServiceRole().then(success => {
  if (success) {
    if (supabaseServiceKey) {
      console.log('✅ Service role key is working correctly and bypassing RLS!');
    } else {
      console.log('✅ Somehow the anon key is working! RLS policies might be configured correctly.');
    }
  } else {
    if (supabaseServiceKey) {
      console.log('❌ Service role key is not working properly.');
    } else {
      console.log('❌ RLS policies need to be configured in Supabase dashboard.');
      console.log('   or you need to add a SUPABASE_SERVICE_ROLE_KEY to your .env file.');
    }
  }
}); 