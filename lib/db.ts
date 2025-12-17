import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder';

// Only throw in runtime (not build time) if we actually try to connect and fail, 
// OR if you prefer, keep the check but make it optional for build
if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production') {
  console.warn('DATABASE_URL is missing - using placeholder for build/dev');
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}
