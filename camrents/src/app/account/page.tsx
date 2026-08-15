"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { getUserBookings } from "@/lib/actions/bookings";

export default function AccountPage() {
  const { data: session, isPending } = useSession();
  const [bookingsCount, setBookingsCount] = useState(0);
  const [totalSpentCents, setTotalSpentCents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const userBookings = await getUserBookings(session.user.id);
        if (!cancelled) {
          setBookingsCount(userBookings.length);
          const spent = userBookings
            .filter(b => ["active", "returned", "confirmed"].includes(b.status ?? ""))
            .reduce((sum, b) => sum + (b.grandTotalCents ?? 0), 0);
          setTotalSpentCents(spent);
        }
      } catch (err) {
        console.error("Failed to load bookings:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [session]);

  if (loading || isPending) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 rounded-[1.5rem] bg-surface-secondary" />
          <div className="h-24 rounded-[1.5rem] bg-surface-secondary" />
        </div>
        <div className="h-48 rounded-[1.5rem] bg-surface-secondary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-semibold text-foreground">Not Signed In</p>
        <p className="text-xs text-brand-500 mt-1.5">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="bezel-outer">
          <div className="bezel-inner bg-card p-5">
            <p className="text-2xl font-bold text-foreground">{bookingsCount}</p>
            <p className="text-xs text-brand-500 mt-0.5">Total Bookings</p>
          </div>
        </div>
        <div className="bezel-outer">
          <div className="bezel-inner bg-card p-5">
            <p className="text-2xl font-bold text-accent">{formatPrice(totalSpentCents)}</p>
            <p className="text-xs text-brand-500 mt-0.5">Total Spent</p>
          </div>
        </div>
      </div>

      <Card className="border-white/10 bg-card">
        <CardContent className="p-5">
          <h3 className="font-bold text-foreground mb-4">Profile Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-brand-500">Name</span>
              <span className="font-medium text-foreground">{session.user?.name ?? "Not provided"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-brand-500">Email</span>
              <span className="font-medium text-foreground">{session.user?.email ?? "Not provided"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
