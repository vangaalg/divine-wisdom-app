require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.');
  process.exit(1);
}

// Create Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('Setting up Supabase Storage...');
    
    // Create profile-images bucket if it doesn't exist
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      throw bucketsError;
    }
    
    const profileBucketExists = buckets.some(bucket => bucket.name === 'profile-images');
    
    if (!profileBucketExists) {
      console.log('Creating profile-images bucket...');
      
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('profile-images', {
          public: false,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });
        
      if (createBucketError) {
        throw createBucketError;
      }
      
      console.log('✅ Created profile-images bucket');
    } else {
      console.log('✅ profile-images bucket already exists');
    }
    
    // Set RLS policies for profile-images bucket
    console.log('Setting up storage policies...');
    
    // Policy to allow users to read their own profile images
    const { error: readPolicyError } = await supabase
      .storage
      .from('profile-images')
      .createSignedUrl('test.txt', 10); // This fails if we don't have permissions, but that's ok
      
    if (!readPolicyError || readPolicyError.message !== "The resource could not be found") {
      console.log('Storage policies already set up or could not verify permissions');
    } else {
      // Create SQL to set up RLS policies - using the Supabase dashboard is more reliable for this
      console.log(`
To set up proper RLS policies, please run the following SQL in your Supabase SQL editor:

-- Allow users to read any profile image
CREATE POLICY "Profile images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-images');

-- Allow users to upload their own profile image
CREATE POLICY "Users can upload their own profile image" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'profile-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own profile image
CREATE POLICY "Users can update their own profile image" 
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own profile image
CREATE POLICY "Users can delete their own profile image" 
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
      `);
    }

    console.log('✅ Supabase Storage setup complete');
  } catch (error) {
    console.error('❌ Error setting up Supabase Storage:', error);
  }
}

setupStorage().catch(console.error); 