// Re-export the Supabase clients
export { supabase } from './client';
export { createServerSupabaseClient, createMiddlewareSupabaseClient } from './server';
export { createBrowserSupabaseClient } from './client-side';

// Types
export type { SupabaseClient } from '@supabase/supabase-js';

// Note: createAppServerClient is not exported here to avoid importing next/headers in client components
// Import it directly from './server-app' when needed in app directory server components
