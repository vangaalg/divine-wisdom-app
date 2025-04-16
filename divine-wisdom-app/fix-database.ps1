# Fix Database Schema Script for Divine Wisdom App

Write-Host "Divine Wisdom Database Fix Utility" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""

# Check for environment variables
$supabaseUrl = $env:SUPABASE_URL
$supabaseKey = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "Error: Missing environment variables." -ForegroundColor Red
    Write-Host "Please make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set." -ForegroundColor Red
    
    # Prompt for values
    $supabaseUrl = Read-Host "Enter your Supabase URL"
    $supabaseKey = Read-Host "Enter your Supabase service role key"
    
    if (-not $supabaseUrl -or -not $supabaseKey) {
        Write-Host "Aborting: Required values not provided." -ForegroundColor Red
        exit 1
    }
    
    # Set environment variables
    $env:SUPABASE_URL = $supabaseUrl
    $env:SUPABASE_SERVICE_ROLE_KEY = $supabaseKey
}

Write-Host "Supabase configuration found. Proceeding with database fixes..." -ForegroundColor Green

# Navigate to server directory
if (Test-Path "server") {
    Set-Location -Path "server"
} else {
    Write-Host "Error: Server directory not found." -ForegroundColor Red
    exit 1
}

# Check for SQL file
if (-not (Test-Path "create-supabase-tables.sql")) {
    Write-Host "Error: SQL schema file not found." -ForegroundColor Red
    exit 1
}

Write-Host "Found SQL schema file. Applying database fixes..." -ForegroundColor Yellow

# Install required Node packages
Write-Host "Installing necessary Node packages..." -ForegroundColor Yellow
npm install dotenv @supabase/supabase-js pg

# Create and run a temporary JavaScript file to apply the SQL fixes
$tempJsFile = "fix-database-temp.js"

$jsContent = @"
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function fixDatabase() {
  console.log('Starting database schema fix...');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials');
    process.exit(1);
  }
  
  // Initialize Supabase admin client with service role key
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create-supabase-tables.sql');
    const sqlCommands = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Executing SQL commands...');
    
    // Execute SQL commands
    const { error } = await supabase.rpc('exec_sql', { sql_query: sqlCommands });
    
    if (error) {
      console.error('Error executing SQL:', error);
      
      // Try alternative approach with individual statements
      console.log('Trying alternative approach with individual statements...');
      
      // Split SQL into individual statements
      const statements = sqlCommands.split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      for (const statement of statements) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
          if (error) {
            console.warn(`Warning: Statement failed: ${statement.substring(0, 50)}...`);
            console.warn(error);
          } else {
            console.log(`Successfully executed: ${statement.substring(0, 50)}...`);
          }
        } catch (stmtError) {
          console.warn(`Error executing statement: ${statement.substring(0, 50)}...`);
          console.warn(stmtError);
        }
      }
    } else {
      console.log('SQL commands executed successfully!');
    }
    
    console.log('Database schema fix completed.');
  } catch (error) {
    console.error('Failed to fix database schema:', error);
    process.exit(1);
  }
}

fixDatabase().catch(console.error);
"@

Set-Content -Path $tempJsFile -Value $jsContent

# Run the script
Write-Host "Executing database fix script..." -ForegroundColor Yellow
node $tempJsFile

# Clean up
Remove-Item -Path $tempJsFile -Force
Write-Host ""
Write-Host "Database fix process completed." -ForegroundColor Green
Write-Host "You can now restart your application." -ForegroundColor Green

# Return to original directory
Set-Location -Path ".." 