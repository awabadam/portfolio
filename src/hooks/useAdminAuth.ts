'use client';

import { authClient } from '@/lib/auth/client';

export function useAdminAuth() {
  const { data, isPending } = authClient.useSession();

  return {
    user: data?.user ?? null,
    loading: isPending,
    signIn: (email: string, password: string) =>
      authClient.signIn.email({ email, password }),
    signOut: () => authClient.signOut(),
  };
}
