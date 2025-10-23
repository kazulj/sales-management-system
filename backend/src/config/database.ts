/**
 * Database Configuration
 * SQLite database connection and initialization
 */

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = process.env.DATABASE_PATH || join(__dirname, '../../database/sales.db');

// Initialize database connection
export const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

/**
 * Initialize database schema
 */
export function initializeDatabase(): void {
  try {
    const schemaPath = join(__dirname, '../../database/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    db.exec(schema);
    console.log('✅ Database schema initialized successfully');

    // Run seed data in development
    if (process.env.NODE_ENV === 'development') {
      try {
        const seedPath = join(__dirname, '../../database/seed.sql');
        const seed = readFileSync(seedPath, 'utf-8');
        db.exec(seed);
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
export function closeDatabase(): void {
  db.close();
  console.log('Database connection closed');
}

export default db;
