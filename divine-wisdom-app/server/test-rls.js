/**
 * Test script for Supabase RLS policies
 * Tests direct insert into users table
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const uuid = require('uuid');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log(`Testing Supabase connection with URL: ${supabaseUrl}`);
console.log(`First few characters of key: ${supabaseKey?.substring(0, 5)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  try {
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
          name: 'RLS Test User',
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
    console.error('Exception during insert test:', error);
    return false;
  }
}

// Run the test
testInsert().then(success => {
  if (success) {
    console.log('✅ RLS policies are correctly configured!');
  } else {
    console.log('❌ RLS policies need to be configured in Supabase dashboard.');
  }
}); 