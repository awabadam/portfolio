import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';

// Singleton pattern to avoid multiple client instances
let browserClient: SupabaseClient | null = null;

export function createBrowserSupabaseClient() {
  // Return existing client if already created
  if (browserClient) {
    return browserClient;
  }

  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase environment variables not configured');
    // Return a mock client or throw error based on your needs
  }

  browserClient = createBrowserClient(
    supabaseUrl!,
    supabaseKey!
  );

  return browserClient;
}
