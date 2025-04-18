
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          created_at: string;
          patient_id: string;
          service_id: string;
          appointment_date: string;
          appointment_time: string;
          status: 'scheduled' | 'completed' | 'cancelled';
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          patient_id: string;
          service_id: string;
          appointment_date: string;
          appointment_time: string;
          status?: 'scheduled' | 'completed' | 'cancelled';
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          patient_id?: string;
          service_id?: string;
          appointment_date?: string;
          appointment_time?: string;
          status?: 'scheduled' | 'completed' | 'cancelled';
          notes?: string | null;
        };
      };
      patients: {
        Row: {
          id: string;
          auth_id: string | null;
          created_at: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          date_of_birth: string | null;
          address: string | null;
          medical_history: Json | null;
        };
        Insert: {
          id?: string;
          auth_id?: string | null;
          created_at?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          date_of_birth?: string | null;
          address?: string | null;
          medical_history?: Json | null;
        };
        Update: {
          id?: string;
          auth_id?: string | null;
          created_at?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          date_of_birth?: string | null;
          address?: string | null;
          medical_history?: Json | null;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string;
          duration: number;
          price: number;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          duration: number;
          price: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          duration?: number;
          price?: number;
        };
      };
      staff: {
        Row: {
          id: string;
          auth_id: string;
          created_at: string;
          first_name: string;
          last_name: string;
          email: string;
          role: 'dentist' | 'hygienist' | 'receptionist' | 'admin';
          specialization: string | null;
          phone: string;
          bio: string | null;
          profile_image_url: string | null;
        };
        Insert: {
          id?: string;
          auth_id: string;
          created_at?: string;
          first_name: string;
          last_name: string;
          email: string;
          role: 'dentist' | 'hygienist' | 'receptionist' | 'admin';
          specialization?: string | null;
          phone: string;
          bio?: string | null;
          profile_image_url?: string | null;
        };
        Update: {
          id?: string;
          auth_id?: string;
          created_at?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          role?: 'dentist' | 'hygienist' | 'receptionist' | 'admin';
          specialization?: string | null;
          phone?: string;
          bio?: string | null;
          profile_image_url?: string | null;
        };
      };
    };
  };
}
