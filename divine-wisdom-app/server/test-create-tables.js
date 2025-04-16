/**
 * Run CREATE TABLE SQL statements directly against the Supabase database
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log(`Connecting to Supabase at: ${supabaseUrl}`);
console.log(`Using anon key: ${supabaseKey?.substring(0, 10)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

// Load the SQL file
const sqlFilePath = path.join(__dirname, 'create-supabase-tables.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Split SQL into individual statements
const sqlStatements = sqlContent
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0);

console.log(`Found ${sqlStatements.length} SQL statements to execute`);

// Let's print the first SQL statement to see what we'll execute
if (sqlStatements.length > 0) {
  console.log("\nFirst statement (sample):");
  console.log(sqlStatements[0].substring(0, 300) + "...");
}

console.log("\n⚠️ Note: If your database doesn't support executing raw SQL via the REST API,");
console.log("you'll need to run the SQL script directly against your database using the Supabase dashboard.");
console.log("Go to https://app.supabase.com/ > Your Project > SQL Editor\n");

async function executeSQL() {
  try {
    // Instead of executing SQL (which may not work via REST API),
    // let's check each table and provide manual guidance
    console.log("Checking tables in the database...");
    
    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError && usersError.code === '42P01') {
      console.log("❌ Users table doesn't exist");
    } else {
      console.log("✅ Users table exists");
      
      // If we can select from the table but get a schema cache error,
      // the table exists but doesn't have the expected columns
      if (usersError && usersError.message.includes('schema cache')) {
        console.log("   ⚠️ but the schema is different from what's expected");
      }
    }
    
    // Check conversations table
    const { data: convs, error: convsError } = await supabase
      .from('conversations')
      .select('*')
      .limit(1);
    
    if (convsError && convsError.code === '42P01') {
      console.log("❌ Conversations table doesn't exist");
    } else {
      console.log("✅ Conversations table exists");
      
      if (convsError && convsError.message.includes('schema cache')) {
        console.log("   ⚠️ but the schema is different from what's expected");
      }
    }
    
    // Check messages table
    const { data: msgs, error: msgsError } = await supabase
      .from('messages')
      .select('*')
      .limit(1);
    
    if (msgsError && msgsError.code === '42P01') {
      console.log("❌ Messages table doesn't exist");
    } else {
      console.log("✅ Messages table exists");
      
      if (msgsError && msgsError.message.includes('schema cache')) {
        console.log("   ⚠️ but the schema is different from what's expected");
      }
    }
    
    console.log("\n📋 Next steps:");
    console.log("1. Go to the Supabase dashboard: https://app.supabase.com/");
    console.log("2. Select your project");
    console.log("3. Click 'SQL Editor' in the sidebar");
    console.log("4. Paste and run the contents of create-supabase-tables.sql");
    console.log("5. After creating all tables with the correct schema, run your application again");
    
  } catch (error) {
    console.error("Error executing SQL:", error);
  }
}

// Execute SQL
executeSQL(); 