import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/admin", "/account"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isProtected) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // Role-based authorization for admin paths
    // role and phone are custom fields defined in the auth_user schema
    const user = session.user as { role?: string | null } & typeof session.user;
    if (pathname.startsWith("/admin") && user.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
