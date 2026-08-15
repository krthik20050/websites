"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatPrice, formatDate } from "@/lib/format";
import type { BookingStatus } from "@/db/schema";
import { STATUS_COLORS } from "@/lib/constants";

export const dynamic = "force-dynamic";

const TIMELINE: BookingStatus[] = ["pending", "confirmed", "active", "returned"];

export default function BookingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState<{
    id: string; bookingNumber: string; status: BookingStatus; pickupDate: string; returnDate: string;
    totalRentalCents: number; depositCents: number | null; damageWaiverCents: number; grandTotalCents: number | null;
    damageNotes: string | null; paidAtStore: boolean; depositCollected: boolean; depositReturned: boolean;
    productName: string; customerName: string; customerPhone: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Return sheet states
  const [returnOpen, setReturnOpen] = useState(false);
  const [condition, setCondition] = useState<"good" | "minor" | "major">("good");
  const [damageNotes, setDamageNotes] = useState("");

  const fetchBooking = async () => {
    try {
      const { getBookingWithDetails } = await import("@/lib/actions/bookings");
      const b = await getBookingWithDetails(id);
      if (b) {
        setBooking({
          id: b.id, bookingNumber: b.bookingNumber, status: b.status as BookingStatus,
          pickupDate: b.pickupDate, returnDate: b.returnDate,
          totalRentalCents: b.totalRentalCents, depositCents: b.depositCents,
          damageWaiverCents: b.damageWaiverCents, grandTotalCents: b.grandTotalCents,
          damageNotes: b.damageNotes ?? null, paidAtStore: b.paidAtStore,
          depositCollected: b.depositCollected, depositReturned: b.depositReturned,
          productName: b.productName, customerName: b.customerName, customerPhone: b.customerPhone,
        });
      }
    } catch (err) {
      console.error("Failed to load booking details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleStatusChange = async (status: BookingStatus) => {
    setLoading(true);
    try {
      const { updateBookingStatus } = await import("@/lib/actions/bookings");
      await updateBookingStatus(id, status);
      await fetchBooking();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const { adminCancelBooking } = await import("@/lib/actions/admin");
      await adminCancelBooking(id);
      await fetchBooking();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleNoShow = async () => {
    setLoading(true);
    try {
      const { adminMarkNoShow } = await import("@/lib/actions/admin");
      await adminMarkNoShow(id);
      await fetchBooking();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleReturnSubmit = async () => {
    setLoading(true);
    try {
      const { adminProcessReturn } = await import("@/lib/actions/admin");
      await adminProcessReturn({
        bookingId: id,
        condition,
        damageNotes: damageNotes || undefined,
      });
      setReturnOpen(false);
      await fetchBooking();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading && !booking) return <div className="p-4 lg:pl-52"><div className="h-64 animate-pulse rounded-xl bg-surface-secondary" /></div>;
  if (!booking) return <div className="p-4 lg:pl-52 text-center"><p className="text-brand-500">Booking not found</p><Link href="/admin/bookings"><Button variant="outline" className="mt-4">Back</Button></Link></div>;

  const currentStep = TIMELINE.indexOf(booking.status);

  return (
    <div className="p-4 lg:pl-52">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/admin/bookings"><Button variant="ghost" size="sm">← Back</Button></Link>
        <h1 className="text-xl font-bold text-brand-950">{booking.bookingNumber}</h1>
        <Badge className={STATUS_COLORS[booking.status]}>{booking.status}</Badge>
      </div>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {TIMELINE.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i <= currentStep ? "bg-accent text-white" : "bg-surface-secondary text-brand-400"}`}>{i + 1}</div>
                {i < TIMELINE.length - 1 && <div className={`h-0.5 w-8 sm:w-16 ${i < currentStep ? "bg-accent" : "bg-border"}`} />}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-brand-500">{TIMELINE.map((s) => <span key={s} className="capitalize">{s}</span>)}</div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between"><span className="text-sm text-brand-500">Product</span><span className="text-sm font-medium text-brand-950">{booking.productName}</span></div>
          <div className="flex justify-between"><span className="text-sm text-brand-500">Customer</span><span className="text-sm font-medium text-brand-950">{booking.customerName}</span></div>
          <div className="flex justify-between"><span className="text-sm text-brand-500">Phone</span><span className="text-sm font-medium text-brand-950">{booking.customerPhone}</span></div>
          <div className="flex justify-between"><span className="text-sm text-brand-500">Pickup</span><span className="text-sm font-medium text-brand-950">{formatDate(booking.pickupDate)}</span></div>
          <div className="flex justify-between"><span className="text-sm text-brand-500">Return</span><span className="text-sm font-medium text-brand-950">{formatDate(booking.returnDate)}</span></div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-brand-500">Rental</span><span>{formatPrice(booking.totalRentalCents)}</span></div>
          {booking.damageWaiverCents > 0 && <div className="flex justify-between text-sm"><span className="text-brand-500">Damage waiver</span><span>{formatPrice(booking.damageWaiverCents)}</span></div>}
          <div className="flex justify-between border-t border-border pt-2 font-bold"><span>Total</span><span>{formatPrice(booking.grandTotalCents ?? booking.totalRentalCents)}</span></div>
          <div className="flex justify-between text-xs text-brand-400"><span>Deposit</span><span>{formatPrice(booking.depositCents ?? 0)} {booking.depositCollected ? "(collected)" : "(pending)"}</span></div>
        </CardContent>
      </Card>
      
      {booking.damageNotes && (
        <Card className="mb-4 border-yellow-200 bg-yellow-50 text-yellow-800">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase">Inspection Notes:</p>
            <p className="text-sm mt-1">{booking.damageNotes}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {booking.status === "confirmed" && (
          <>
            <Button className="w-full font-semibold" onClick={() => handleStatusChange("active")} disabled={loading}>
              Mark Picked Up (Assign Gear)
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleCancel} disabled={loading}>Cancel Booking</Button>
              <Button variant="outline" onClick={handleNoShow} disabled={loading}>Mark No-Show</Button>
            </div>
          </>
        )}
        
        {booking.status === "active" && (
          <Sheet open={returnOpen} onOpenChange={setReturnOpen}>
            <SheetTrigger render={<Button className="w-full font-semibold">Process Return</Button>} />
            <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
              <SheetHeader>
                <SheetTitle>Process Return</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Condition</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["good", "minor", "major"] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCondition(c)}
                        className={`rounded-lg border p-3 text-center text-sm capitalize transition-colors ${
                          condition === c
                            ? "border-accent bg-accent text-white"
                            : "border-border hover:bg-surface-secondary"
                        }`}
                      >
                        {c === "good" ? "✓ " : c === "minor" ? "⚠ " : "✗ "}
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Damage Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter any scratches, missing lens caps, or damage details..."
                    value={damageNotes}
                    onChange={(e) => setDamageNotes(e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="depositReturn" className="h-4 w-4 accent-accent" defaultChecked />
                  <label htmlFor="depositReturn" className="text-sm">Return full deposit</label>
                </div>
                <Button className="w-full font-semibold" onClick={handleReturnSubmit} disabled={loading}>
                  {loading ? "Processing..." : "Complete Return"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        {booking.status === "returned" && (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-brand-500 font-semibold">Booking completed successfully</p>
            </CardContent>
          </Card>
        )}
        
        {booking.status === "cancelled" && (
          <Card className="border-red-100 bg-red-50 text-red-800">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-semibold">Booking Cancelled</p>
            </CardContent>
          </Card>
        )}
        
        {booking.status === "no_show" && (
          <Card className="border-orange-100 bg-orange-50 text-orange-800">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-semibold">Customer No-Show</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
