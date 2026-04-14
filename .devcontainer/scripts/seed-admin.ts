/**
 * Admin User Seeding Script
 *
 * This script seeds the admin user directly into PostgreSQL using bcrypt
 * from the backend package. It runs on every container start but is idempotent
 * (only creates admin if it doesn't exist).
 *
 * Environment Variables:
 * - ADMIN_EMAIL: Admin email (default: admin@example.com)
 * - ADMIN_PASSWORD: Admin password (default: admin123)
 * - ADMIN_NAME: Admin display name (default: Administrator)
 * - POSTGRES_*: Database connection settings
 */

import * as bcrypt from 'bcrypt';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Admin credentials from environment with defaults
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrator';

// Bcrypt cost factor (must match backend/src/users/entities/user.entity.ts)
const BCRYPT_SALT_ROUNDS = 10;

async function seedAdmin(): Promise<void> {
  console.log('');
  console.log('========================================');
  console.log('  Admin User Seeding');
  console.log('========================================');

  const client = new Client({
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'user',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB || 'app_db',
  });

  try {
    console.log('');
    console.log(`[1/4] Connecting to PostgreSQL...`);
    await client.connect();
    console.log('  Connected successfully!');

    // Check if users table exists (TypeORM creates it in dev mode)
    console.log('');
    console.log('[2/4] Checking if users table exists...');
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0]?.exists) {
      console.log('  Users table does not exist yet.');
      console.log('  The table will be created when the backend starts (TypeORM synchronize).');
      console.log('  Admin seeding skipped - will be handled by backend on first run.');
      return;
    }
    console.log('  Users table exists!');

    // Check if admin user already exists
    console.log('');
    console.log(`[3/4] Checking if admin exists (${ADMIN_EMAIL})...`);
    const existingAdmin = await client.query(
      'SELECT id, email FROM users WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (existingAdmin.rows.length > 0) {
      console.log(`  Admin user already exists: ${ADMIN_EMAIL}`);
      console.log('  Skipping creation.');
      return;
    }
    console.log('  Admin user not found. Creating...');

    // Hash password using bcrypt (same as backend entity)
    console.log('');
    console.log('[4/4] Creating admin user...');
    console.log(`  Hashing password with bcrypt (cost: ${BCRYPT_SALT_ROUNDS})...`);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_SALT_ROUNDS);

    // Insert admin user
    // Note: roles is stored as comma-separated string (TypeORM simple-array)
    await client.query(
      `
      INSERT INTO users (id, email, password, name, roles, "isActive", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW(), NOW())
      `,
      [ADMIN_EMAIL, hashedPassword, ADMIN_NAME, 'admin,user']
    );

    console.log('');
    console.log('========================================');
    console.log('  Admin User Created Successfully!');
    console.log('========================================');
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Name:     ${ADMIN_NAME}`);
    console.log(`  Roles:    admin, user`);
    console.log(`  Password: (as configured in ADMIN_PASSWORD)`);
    console.log('');
  } catch (error) {
    console.error('');
    console.error('ERROR: Failed to seed admin user');
    console.error(error instanceof Error ? error.message : error);

    // Don't fail the container start if seeding fails
    // The backend will handle seeding on first run
    console.log('');
    console.log('Note: Admin seeding will be retried by backend on startup.');
    process.exit(0);
  } finally {
    await client.end();
  }
}

// Run the seeding
seedAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(0); // Don't fail container start
  });
