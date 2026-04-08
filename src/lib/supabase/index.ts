// Browser-side client
export { createBrowserSupabaseClient, createSimpleBrowserClient } from './browser';

// Server-side clients
export {
  createApiClient,
  createAppServerClient,
  createAnonClient,
  createAnonClientWithSession,
  createAuthenticatedClient,
  createServiceRoleClient,
  createStaticSupabaseClient,
  createServerSupabaseClient,
} from './server';

// Middleware client
export { createMiddlewareSupabaseClient } from './middleware';
