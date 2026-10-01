import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';

// No throw at import time: a missing DATABASE_URL surfaces as a query error
// inside each caller's try/catch, so e.g. the contact form still sends email.
if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set; database queries will fail.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle({ client: pool, schema });
