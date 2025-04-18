
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// For Vite, we need to use import.meta.env to access environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the environment variables are defined, otherwise use fallback for development
const url = supabaseUrl || process.env.VITE_SUPABASE_URL || '';
const key = supabaseKey || process.env.VITE_SUPABASE_ANON_KEY || '';

// Validate that we have the required values before creating the client
if (!url || !key) {
  console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

export const supabaseClient = createClient<Database>(
  url,
  key
);
