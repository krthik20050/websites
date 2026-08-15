import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

// Custom fields (role, phone) are defined directly in the auth_user table schema.
// additionalFields tells better-auth to include these in session API responses.
// The `as any` cast is needed because the strict DBFieldType in v1.6.20
// has a type mismatch with the plain string literal.

export const authConfig = {
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer" },
      phone: { type: "string", required: false },
    },
  } as any,
};

export const auth = betterAuth(authConfig);

export type Session = typeof auth.$Infer.Session;
export type SessionUser = Session["user"] & { role: string | null; phone: string | null };
