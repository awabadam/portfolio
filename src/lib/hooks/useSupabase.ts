import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client-side';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  getLocalSession,
  isLocalAuthEnabled,
  localUserToSupabaseUser,
  createLocalSession,
  clearLocalSession,
  validateLocalCredentials,
} from '@/lib/auth/localAuth';

export function useSupabase() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    // Initialize Supabase client on the client side
    const client = createBrowserSupabaseClient();
    setSupabase(client);

    // Cleanup function
    return () => {
      // No cleanup needed for Supabase client
    };
  }, []);

  return supabase;
}

export function useSupabaseAuth() {
  const supabase = useSupabase();
  const [session, setSession] = useState<any>(null);
  const [localAuth, setLocalAuth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for local auth first (only in development)
    if (isLocalAuthEnabled()) {
      const localSession = getLocalSession();
      if (localSession) {
        const localUser = localUserToSupabaseUser(localSession);
        setLocalAuth({ user: localUser });
        setLoading(false);
        return;
      }
    }

    // Fall back to Supabase auth
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // If we have local auth, don't override it with Supabase changes
      if (!isLocalAuthEnabled() || !getLocalSession()) {
        setSession(session);
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Determine which session to use (local auth takes precedence in dev)
  const activeSession = isLocalAuthEnabled() && localAuth ? localAuth : session;
  const activeUser = activeSession?.user ?? null;

  return {
    supabase,
    session: activeSession,
    loading,
    user: activeUser,
    isLocalAuth: isLocalAuthEnabled() && !!localAuth,
    signIn: async (email: string, password: string) => {
      // Try local auth first (only in development)
      if (isLocalAuthEnabled() && validateLocalCredentials(email, password)) {
        const localUser = createLocalSession();
        const user = localUserToSupabaseUser(localUser);
        setLocalAuth({ user });
        setLoading(false);
        return { data: { user, session: null }, error: null };
      }

      // Fall back to Supabase auth
      if (!supabase) return { error: { message: 'Supabase client not initialized' } };
      const result = await supabase.auth.signInWithPassword({ email, password });
      
      // If Supabase login succeeds, clear any local auth
      if (!result.error && isLocalAuthEnabled()) {
        clearLocalSession();
        setLocalAuth(null);
      }
      
      return result;
    },
    signOut: async () => {
      // Clear local auth if it exists
      if (isLocalAuthEnabled() && localAuth) {
        clearLocalSession();
        setLocalAuth(null);
        return { error: null };
      }

      // Otherwise sign out from Supabase
      if (!supabase) return { error: { message: 'Supabase client not initialized' } };
      return await supabase.auth.signOut();
    },
  };
}
