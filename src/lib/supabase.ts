
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

// Default admin credentials for development
export const DEFAULT_ADMIN_EMAIL = "admin@tulipdental.com";
export const DEFAULT_ADMIN_PASSWORD = "Tulip@123";

// Improved helper function for staff and admin roles with enhanced debugging
export const checkStaffRole = async (userId: string) => {
  console.log("Checking staff role for userId:", userId);
  
  try {
    // First check if the user is our default development admin
    const { data: user } = await supabaseClient.auth.getUser();
    console.log("Current user email:", user?.user?.email);
    
    if (user?.user?.email === DEFAULT_ADMIN_EMAIL && userId === user?.user?.id) {
      console.log("Using default admin account");
      return { 
        role: "admin", 
        error: null, 
        staffRecord: { 
          id: "default-admin",
          first_name: "Default", 
          last_name: "Admin",
          role: "admin" 
        } 
      };
    }
    
    // Debug - check if the staff table exists and has records
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
    
    if (error) {
      console.error("Database error while checking staff:", error);
      return { role: null, error, staffRecord: null };
    }
    
    if (!data || data.length === 0) {
      console.error("No staff record found for user:", userId);
      return { role: null, error: new Error("Staff record not found"), staffRecord: null };
    }
    
    return { role: data[0].role, error: null, staffRecord: data[0] };
  } catch (err) {
    console.error("Unexpected error in checkStaffRole:", err);
    return { role: null, error: err as Error, staffRecord: null };
  }
};

// Helper function to add default admin if needed
export const createDefaultAdminIfNeeded = async () => {
  try {
    // Check if default admin user already exists in auth
    // Using a more compatible approach to search for users by email
    console.log("Checking for default admin account");
    
    // Try a direct sign-in with default credentials to check if account exists
    const { data: signInData, error: signInError } = await signIn(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
    
    if (!signInError && signInData?.user?.id) {
      console.log("Default admin account exists and credentials are valid");
      let authId = signInData.user.id;
      
      // Check if admin already exists in staff table
      const { data: existingStaff } = await supabaseClient
        .from('staff')
        .select('*')
        .eq('auth_id', authId);
        
      if (existingStaff && existingStaff.length > 0) {
        console.log("Default admin already exists in staff table");
        return { success: true, message: "Default admin already exists", user: signInData.user };
      }
      
      // Create admin in staff table
      const { data: newStaff, error: staffError } = await supabaseClient
        .from('staff')
        .insert({
          auth_id: authId,
          first_name: "Default",
          last_name: "Admin",
          email: DEFAULT_ADMIN_EMAIL,
          role: "admin",
          phone: "123-456-7890"
        });
        
      if (staffError) {
        console.error("Error creating default admin in staff table:", staffError);
        return { success: false, error: staffError };
      }
      
      console.log("Default admin created successfully in staff table");
      return { success: true, message: "Default admin updated successfully", user: signInData.user };
    } else {
      console.log("Default admin account doesn't exist or credentials are invalid, creating new account");
    }
    
    // If we get here, we need to create a new account
    const { data: signUpData, error: signUpError } = await signUp(
      DEFAULT_ADMIN_EMAIL, 
      DEFAULT_ADMIN_PASSWORD
    );
    
    if (signUpError) {
      console.error("Error creating default admin user:", signUpError);
      return { success: false, error: signUpError };
    }
    
    const authId = signUpData.user?.id;
    
    if (!authId) {
      console.error("Failed to get auth ID for default admin");
      return { success: false, error: new Error("Failed to get auth ID") };
    }
    
    // Create admin in staff table
    const { data: newStaff, error: staffError } = await supabaseClient
      .from('staff')
      .insert({
        auth_id: authId,
        first_name: "Default",
        last_name: "Admin",
        email: DEFAULT_ADMIN_EMAIL,
        role: "admin",
        phone: "123-456-7890"
      });
      
    if (staffError) {
      console.error("Error creating default admin in staff table:", staffError);
      return { success: false, error: staffError };
    }
    
    console.log("Default admin created successfully");
    return { success: true, message: "Default admin created successfully", user: signUpData.user };
  } catch (err) {
    console.error("Unexpected error creating default admin:", err);
    return { success: false, error: err };
  }
};
