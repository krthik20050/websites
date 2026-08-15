"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useEffect } from "react";

const NAV = [
  { href: "/account", label: "Profile" },
  { href: "/account/bookings", label: "My Bookings" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-surface-secondary" />
          <div className="h-4 w-32 rounded bg-surface-secondary" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050508] text-white min-h-screen pt-36 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">My Account</h1>
          <p className="text-sm text-brand-400 mt-1">Manage your profile and bookings</p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <nav className="flex gap-2 md:w-48 md:flex-col shrink-0">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  pathname === item.href
                    ? "bg-accent text-brand-950 shadow-md shadow-accent/10"
                    : "text-brand-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {session?.user && (session.user as any).role === "admin" && (
              <Link
                href="/admin"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-accent hover:text-accent-light hover:bg-accent/10 transition-colors duration-300 md:mt-2"
              >
                Admin Portal
              </Link>
            )}
            <button
              onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 md:mt-4 cursor-pointer text-left transition-colors duration-300"
            >
              Sign Out
            </button>
          </nav>

          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
