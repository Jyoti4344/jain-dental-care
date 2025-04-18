
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// The URL and key are automatically injected by the Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);
