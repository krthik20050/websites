import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@/lib/env";

let _db: any = null;

function getDb() {
  if (!_db) {
    const conn = env.DATABASE_URL;
    
    // Connect via postgres-js (TCP) for local DB or non-Neon DB, fallback to neon-http for Neon cloud DB
    if (conn.includes("localhost") || conn.includes("127.0.0.1") || !conn.includes("neon.tech")) {
      const queryClient = postgres(conn);
      _db = drizzlePg(queryClient, { schema });
    } else {
      const sql = neon(conn);
      _db = drizzleNeon(sql, { schema });
    }
  }
  return _db;
}

// Lazy-loaded Drizzle instance proxy supporting both local TCP connection and cloud Neon HTTP connection
export const db = new Proxy({} as any, {
  get(target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
