require('dotenv').config();
const { supabase } = require('./supabase');

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    console.log(`URL: ${process.env.SUPABASE_URL}`);
    
    const { data, error } = await supabase.from('users').select('count');
    
    if (error) throw error;
    
    console.log('✅ Supabase connection successful!');
    console.log('Database response:', data);
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
  }
}

testConnection(); 