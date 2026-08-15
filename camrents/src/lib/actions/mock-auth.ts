"use server";

import { db } from "@/db";
import { authUser, authSession } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

export interface DemoUser {
  id: string;
  name: string;
  phone: string | null;
  role: string | null;
}

export async function getDemoUsers(): Promise<DemoUser[]> {
  try {
    const users = await db
      .select({
        id: authUser.id,
        name: authUser.name,
        phone: authUser.phone,
        role: authUser.role,
      })
      .from(authUser);
    return users;
  } catch (err) {
    console.error("Failed to fetch demo users:", err);
    return [];
  }
}

export async function loginAsDemoUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Verify user exists
    const [user] = await db
      .select()
      .from(authUser)
      .where(eq(authUser.id, userId))
      .limit(1);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // 2. Generate a session token
    const token = randomUUID();
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // 3. Insert session into database
    await db.insert(authSession).values({
      id: sessionId,
      token: token,
      userId: user.id,
      expiresAt: expiresAt,
    });

    // 4. Set cookie in next headers
    const cookieStore = await cookies();
    cookieStore.set("better-auth.session_token", token, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return { success: true };
  } catch (err: any) {
    console.error("Mock login failed:", err);
    return { success: false, error: err.message || "Unknown error occurred" };
  }
}

export async function logoutDemoUser(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("better-auth.session_token");

    if (tokenCookie?.value) {
      // Delete session from DB
      await db.delete(authSession).where(eq(authSession.token, tokenCookie.value));
    }

    // Clear cookie
    cookieStore.set("better-auth.session_token", "", {
      path: "/",
      maxAge: 0,
    });

    return { success: true };
  } catch (err) {
    console.error("Mock logout failed:", err);
    return { success: true }; // Still report success since cookie is cleared
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("better-auth.session_token");
    if (!tokenCookie?.value) return null;

    const [session] = await db
      .select()
      .from(authSession)
      .where(eq(authSession.token, tokenCookie.value))
      .limit(1);

    if (!session || new Date() > session.expiresAt) return null;

    const [user] = await db
      .select()
      .from(authUser)
      .where(eq(authUser.id, session.userId))
      .limit(1);

    if (!user) return null;

    return {
      session: {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt.toISOString(),
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    };
  } catch (err) {
    console.error("Failed to get session user:", err);
    return null;
  }
}

