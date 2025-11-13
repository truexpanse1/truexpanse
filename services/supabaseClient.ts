
import { createClient } from '@supabase/supabase-js';

// Best Practice Implementation:
// These environment variables MUST be set in your deployment environment (e.g., Vercel).
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
    console.warn(`
    ********************************************************************************
    ** WARNING: Supabase environment variables are not set!                         **
    ** The application will not be able to connect to the database.                 **
    ** Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment. **
    ********************************************************************************
    `);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
