/**
 * Simplified test script for Supabase connection
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const uuid = require('uuid');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log(`Testing Supabase connection with URL: ${supabaseUrl}`);
console.log(`Using anon key: ${supabaseKey?.substring(0, 10)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

// First, let's check the schema to see what columns actually exist
async function checkSchema() {
  try {
    console.log("Checking tables in the database...");
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error("Error fetching tables:", tablesError);
      return;
    }
    
    console.log("Available tables:", tables?.map(t => t.table_name) || []);
    
    // Try to get column info for users table
    if (tables?.some(t => t.table_name === 'users')) {
      console.log("Found users table, checking columns...");
      
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'users')
        .eq('table_schema', 'public');
      
      if (columnsError) {
        console.error("Error fetching columns:", columnsError);
        return;
      }
      
      console.log("Users table columns:", columns);
      return columns;
    } else {
      console.log("Users table not found!");
    }
  } catch (error) {
    console.error("Error checking schema:", error);
  }
}

async function testSimpleInsert() {
  try {
    // Try to insert a user with just the minimum required fields
    const testId = uuid.v4();
    const testEmail = `test-${Date.now()}@example.com`;
    
    console.log(`Attempting simple insert with ID: ${testId} and email: ${testEmail}`);
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          id: testId,
          email: testEmail, 
          name: 'Test User'
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

// First check the schema, then try a simple insert
async function runTests() {
  await checkSchema();
  const insertResult = await testSimpleInsert();
  
  if (insertResult) {
    console.log('✅ Database connection and insert are working!');
  } else {
    console.log('❌ There are still issues with the database connection or permissions.');
  }
}

runTests(); 