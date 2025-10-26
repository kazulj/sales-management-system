/**
 * Database Configuration
 * PostgreSQL database connection and initialization
 */

import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

// Database connection pool
// Use Vercel Postgres URL if available (production), otherwise use individual connection params (development)
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'sales_management',
      user: process.env.DB_USER || 'kazuki',
      password: process.env.DB_PASSWORD || 'windows2135',
    });

/**
 * Initialize database schema
 * Only runs in development - production schema is managed manually
 */
export async function initializeDatabase(): Promise<void> {
  // Skip initialization in production (Vercel) - schema is managed manually
  if (process.env.NODE_ENV === 'production') {
    console.log('ℹ️  Production mode: Skipping automatic schema initialization');
    return;
  }

  try {
    const schemaPath = join(__dirname, '../../database/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    await pool.query(schema);
    console.log('✅ Database schema initialized successfully');

    // Run seed data in development
    if (process.env.NODE_ENV === 'development') {
      try {
        const seedPath = join(__dirname, '../../database/seed.sql');
        const seed = readFileSync(seedPath, 'utf-8');
        await pool.query(seed);
        console.log('✅ Seed data loaded successfully');
      } catch (error) {
        console.log('ℹ️  Seed data already exists or failed to load');
      }
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  await pool.end();
  console.log('Database connection closed');
}

export default pool;
