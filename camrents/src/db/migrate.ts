import { sql } from "drizzle-orm";
import { db } from "./index";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env manually
import { readFileSync } from "fs";
const envPath = resolve(__dirname, "../../.env");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
  if (!process.env[key]) process.env[key] = val;
}

async function migrate() {
  console.log("Running migration...");

  // Create auth tables
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS auth_user (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      email_verified BOOLEAN NOT NULL DEFAULT false,
      image TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now(),
      role TEXT DEFAULT 'customer',
      phone TEXT UNIQUE,
      razorpay_customer_id TEXT,
      id_proof_url TEXT,
      rental_count INTEGER DEFAULT 0,
      total_spent_cents INTEGER DEFAULT 0
    )
  `);
  console.log("  ✓ auth_user table created");

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS auth_session (
      id TEXT PRIMARY KEY,
      expires_at TIMESTAMP NOT NULL,
      token TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now(),
      ip_address TEXT,
      user_agent TEXT,
      user_id TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE
    )
  `);
  console.log("  ✓ auth_session table created");

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS auth_account (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      user_id TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
      access_token TEXT,
      refresh_token TEXT,
      id_token TEXT,
      access_token_expires_at TIMESTAMP,
      refresh_token_expires_at TIMESTAMP,
      scope TEXT,
      password TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now()
    )
  `);
  console.log("  ✓ auth_account table created");

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS auth_verification (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now()
    )
  `);
  console.log("  ✓ auth_verification table created");

  // Migrate data from users to auth_user if users table exists
  try {
    const tableExists = await db.execute(sql`
      SELECT COUNT(*) as cnt FROM information_schema.tables WHERE table_name = 'users'
    `);
    
    const count = Number(tableExists.rows[0]?.cnt ?? 0);
    if (count > 0) {
      console.log("  Migrating data from users → auth_user...");
      await db.execute(sql`
        INSERT INTO auth_user (id, name, email, role, phone, rental_count, total_spent_cents, created_at)
        SELECT 
          gen_random_uuid()::text,
          name,
          COALESCE(email, phone || '@placeholder.com'),
          COALESCE(role, 'customer'),
          phone,
          COALESCE(rental_count, 0),
          COALESCE(total_spent_cents, 0),
          COALESCE(created_at, now())
        FROM users
        ON CONFLICT (email) DO NOTHING
      `);
      console.log("  ✓ Data migrated");
      
      // Drop old users table
      await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
      console.log("  ✓ Old users table dropped");
    }
  } catch (e) {
    console.log("  ⚠ Users table migration skipped:", (e as Error).message);
  }

  // Drop old clerk webhook table if exists
  await db.execute(sql`DROP TABLE IF EXISTS clerk_webhooks CASCADE`);
  
  console.log("\nMigration complete!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
