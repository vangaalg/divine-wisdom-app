import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://yedlhabnrjnesgbvebda.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZGxoYWJucmpuZXNnYnZlYmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjQ3NTMsImV4cCI6MjA1OTg0MDc1M30.NjKMShTURa2xAoMqJua9mpa27dH_BkQ3RrArf4f5A9U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helper functions
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email, password, name) => {
  // First, sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) return { data, error };

  // Create user profile in the users table (matches server schema)
  if (data?.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email: email,
          name: name,
          created_at: new Date()
        }
      ]);

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      return { data, error: profileError };
    }
  }

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
}; 