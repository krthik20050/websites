"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { BookingStatus } from "@/db/schema";
import { formatPrice, formatDate } from "@/lib/format";
import { STATUS_COLORS } from "@/lib/constants";

export const dynamic = "force-dynamic";

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "all" }, { label: "Confirmed", value: "confirmed" },
  { label: "Active", value: "active" }, { label: "Returned", value: "returned" },
  { label: "Cancelled", value: "cancelled" },
];

interface BookingItem {
  id: string; bookingNumber: string; productName: string; customerName: string;
  pickupDate: string; returnDate: string; status: BookingStatus; totalRentalCents: number;
}

const STATIC_BOOKINGS: BookingItem[] = [
  { id: "b1", bookingNumber: "CAM-2026-0001", productName: "Sony A7III", customerName: "Arjun Nair", pickupDate: "2026-06-20", returnDate: "2026-06-25", status: "confirmed", totalRentalCents: 600000 },
  { id: "b2", bookingNumber: "CAM-2026-0002", productName: "Canon R5", customerName: "Priya Menon", pickupDate: "2026-06-18", returnDate: "2026-06-22", status: "active", totalRentalCents: 800000 },
];

export default function AdminBookingsPage() {
  const [data, setData] = useState<BookingItem[]>(STATIC_BOOKINGS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { adminGetBookings } = await import("@/lib/actions/bookings");
        const rows = await adminGetBookings(filter !== "all" ? { status: filter } : undefined);
        if (rows.length > 0) {
          setData(rows.map((b: any) => ({
            id: b.id,
            bookingNumber: b.bookingNumber,
            productName: b.productName,
            customerName: b.customerName,
            pickupDate: b.pickupDate,
            returnDate: b.returnDate,
            status: b.status as BookingStatus,
            totalRentalCents: b.grandTotalCents ?? b.totalRentalCents,
          })));
        } else {
          setData([]);
        }
      } catch { /* use static */ }
      finally { setLoading(false); }
    })();
  }, [filter]);

  const filtered = data.filter((b) => {
    if (filter !== "all" && b.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return b.bookingNumber.toLowerCase().includes(q) || b.customerName.toLowerCase().includes(q); }
    return true;
  });

  return (
    <div className="p-4 lg:pl-52">
      <h1 className="mb-4 text-2xl font-extrabold text-white">Bookings</h1>
      <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`shrink-0 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-300 active:scale-95 ${filter === f.value ? "bg-accent text-brand-950 shadow-md shadow-accent/10" : "bg-white/5 text-brand-400 hover:bg-white/10 hover:text-white"}`}
          >{f.label}</button>
        ))}
      </div>
      <Input placeholder="Search by booking # or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />)}</div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((b) => (
            <Link key={b.id} href={`/admin/bookings/${b.id}`}>
              <Card className="hover:shadow-md transition-shadow border-white/5 bg-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{b.bookingNumber}</p>
                      <Badge className={`text-xs ${STATUS_COLORS[b.status] ?? ""}`}>{b.status}</Badge>
                    </div>
                    <p className="text-xs text-brand-300 mt-1 truncate">{b.productName} · {b.customerName}</p>
                    <p className="text-xs text-brand-400">{formatDate(b.pickupDate)} → {formatDate(b.returnDate)}</p>
                  </div>
                  <p className="text-sm font-bold text-accent">{formatPrice(b.totalRentalCents)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card><CardContent className="py-8 text-center"><p className="text-sm text-brand-400">No bookings found</p></CardContent></Card>
      )}
    </div>
  );
}
