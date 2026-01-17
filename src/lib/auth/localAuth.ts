/**
 * Local development authentication helper
 * ONLY works in development environment
 * Production always uses Supabase authentication
 */

const LOCAL_AUTH_KEY = "local_admin_auth";
const LOCAL_AUTH_EMAIL = "admin@local.dev";

export interface LocalAuthUser {
  id: string;
  email: string;
  created_at: string;
}

/**
 * Check if we're in development environment
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Check if local auth is enabled (only in development)
 */
export function isLocalAuthEnabled(): boolean {
  return isDevelopment();
}

/**
 * Create a local admin session
 */
export function createLocalSession(): LocalAuthUser {
  if (!isLocalAuthEnabled()) {
    throw new Error("Local auth is only available in development");
  }

  const user: LocalAuthUser = {
    id: "local-admin-user",
    email: LOCAL_AUTH_EMAIL,
    created_at: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user));
  }

  return user;
}

/**
 * Get local admin session if it exists
 */
export function getLocalSession(): LocalAuthUser | null {
  if (!isLocalAuthEnabled()) {
    return null;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(LOCAL_AUTH_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as LocalAuthUser;
  } catch {
    return null;
  }
}

/**
 * Check if email/password match local dev credentials
 */
export function validateLocalCredentials(email: string, password: string): boolean {
  if (!isLocalAuthEnabled()) {
    return false;
  }

  // Local dev credentials (only works in development)
  const validEmail = email === "admin@local.dev" || email === "admin";
  const validPassword = password === "admin" || password === "localadmin";

  return validEmail && validPassword;
}

/**
 * Clear local admin session
 */
export function clearLocalSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_AUTH_KEY);
  }
}

/**
 * Convert local user to Supabase-compatible user object
 */
export function localUserToSupabaseUser(localUser: LocalAuthUser): any {
  return {
    id: localUser.id,
    email: localUser.email,
    created_at: localUser.created_at,
    // Add other required Supabase user fields
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    confirmation_sent_at: null,
    confirmed_at: localUser.created_at,
    email_confirmed_at: localUser.created_at,
    invited_at: null,
    last_sign_in_at: localUser.created_at,
    phone: null,
    recovery_sent_at: null,
    role: "authenticated",
    updated_at: localUser.created_at,
  };
}
