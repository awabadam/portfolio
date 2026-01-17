import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';

// Singleton pattern to avoid multiple client instances
let browserClient: SupabaseClient | null = null;
let clientCreationAttempted = false;

export function createBrowserSupabaseClient(): SupabaseClient | null {
  // Return existing client if already created
  if (browserClient) {
    return browserClient;
  }

  // Don't retry if we already tried and failed
  if (clientCreationAttempted) {
    return null;
  }

  clientCreationAttempted = true;

  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase environment variables not configured. Authentication will not work.');
    return null;
  }

  try {
    browserClient = createBrowserClient(supabaseUrl, supabaseKey);
    return browserClient;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}
