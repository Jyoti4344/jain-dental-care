
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

// Helper function to add default admin if needed - completely rewritten to be more robust
export const createDefaultAdminIfNeeded = async () => {
  console.log("Starting default admin creation process");
  
  try {
    // STEP 1: First create the default admin in auth if they don't exist
    console.log("Step 1: Creating auth user for default admin");
    const { data: signUpData, error: signUpError } = await signUp(
      DEFAULT_ADMIN_EMAIL, 
      DEFAULT_ADMIN_PASSWORD
    );
    
    let authId = signUpData?.user?.id;
    
    // If user already exists, try signing in instead
    if (signUpError && signUpError.message.includes('already registered')) {
      console.log("Admin already exists in auth, trying to sign in");
      const { data: signInData, error: signInError } = await signIn(
        DEFAULT_ADMIN_EMAIL,
        DEFAULT_ADMIN_PASSWORD
      );
      
      if (signInError) {
        console.error("Error signing in with default admin:", signInError);
        return { success: false, error: signInError, message: "Failed to sign in with default admin" };
      }
      
      authId = signInData?.user?.id;
    } else if (signUpError) {
      console.error("Error creating default admin in auth:", signUpError);
      return { success: false, error: signUpError, message: "Failed to create default admin user" };
    }
    
    if (!authId) {
      console.error("No auth ID obtained for default admin");
      return { success: false, error: new Error("Failed to get auth ID"), message: "Auth ID not found" };
    }
    
    console.log("Default admin auth ID:", authId);
    
    // STEP 2: Now check if admin record exists in staff table and create if needed
    console.log("Step 2: Checking for staff record for admin");
    const { data: existingStaff, error: staffQueryError } = await supabaseClient
      .from('staff')
      .select('*')
      .eq('auth_id', authId)
      .maybeSingle();
    
    if (staffQueryError) {
      console.error("Error checking for existing staff:", staffQueryError);
    }
    
    if (existingStaff) {
      console.log("Default admin already exists in staff table:", existingStaff);
      return { 
        success: true, 
        message: "Default admin already exists", 
        user: { id: authId, email: DEFAULT_ADMIN_EMAIL } 
      };
    }
    
    // STEP 3: Create staff record for the admin
    console.log("Step 3: Creating staff record for admin");
    const { data: staffInsertResult, error: staffInsertError } = await supabaseClient
      .from('staff')
      .insert({
        auth_id: authId,
        first_name: "Default",
        last_name: "Admin",
        email: DEFAULT_ADMIN_EMAIL,
        role: "admin",
        phone: "123-456-7890"
      });
      
    if (staffInsertError) {
      console.error("Error creating staff record for admin:", staffInsertError);
      return { 
        success: false, 
        error: staffInsertError, 
        message: "Failed to create staff record for admin"
      };
    }
    
    console.log("Default admin successfully created with staff record");
    return { 
      success: true, 
      message: "Default admin created successfully", 
      user: { id: authId, email: DEFAULT_ADMIN_EMAIL }
    };
  } catch (err) {
    console.error("Unexpected error in createDefaultAdminIfNeeded:", err);
    return { 
      success: false, 
      error: err, 
      message: "Unexpected error creating default admin"
    };
  }
};

// New helper function to ensure services table has default services
export const ensureDefaultServices = async () => {
  console.log("Starting default services creation process");
  
  try {
    // First check if any services exist
    const { data: existingServices, error: checkError } = await supabaseClient
      .from('services')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error("Error checking for existing services:", checkError);
      return { success: false, error: checkError };
    }
    
    if (existingServices && existingServices.length > 0) {
      console.log("Services already exist, no need to create defaults");
      return { success: true, message: "Services already exist" };
    }
    
    console.log("No services found, creating defaults");
    
    const defaultServices = [
      { 
        name: "Regular Checkup", 
        description: "Comprehensive dental examination and consultation", 
        duration: 30, 
        price: 50 
      },
      { 
        name: "Teeth Cleaning", 
        description: "Professional dental cleaning and polishing", 
        duration: 60, 
        price: 80 
      },
      { 
        name: "Root Canal", 
        description: "Treatment for infected tooth pulp", 
        duration: 90, 
        price: 200 
      },
      { 
        name: "Tooth Extraction", 
        description: "Safe removal of damaged or problematic teeth", 
        duration: 45, 
        price: 150 
      }
    ];
    
    const { data: insertResult, error: insertError } = await supabaseClient
      .from('services')
      .insert(defaultServices);
      
    if (insertError) {
      console.error("Error inserting default services:", insertError);
      return { success: false, error: insertError };
    }
    
    console.log("Default services created successfully");
    return { success: true, message: "Default services created successfully" };
    
  } catch (err) {
    console.error("Unexpected error in ensureDefaultServices:", err);
    return { success: false, error: err };
  }
};
