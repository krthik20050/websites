import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/format";
import { getBookingWithDetails, updateBookingStatus } from "@/lib/actions/bookings";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800", confirmed: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800", returned: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800", no_show: "bg-red-100 text-red-800",
};
const STEPS = ["pending", "confirmed", "active", "returned"];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: new Headers(),
  });
  if (!session) redirect("/");

  const booking = await getBookingWithDetails(id);
  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-500">Booking not found</p>
        <Link href="/account/bookings"><Button variant="outline" className="mt-4">Back</Button></Link>
      </div>
    );
  }

  if (booking.userId !== session.user.id) redirect("/account/bookings");

  const currentStep = STEPS.indexOf(booking.status);

  async function handleCancel() {
    "use server";
    await updateBookingStatus(id, "cancelled");
    revalidatePath(`/account/bookings/${id}`);
    revalidatePath("/account/bookings");
  }

  return (
    <div className="space-y-4">
      <Link href="/account/bookings"><Button variant="ghost" size="sm">← Back to Bookings</Button></Link>
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-extrabold text-white">{booking.bookingNumber}</h1>
        <Badge className={STATUS_COLORS[booking.status]}>{booking.status}</Badge>
      </div>
      <Card><CardContent className="p-4">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i <= currentStep ? "bg-accent text-brand-950" : "bg-white/5 text-brand-400 border border-white/5"}`}>{i + 1}</div>
              {i < STEPS.length - 1 && <div className={`h-0.5 w-12 sm:w-20 ${i < currentStep ? "bg-accent" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-brand-500">{STEPS.map((s) => <span key={s} className="capitalize">{s}</span>)}</div>
      </CardContent></Card>
      <Card className="border-white/5"><CardContent className="p-4 space-y-3">
        <div className="flex justify-between"><span className="text-sm text-brand-400">Product</span><span className="text-sm font-semibold text-white">{booking.productName}</span></div>
        <div className="flex justify-between"><span className="text-sm text-brand-400">Pickup</span><span className="text-sm font-semibold text-white">{formatDate(booking.pickupDate)}</span></div>
        <div className="flex justify-between"><span className="text-sm text-brand-400">Return</span><span className="text-sm font-semibold text-white">{formatDate(booking.returnDate)}</span></div>
      </CardContent></Card>
      <Card className="border-white/5"><CardContent className="p-4 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-brand-400">Rental</span><span className="text-white font-medium">{formatPrice(booking.totalRentalCents)}</span></div>
        {booking.damageWaiverCents > 0 && <div className="flex justify-between text-sm"><span className="text-brand-400">Damage waiver</span><span className="text-white font-medium">{formatPrice(booking.damageWaiverCents)}</span></div>}
        <div className="flex justify-between border-t border-white/5 pt-2 font-bold text-white"><span>Total</span><span className="text-accent">{formatPrice(booking.grandTotalCents ?? booking.totalRentalCents)}</span></div>
        <p className="text-xs text-brand-400">Deposit: {formatPrice(booking.depositCents ?? 0)} (at pickup)</p>
      </CardContent></Card>
      {booking.status === "confirmed" && (
        <form action={handleCancel}>
          <Button type="submit" variant="outline" className="w-full">Cancel Booking</Button>
        </form>
      )}
    </div>
  );
}
