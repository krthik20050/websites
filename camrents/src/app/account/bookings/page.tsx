import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/format";
import { EmptyState } from "@/components/shared/empty-state";
import { getUserBookingsWithDetails } from "@/lib/actions/bookings";
import { STATUS_COLORS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage() {
  const session = await auth.api.getSession({
    headers: new Headers(),
  });
  if (!session) redirect("/");

  const bookings = await getUserBookingsWithDetails(session.user.id);

  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings yet"
        description="Browse our catalog and book your first camera rental"
        action={{ label: "Browse Cameras", href: "/cameras" }}
      />
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((b: any) => (
        <Link key={b.id} href={`/account/bookings/${b.id}`}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{b.bookingNumber}</p>
                    <Badge className={`text-xs ${STATUS_COLORS[b.status] ?? ""}`}>{b.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-brand-300">{b.productName}</p>
                  <p className="text-xs text-brand-400">{formatDate(b.pickupDate)} → {formatDate(b.returnDate)}</p>
                </div>
                <p className="text-sm font-bold text-accent">{formatPrice(b.grandTotalCents)}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
