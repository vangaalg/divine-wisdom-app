/**
 * Very basic test script to just check database connection
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log(`Testing Supabase connection with URL: ${supabaseUrl}`);
console.log(`Using anon key: ${supabaseKey?.substring(0, 10)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  try {
    console.log("Listing available tables with a simple query...");
    
    // Try a basic query to see what tables exist
    const { data, error } = await supabase
      .rpc('list_tables');
      
    if (error) {
      console.error("Error listing tables:", error);
      
      // Try an alternative approach - just query one table we know should exist
      console.log("\nTrying to access 'users' table directly...");
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (usersError) {
        console.error("Error accessing users table:", usersError);
        
        if (usersError.message.includes("column") || usersError.message.includes("schema cache")) {
          console.log("\n⚠️ The users table exists but with a different schema than expected.");
          console.log("You need to create the tables with the correct columns.");
          console.log("Try running create-supabase-tables.sql on your database or run:");
          console.log("node init-supabase.js");
        } else if (usersError.code === '42P01') {
          console.log("\n⚠️ The users table does not exist.");
          console.log("You need to create the database tables first.");
          console.log("Try running create-supabase-tables.sql on your database or run:");
          console.log("node init-supabase.js");
        } else {
          console.log("\n⚠️ There might be an access/permissions issue.");
        }
        
        return false;
      }
      
      console.log("✅ Successfully connected to users table!");
      console.log("Table data sample:", usersData);
      return true;
    }
    
    console.log("Available tables:", data);
    return true;
  } catch (error) {
    console.error("Exception while checking tables:", error);
    return false;
  }
}

// Run the test
listTables().then(success => {
  if (success) {
    console.log("\n✅ Successfully connected to the database!");
  } else {
    console.log("\n❌ There are issues with the database connection or tables.");
    console.log("Make sure your database has been properly set up with the required tables.");
    console.log("You may need to run init-supabase.js to create the necessary database schema.");
  }
}); 