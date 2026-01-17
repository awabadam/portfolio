import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client-side';
import type { SupabaseClient } from '@supabase/supabase-js';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    supabase,
    session,
    loading,
    user: session?.user ?? null,
    signIn: async (email: string, password: string) => {
      if (!supabase) return { error: { message: 'Supabase client not initialized' } };
      return await supabase.auth.signInWithPassword({ email, password });
    },
    signOut: async () => {
      if (!supabase) return { error: { message: 'Supabase client not initialized' } };
      return await supabase.auth.signOut();
    },
  };
}
