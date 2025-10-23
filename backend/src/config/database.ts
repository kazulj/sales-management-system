/**
 * Database Configuration
 * PostgreSQL database connection and initialization
 */

import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

// Database connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

/**
 * Initialize database schema
 */
export async function initializeDatabase(): Promise<void> {
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
