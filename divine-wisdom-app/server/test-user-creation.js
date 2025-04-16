require('dotenv').config();
const { supabase, createOrUpdateUser } = require('./supabase');

async function testUserCreation() {
    try {
        console.log('Testing user creation...');
        
        // Test creating a new user
        const testEmail = `test${Date.now()}@example.com`;
        const testName = 'Test User';
        
        console.log(`Attempting to create user with email: ${testEmail}`);
        const newUser = await createOrUpdateUser(testEmail, testName);
        
        if (newUser) {
            console.log('✅ User created successfully:', newUser);
            
            // Verify the user exists in the database
            const { data: verifyUser, error: verifyError } = await supabase
                .from('users')
                .select('*')
                .eq('id', newUser.id)
                .single();
                
            if (verifyError) {
                console.error('❌ Error verifying user:', verifyError);
            } else {
                console.log('✅ User verified in database:', verifyUser);
            }
        } else {
            console.error('❌ Failed to create user');
        }
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testUserCreation(); 