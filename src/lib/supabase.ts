import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use the provided environment variables
const supabaseUrl = 'https://oppyvmghrogfysswwayi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcHl2bWdocm9nZnlzc3d3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODM4NDgsImV4cCI6MjA2MDU1OTg0OH0.Mc5W8B2SfeGxc3ahsINdjSK2On-dvJKYimkwQIbuYos';

// Create and export the Supabase client with the credentials
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

// Default admin credentials for development
export const DEFAULT_ADMIN_EMAIL = "admin@tulipdental.com";
export const DEFAULT_ADMIN_PASSWORD = "Tulip@123";

// Local Storage keys
const SERVICES_KEY = 'tulip_dental_services';
const ADMIN_KEY = 'tulip_dental_admin';
const PATIENTS_KEY = 'tulip_dental_patients';
const APPOINTMENTS_KEY = 'tulip_dental_appointments';
const AUTH_SESSION_KEY = 'tulip_dental_auth_session';

// Add helper functions for authentication using localStorage
export const signUp = async (email: string, password: string) => {
  try {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('tulip_dental_users') || '[]');
    if (users.some((user: any) => user.email === email)) {
      return { 
        data: null, 
        error: { message: 'User already registered' } 
      };
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password, // In a real app, this should be hashed
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('tulip_dental_users', JSON.stringify(users));
    
    return { 
      data: { 
        user: { 
          id: newUser.id, 
          email: newUser.email 
        } 
      }, 
      error: null 
    };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  console.log("Signing in with:", email);
  try {
    const users = JSON.parse(localStorage.getItem('tulip_dental_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      console.log("No user found with credentials");
      return { 
        data: null, 
        error: { message: 'Invalid login credentials' } 
      };
    }
    
    // Create a session
    const session = {
      user: {
        id: user.id,
        email: user.email,
      },
      access_token: `fake_token_${Date.now()}`
    };
    
    // Store the session
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    
    console.log("Sign in successful:", session);
    return { data: session, error: null };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return { error: null };
  } catch (error: any) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || 'null');
    return { user: session?.user || null, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
};

export const getSession = async () => {
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || 'null');
    return { session, error: null };
  } catch (error: any) {
    return { session: null, error };
  }
};

// Improved helper function for staff and admin roles with localStorage
export const checkStaffRole = async (userId: string) => {
  console.log("Checking staff role for userId:", userId);
  
  try {
    // Check if this is the default admin
    const { data: user } = await getCurrentUser();
    console.log("Current user:", user);
    
    if (user?.email === DEFAULT_ADMIN_EMAIL) {
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
    
    // Otherwise check staff records in localStorage
    const allStaff = JSON.parse(localStorage.getItem('tulip_dental_staff') || '[]');
    const staffMember = allStaff.find((staff: any) => staff.auth_id === userId);
    
    console.log("Staff check result:", staffMember);
    
    if (!staffMember) {
      return { 
        role: null, 
        error: new Error("Staff record not found"), 
        staffRecord: null 
      };
    }
    
    return { 
      role: staffMember.role, 
      error: null, 
      staffRecord: staffMember 
    };
  } catch (err: any) {
    console.error("Error checking staff role:", err);
    return { role: null, error: err, staffRecord: null };
  }
};

// Helper function to add default admin using localStorage
export const createDefaultAdminIfNeeded = async () => {
  console.log("Starting default admin creation process");
  
  try {
    // First make sure default admin exists in users
    const users = JSON.parse(localStorage.getItem('tulip_dental_users') || '[]');
    let adminUser = users.find((u: any) => u.email === DEFAULT_ADMIN_EMAIL);
    
    if (!adminUser) {
      console.log("Creating default admin user");
      adminUser = {
        id: `user_default_admin_${Date.now()}`,
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
        created_at: new Date().toISOString()
      };
      
      users.push(adminUser);
      localStorage.setItem('tulip_dental_users', JSON.stringify(users));
    }
    
    // Now check if admin exists in staff
    const allStaff = JSON.parse(localStorage.getItem('tulip_dental_staff') || '[]');
    const adminStaff = allStaff.find((s: any) => s.auth_id === adminUser.id);
    
    if (!adminStaff) {
      console.log("Creating default admin staff record");
      const newStaffMember = {
        id: `staff_default_admin_${Date.now()}`,
        auth_id: adminUser.id,
        created_at: new Date().toISOString(),
        first_name: "Default",
        last_name: "Admin",
        email: DEFAULT_ADMIN_EMAIL,
        role: "admin",
        phone: "123-456-7890"
      };
      
      allStaff.push(newStaffMember);
      localStorage.setItem('tulip_dental_staff', JSON.stringify(allStaff));
    }
    
    console.log("Default admin successfully created");
    return { 
      success: true, 
      message: "Default admin created successfully", 
      user: { id: adminUser.id, email: DEFAULT_ADMIN_EMAIL } 
    };
  } catch (err: any) {
    console.error("Error creating default admin:", err);
    return { 
      success: false, 
      error: err, 
      message: "Error creating default admin: " + err.message 
    };
  }
};

// Helper function to ensure services table has default services using localStorage
export const ensureDefaultServices = async () => {
  console.log("Starting default services creation process");
  
  try {
    // Check if services already exist
    let services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');
    console.log(`Found ${services.length} services`);
    
    if (services.length > 0) {
      console.log("Services already exist");
      return { success: true, message: "Services already exist" };
    }
    
    console.log("No services found. Adding default services...");
    
    const defaultServices = [
      { 
        id: `service_1_${Date.now()}`,
        name: "Regular Checkup", 
        description: "Comprehensive dental examination and consultation", 
        duration: 30, 
        price: 50 
      },
      { 
        id: `service_2_${Date.now()}`,
        name: "Teeth Cleaning", 
        description: "Professional dental cleaning and polishing", 
        duration: 60, 
        price: 80 
      },
      { 
        id: `service_3_${Date.now()}`,
        name: "Root Canal", 
        description: "Treatment for infected tooth pulp", 
        duration: 90, 
        price: 200 
      },
      { 
        id: `service_4_${Date.now()}`,
        name: "Tooth Extraction", 
        description: "Safe removal of damaged or problematic teeth", 
        duration: 45, 
        price: 150 
      }
    ];
    
    localStorage.setItem(SERVICES_KEY, JSON.stringify(defaultServices));
    console.log("Default services created successfully");
    
    // Verify services were stored
    services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');
    console.log(`Now have ${services.length} services`);
    
    return { success: true, message: "Default services created successfully" };
    
  } catch (err: any) {
    console.error("Error adding default services:", err);
    return { success: false, error: err };
  }
};

// Helper functions to work with appointments and patients in localStorage
export const createPatient = async (patientData: any) => {
  try {
    const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
    const newPatient = {
      id: `patient_${Date.now()}`,
      created_at: new Date().toISOString(),
      ...patientData
    };
    
    patients.push(newPatient);
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
    
    return { data: newPatient, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
};

export const findPatientByEmail = async (email: string) => {
  try {
    const patients = JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]');
    const patient = patients.find((p: any) => p.email === email);
    
    return { data: patient || null, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
};

export const createAppointment = async (appointmentData: any) => {
  try {
    const appointments = JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]');
    const newAppointment = {
      id: `appointment_${Date.now()}`,
      created_at: new Date().toISOString(),
      ...appointmentData
    };
    
    appointments.push(newAppointment);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    
    return { data: newAppointment, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
};

export const getAllServices = async () => {
  try {
    const services = JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]');
    return { data: services, error: null };
  } catch (err: any) {
    return { data: [], error: err };
  }
};
