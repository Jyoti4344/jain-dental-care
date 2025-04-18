
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use the provided environment variables
const supabaseUrl = 'https://oppyvmghrogfysswwayi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcHl2bWdocm9nZnlzc3d3YXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODM4NDgsImV4cCI6MjA2MDU1OTg0OH0.Mc5W8B2SfeGxc3ahsINdjSK2On-dvJKYimkwQIbuYos';

// Create and export the Supabase client with the credentials
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);
