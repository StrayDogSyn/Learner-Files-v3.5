import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for frontend use (with anon key)
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Admin client for backend use (with service role key)
export const supabaseAdmin: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// Helper function to create client with custom options
export function createSupabaseClient(options?: {
  serviceRole?: boolean;
  accessToken?: string;
}): SupabaseClient<Database> {
  const key = options?.serviceRole ? supabaseServiceKey : supabaseAnonKey;
  
  return createClient<Database>(supabaseUrl, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      ...(options?.accessToken && {
        accessToken: options.accessToken
      })
    }
  });
}

export type { Database };