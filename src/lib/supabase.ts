
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// For Vite, we need to use import.meta.env to access environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use empty strings as fallback values if environment variables are not defined
const url = supabaseUrl || '';
const key = supabaseKey || '';

// Validate that we have the required values before creating the client
if (!url || !key) {
  console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

// Create a dummy client or actual client based on credentials availability
export const supabaseClient = url && key 
  ? createClient<Database>(url, key)
  : {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({
              data: [],
              error: new Error('Supabase not configured'),
            }),
          }),
          order: () => ({
            data: [],
            error: new Error('Supabase not configured'),
          }),
        }),
        insert: () => ({ 
          data: null, 
          error: new Error('Supabase not configured') 
        }),
        update: () => ({ 
          data: null, 
          error: new Error('Supabase not configured') 
        }),
        delete: () => ({ 
          data: null, 
          error: new Error('Supabase not configured') 
        }),
      }),
      auth: {
        getSession: async () => ({ 
          data: { session: null }, 
          error: null 
        }),
      },
    } as unknown as ReturnType<typeof createClient<Database>>;
