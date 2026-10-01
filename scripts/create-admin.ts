/**
 * Create the admin user (or reset its password if it already exists).
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' npx tsx scripts/create-admin.ts
 *
 * Sign-up is disabled in the app, so this is the only way to create the
 * account. Also attaches any unowned projects / blog posts to the admin.
 */
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD');
  if (password.length < 8) throw new Error('ADMIN_PASSWORD must be at least 8 characters');

  const { isNull } = await import('drizzle-orm');
  const { db } = await import('../src/db');
  const { blogPosts, projects } = await import('../src/db/schema');
  const { auth } = await import('../src/lib/auth/server');
  const ctx = await auth.$context;

  const existing = await ctx.internalAdapter.findUserByEmail(email);
  let userId: string;

  if (existing) {
    userId = existing.user.id;
    await ctx.internalAdapter.updatePassword(userId, await ctx.password.hash(password));
    console.log(`Password reset for ${email}`);
  } else {
    const user = await ctx.internalAdapter.createUser(
      { email, name: 'Admin', emailVerified: true },
      { method: 'admin' }
    );
    await ctx.internalAdapter.linkAccount({
      userId: user.id,
      providerId: 'credential',
      accountId: user.id,
      password: await ctx.password.hash(password),
    });
    userId = user.id;
    console.log(`Created admin ${email}`);
  }

  await db.update(projects).set({ user_id: userId }).where(isNull(projects.user_id));
  await db.update(blogPosts).set({ author_id: userId }).where(isNull(blogPosts.author_id));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
