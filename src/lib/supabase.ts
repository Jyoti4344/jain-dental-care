
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use the provided environment variables
const supabaseUrl = 'https://oppyvmghrogfysswwayi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcHl2bWdocm9nZnlzc3d3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODM4NDgsImV4cCI6MjA2MDU1OTg0OH0.Mc5W8B2SfeGxc3ahsINdjSK2On-dvJKYimkwQIbuYos';

// Create and export the Supabase client with the credentials
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

// Add helper functions for authentication
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  console.log("Signing in with:", email);
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  console.log("Sign in result:", data, error);
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabaseClient.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabaseClient.auth.getUser();
  return { user: data.user, error };
};

export const getSession = async () => {
  const { data, error } = await supabaseClient.auth.getSession();
  return { session: data.session, error };
};

// Improved helper function for staff and admin roles with better debugging
export const checkStaffRole = async (userId: string) => {
  console.log("Checking staff role for userId:", userId);
  
  // First debug - check if the staff table exists and has records
  const { count: staffCount, error: countError } = await supabaseClient
    .from('staff')
    .select('*', { count: 'exact', head: true });
    
  console.log("Staff table count:", staffCount, "Error:", countError);
  
  // Now attempt to fetch the actual staff record
  const { data, error } = await supabaseClient
    .from('staff')
    .select('*')
    .eq('auth_id', userId);
  
  console.log("Staff query result:", data, "Error:", error);
  
  if (error || !data || data.length === 0) {
    console.error("No staff record found for user:", userId);
    return { role: null, error: error || new Error("Staff record not found") };
  }
  
  return { role: data[0].role, error: null, staffRecord: data[0] };
};
