/**
 * Database Configuration
 * PostgreSQL database connection and initialization
 */

import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

// CRITICAL DEBUG - Log immediately at module load
console.log('========================================');
console.log('🔍 DATABASE CONFIG DEBUG - Module Loading');
console.log('========================================');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? `${process.env.POSTGRES_URL.substring(0, 30)}...` : 'NOT SET');
console.log('POSTGRES_PRISMA_URL:', process.env.POSTGRES_PRISMA_URL ? `${process.env.POSTGRES_PRISMA_URL.substring(0, 30)}...` : 'NOT SET');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? `${process.env.DATABASE_URL.substring(0, 30)}...` : 'NOT SET');
console.log('POSTGRES_URL_NON_POOLING:', process.env.POSTGRES_URL_NON_POOLING ? 'SET' : 'NOT SET');
console.log('========================================');

// Database connection pool
// Use Vercel Postgres URL if available (production), otherwise use individual connection params (development)
const connectionString = process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING;

console.log('Final connectionString:', connectionString ? `${connectionString.substring(0, 30)}...` : 'NOT SET - WILL USE LOCALHOST');

export const pool = connectionString
  ? (() => {
      console.log('✅ Using connection string for database');
      return new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
      });
    })()
  : (() => {
      console.log('⚠️  No connection string - using localhost config');
      console.log('  DB_HOST:', process.env.DB_HOST || 'localhost');
      console.log('  DB_PORT:', process.env.DB_PORT || '5432');
      console.log('  DB_NAME:', process.env.DB_NAME || 'sales_management');
      return new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'sales_management',
        user: process.env.DB_USER || 'kazuki',
        password: process.env.DB_PASSWORD || 'windows2135',
      });
    })();

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
