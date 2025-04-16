require('dotenv').config();
const { supabase, pool } = require('./supabase');

async function testConnections() {
  try {
    console.log('Testing Supabase connection...');
    const { data: supabaseData, error: supabaseError } = await supabase.from('users').select('count');
    if (supabaseError) throw supabaseError;
    console.log('✅ Supabase connection successful!');
    console.log('Supabase response:', supabaseData);

    console.log('\nTesting PostgreSQL connection...');
    const { rows: pgRows } = await pool.query('SELECT COUNT(*) FROM users');
    console.log('✅ PostgreSQL connection successful!');
    console.log('PostgreSQL response:', pgRows);
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
  } finally {
    // Close the pool
    await pool.end();
  }
}

testConnections(); 