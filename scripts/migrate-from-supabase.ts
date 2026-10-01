/**
 * One-off copy of app data from Supabase to Neon.
 *
 *   npx tsx scripts/migrate-from-supabase.ts
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and DATABASE_URL
 * from .env.local. Safe to re-run: existing rows (same id) are skipped.
 * Supabase user references (author_id / user_id) are dropped; run
 * scripts/create-admin.ts afterwards to attach them to the new admin user.
 */
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

// Values pulled with `vercel env pull` can carry a literal trailing "\n".
const clean = (v?: string) => v?.trim().replace(/\\n$/, '');

const TIMESTAMP_COLUMNS = new Set([
  'created_at',
  'updated_at',
  'published_at',
  'started_at',
  'ended_at',
]);

async function main() {
  const supabaseUrl = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!supabaseUrl || !key) throw new Error('Supabase env vars missing');

  const { db } = await import('../src/db');
  const schema = await import('../src/db/schema');

  // Parents before children (chat_messages -> chat_conversations).
  const tables = [
    ['projects', schema.projects],
    ['blog_categories', schema.blogCategories],
    ['blog_posts', schema.blogPosts],
    ['leads', schema.leads],
    ['chat_conversations', schema.chatConversations],
    ['chat_messages', schema.chatMessages],
  ] as const;

  for (const [name, table] of tables) {
    const res = await fetch(`${supabaseUrl}/rest/v1/${name}?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`${name}: ${res.status} ${await res.text()}`);
    const rows: Record<string, unknown>[] = await res.json();

    const values = rows.map((row) => {
      const out: Record<string, unknown> = {};
      for (const [col, val] of Object.entries(row)) {
        if (col === 'author_id' || col === 'user_id') out[col] = null;
        else if (TIMESTAMP_COLUMNS.has(col) && typeof val === 'string') out[col] = new Date(val);
        else out[col] = val;
      }
      return out;
    });

    if (values.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.insert(table).values(values as any).onConflictDoNothing();
    }
    console.log(`${name}: ${values.length} rows copied`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
