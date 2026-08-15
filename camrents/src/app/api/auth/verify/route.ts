import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session) {
      return NextResponse.json({ authenticated: false, role: null });
    }
    const user = session.user as { role?: string | null } & typeof session.user;
    return NextResponse.json({
      authenticated: true,
      role: user.role ?? null,
    });
  } catch (err) {
    console.error("API verification error:", err);
    return NextResponse.json({ authenticated: false, role: null }, { status: 500 });
  }
}
