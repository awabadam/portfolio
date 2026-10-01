import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { headers } from 'next/headers';
import { db } from '@/db';
import * as schema from '@/db/schema';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: {
    enabled: true,
    // Single admin account; created once via scripts/create-admin.ts.
    disableSignUp: true,
  },
  plugins: [nextCookies()],
});

/** Returns the current session, or null when signed out. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** For server actions: returns the session or throws when signed out. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}
