"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { IMAGES } from "@/lib/images";
import { formatPrice, calcDays } from "@/lib/format";
import type { ProductRow } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const pickup = searchParams.get("pickup") ?? "";
  const retD = searchParams.get("return") ?? "";
  const waiver = searchParams.get("waiver") === "true";
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [product, setProduct] = useState<ProductRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMode, setPaymentMode] = useState<"online" | "offline">("offline");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingNum, setBookingNum] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getProductBySlug } = await import("@/lib/actions/products");
        const p = await getProductBySlug(slug);
        if (!cancelled) setProduct(p ?? null);
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const price = useMemo(() => {
    if (!product || !pickup || !retD) return null;
    const days = calcDays(pickup, retD);
    const rental = product.dailyRateCents * days;
    const w = waiver ? Math.round(rental * 0.1) : 0;
    return { days, rental, waiver: w, total: rental + w };
  }, [product, pickup, retD, waiver]);

  const handleSubmit = async () => {
    if (!product || !price || !user?.id) return;
    setError("");
    setSubmitting(true);
    try {
      const { createBooking } = await import("@/lib/actions/bookings");
      const booking = await createBooking({
        userId: user.id,
        productModelId: product.id,
        pickupDate: pickup,
        returnDate: retD,
        paymentMode: paymentMode,
        hasWaiver: waiver,
      });
      if (booking?.bookingNumber) {
        setBookingNum(booking.bookingNumber);
        setSubmitted(true);
      } else {
        setError("Failed to generate booking. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred while confirming your booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#050508] text-white min-h-screen pt-36 pb-24 sm:pt-40 sm:pb-32 flex items-center justify-center animate-fade-up">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-950/30 border border-green-500/20">
            <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-white">Booking Confirmed</h1>
          <p className="mt-3 text-brand-400 text-sm">Your rental booking number is</p>
          <p className="mt-2 text-3xl font-bold text-accent">{bookingNum}</p>
          <p className="mt-5 text-sm text-brand-300 max-w-sm mx-auto leading-relaxed">
            {paymentMode === "offline"
              ? "Please pay at our shop in Thrissur when you pick up your gear."
              : "Complete payment to secure your booking."}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row justify-center">
            <Button asChild className="bg-accent text-black hover:bg-accent-dark font-bold rounded-full px-8 py-3"><Link href="/account/bookings">View My Bookings</Link></Button>
            <Button variant="outline" asChild className="border-white/10 hover:bg-white/5 text-white rounded-full px-8 py-3"><Link href="/cameras">Browse More Gear</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || isPending) {
    return (
      <div className="bg-[#050508] text-white min-h-screen pt-36 pb-24 sm:pt-40 sm:pb-32 flex items-center justify-center">
        <div className="w-full max-w-3xl px-4 sm:px-6">
          <div className="h-64 animate-pulse rounded-[2.5rem] bg-white/5 border border-white/5" />
        </div>
      </div>
    );
  }

  if (!product || !price) {
    return (
      <div className="bg-[#050508] text-white min-h-screen pt-36 pb-24 sm:pt-40 sm:pb-32 flex items-center justify-center animate-fade-up">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-white">Invalid checkout</h1>
          <p className="mt-3 text-brand-400">Please select a product and dates first.</p>
          <Button asChild className="mt-8 bg-accent text-black hover:bg-accent-dark font-bold rounded-full px-8 py-3"><Link href="/cameras">Browse Cameras</Link></Button>
        </div>
      </div>
    );
  }

  const imgSrc = IMAGES[slug as keyof typeof IMAGES] ?? IMAGES.placeholder;
  const img = Array.isArray(imgSrc) ? imgSrc[0] : imgSrc;

  return (
    <div className="bg-[#050508] text-white min-h-screen pt-36 pb-24 sm:pt-40 sm:pb-32 animate-fade-up">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <span className="eyebrow bg-accent/10 text-accent border border-accent/20 mb-4 inline-block">Checkout</span>
        <h1 className="mb-10 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Complete Your Booking</h1>

        {!user && (
          <Card className="mb-8 border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Authentication Required</p>
                <p className="text-xs text-brand-400 mt-0.5">You must be logged in to confirm your booking.</p>
              </div>
              <Button asChild size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-md shadow-yellow-500/20">
                <Link href="/">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="border-white/10 bg-card">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="bezel-outer shrink-0">
                    <div className="bezel-inner h-16 w-20 overflow-hidden bg-white/5">
                      <Image src={img} alt={product.model} width={80} height={64} className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-brand-400">{product.brand}</p>
                    <h3 className="font-bold text-white">{product.model}</h3>
                    <p className="text-xs text-brand-400 mt-0.5">{price.days} day{price.days !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-2 border-t border-white/5 pt-4 text-sm">
                  <div className="flex justify-between"><span className="text-brand-400">Rental fee ({price.days}d)</span><span className="font-medium text-white">{formatPrice(price.rental)}</span></div>
                  {waiver && <div className="flex justify-between"><span className="text-brand-400">Damage waiver</span><span className="font-medium text-white">{formatPrice(price.waiver)}</span></div>}
                  <div className="flex justify-between border-t border-white/5 pt-3 font-bold text-base text-white"><span>Total</span><span className="text-accent">{formatPrice(price.total)}</span></div>
                  <p className="text-xs text-brand-400 mt-2">Refundable deposit: {formatPrice(product.depositCents)} (collected at pickup)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment & Details */}
          <div className="space-y-6 lg:col-span-3">
            <Card className="border-white/10 bg-card">
              <CardContent className="p-5">
                <h3 className="mb-4 text-sm font-semibold text-white">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMode("online")}
                    className={`rounded-2xl border p-4 text-left text-sm transition-all duration-300 ${
                      paymentMode === "online" ? "border-accent/40 bg-accent/5 shadow-md shadow-accent/5" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <p className="font-semibold text-white">Pay Online (UPI)</p>
                    <p className="text-xs text-brand-400 mt-0.5">GPay, PhonePe, Paytm</p>
                  </button>
                  <button
                    onClick={() => setPaymentMode("offline")}
                    className={`rounded-2xl border p-4 text-left text-sm transition-all duration-300 ${
                      paymentMode === "offline" ? "border-accent/40 bg-accent/5 shadow-md shadow-accent/5" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <p className="font-semibold text-white">Pay at Store</p>
                    <p className="text-xs text-brand-400 mt-0.5">Cash or UPI at counter</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-card">
              <CardContent className="p-5">
                <h3 className="mb-4 text-sm font-semibold text-white">Your Details</h3>
                <div className="space-y-3">
                  <Input placeholder="Full Name" value={user?.name ?? ""} disabled className="rounded-xl border-white/10 bg-white/5 text-brand-300" />
                  <Input placeholder="Email" value={user?.email ?? ""} disabled className="rounded-xl border-white/10 bg-white/5 text-brand-300" />
                </div>
              </CardContent>
            </Card>

            {error && (
              <p className="text-sm font-medium text-red-400 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
            )}

            <Button
              className="w-full h-13 text-sm animate-pulse-slow"
              size="lg"
              onClick={handleSubmit}
              disabled={submitting || !user}
            >
              {submitting
                ? "Confirming..."
                : paymentMode === "online"
                  ? `Pay ${formatPrice(price.total)}`
                  : "Confirm Booking"}
            </Button>

            <p className="text-center text-xs text-brand-400 leading-relaxed">
              By booking, you agree to our terms. Security deposit of {formatPrice(product.depositCents)} is collected at the pickup counter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-32 sm:px-6"><div className="h-64 animate-pulse rounded-[2rem] bg-surface-secondary" /></div>}>
      <CheckoutForm />
    </Suspense>
  );
}
