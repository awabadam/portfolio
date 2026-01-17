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
  const [localAuth, setLocalAuth] = useState<any>(() => {
    // Initialize local auth from localStorage on first render (client-side only)
    if (typeof window !== 'undefined' && isLocalAuthEnabled()) {
      const localSession = getLocalSession();
      if (localSession) {
        return { user: localUserToSupabaseUser(localSession) };
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [supabaseChecked, setSupabaseChecked] = useState(false);

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
      // Only stop loading if we've confirmed there's no supabase client coming
      // Give it a moment to initialize
      const timeout = setTimeout(() => {
        if (!supabase) {
          setLoading(false);
          setSupabaseChecked(true);
        }
      }, 100);
      return () => clearTimeout(timeout);
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      setSupabaseChecked(true);
    }).catch(() => {
      setLoading(false);
      setSupabaseChecked(true);
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

  // Check if Supabase is properly configured (has client or is in local dev mode)
  const isConfigured = !!supabase || isLocalAuthEnabled();
  
  // Debug logging in development
  if (typeof window !== 'undefined' && isLocalAuthEnabled() && !loading) {
    console.log('[Auth Debug]', { 
      hasLocalAuth: !!localAuth, 
      hasSession: !!session, 
      hasUser: !!activeUser,
      supabaseReady: !!supabase 
    });
  }

  return {
    supabase,
    session: activeSession,
    loading,
    user: activeUser,
    isLocalAuth: isLocalAuthEnabled() && !!localAuth,
    isConfigured,
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
      if (!supabase) {
        return { 
          error: { 
            message: 'Authentication service is not configured. Please contact the administrator.' 
          } 
        };
      }
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
      if (!supabase) return { error: { message: 'Authentication service not configured' } };
      return await supabase.auth.signOut();
    },
  };
}
