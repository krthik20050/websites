"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { DatePicker } from "@/components/shared/date-picker";

const TABS = [
  { href: "/admin", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" },
  { href: "/admin/bookings", label: "Jobs", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/admin/products", label: "Stock", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { href: "/admin/customers", label: "People", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
  { href: "/admin/settings", label: "More", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

function WalkInSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition-transform hover:scale-105" aria-label="New booking">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        }
      />
      <SheetContent side="bottom" className="h-[90vh] rounded-t-[2rem] bg-[#0c0c10] border-t border-white/10 text-white p-6 shadow-2xl">
        <SheetHeader>
          <SheetTitle>Walk-In Booking</SheetTitle>
        </SheetHeader>
        <WalkInForm onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function WalkInForm({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [created, setCreated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingNumber, setBookingNumber] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [returnDate, setReturnDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [depositCollected, setDepositCollected] = useState(false);

  useEffect(() => {
    if (!productSearch.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const { searchProducts } = await import("@/lib/actions/products");
        setSearchResults(await searchProducts({ q: productSearch }));
      } catch (err) { console.error("Search failed:", err); }
    }, 250);
    return () => clearTimeout(timer);
  }, [productSearch]);

  const handleCreate = async () => {
    if (!selectedProduct || !pickupDate || !returnDate || !customerName || !customerPhone) {
      setError("Please fill out all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { adminCreateWalkInBooking } = await import("@/lib/actions/admin");
      const res = await adminCreateWalkInBooking({
        productModelId: selectedProduct.id,
        customerName,
        customerPhone,
        pickupDate,
        returnDate,
        depositCollected,
      });
      setBookingNumber(res.bookingNumber);
      setCreated(true);
    } catch (err: any) {
      setError(err?.message || "Failed to create walk-in booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {created ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-950/30 border border-green-500/20">
            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-white">Walk-In Booking Created!</p>
          <p className="text-sm text-accent font-bold mt-1">{bookingNumber}</p>
          <p className="text-xs text-brand-300 mt-2">Gear: {selectedProduct?.brand} {selectedProduct?.model}</p>
          <Button className="mt-6" onClick={() => { onClose(); window.location.reload(); }}>Done</Button>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-accent" : "bg-white/10"}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block mb-1">Search Product</p>
              <Input placeholder="Type Sony, Canon, Nikon, lens..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 focus:border-accent/40" />
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <button key={p.id} onClick={() => { setSelectedProduct(p); setStep(2); }} className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-left text-sm hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{p.brand} {p.model}</span>
                        <span className="text-xs text-accent font-medium">₹{p.dailyRateCents / 100}/day</span>
                      </div>
                    </button>
                  ))
                ) : productSearch.trim() && (
                  <p className="text-xs text-brand-400 text-center py-4">No matching cameras found in stock</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block mb-1">Select Dates</p>
              <div className="grid grid-cols-2 gap-3">
                <DatePicker
                  label="Pickup"
                  value={pickupDate}
                  onChange={setPickupDate}
                  minDate={new Date().toISOString().split("T")[0]}
                />
                <DatePicker
                  label="Return"
                  value={returnDate}
                  onChange={setReturnDate}
                  minDate={pickupDate || new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="border-white/10 hover:bg-white/5 text-white">Back</Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-accent text-brand-950 hover:bg-accent-dark font-bold" disabled={!returnDate}>Continue</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-white">{selectedProduct?.brand} {selectedProduct?.model}</p>
              <p className="text-xs text-brand-300">Dates: {pickupDate} → {returnDate}</p>
              <hr className="border-white/10 my-2" />
              <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block mb-1">Customer Details</p>
              <Input placeholder="Customer full name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 focus:border-accent/40" />
              <Input placeholder="Phone number (e.g. 9999999999)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 focus:border-accent/40" />
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="deposit" checked={depositCollected} onChange={(e) => setDepositCollected(e.target.checked)} className="h-4 w-4 rounded accent-accent" />
                <label htmlFor="deposit" className="text-sm text-brand-300 cursor-pointer">Counter Cash/UPI Deposit Collected</label>
              </div>
              {error && <p className="text-sm font-medium text-red-400">{error}</p>}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="border-white/10 hover:bg-white/5 text-white">Back</Button>
                <Button onClick={handleCreate} className="flex-1 bg-accent text-brand-950 hover:bg-accent-dark font-bold" disabled={submitting || !customerName || !customerPhone}>
                  {submitting ? "Processing..." : "Create Walk-In Booking"}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session || (session.user as any)?.role !== "admin") {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending || !session || (session.user as any)?.role !== "admin") {
    return <div className="min-h-screen bg-[#050508] flex items-center justify-center"><p className="text-sm text-brand-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a1018]/90 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white">
            Cam<span className="text-accent">Rents</span> Admin
          </h1>
          <Button variant="ghost" size="sm" onClick={() => { window.location.href = "/"; }} className="text-brand-400 hover:text-white">
            Exit Admin
          </Button>
        </div>
      </header>

      <main className="pb-24 pt-6">{children}</main>

      <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-52 border-r border-white/5 bg-[#0c0c10] pt-6 lg:block">
        <nav className="space-y-1.5 px-3">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "bg-accent text-brand-950 shadow-md shadow-accent/10"
                    : "text-brand-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
                {tab.href === "/admin/bookings" && (
                  <Badge variant="destructive" className="ml-auto text-xs font-bold px-1.5 py-0.5 bg-red-500 text-white border-none">
                    0
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-white/5 bg-[#0c0c10]/95 backdrop-blur-md lg:hidden">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors ${
                active ? "text-accent" : "text-brand-500 hover:text-brand-300"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              <span>{tab.label}</span>
              {tab.href === "/admin/bookings" && (
                <Badge variant="destructive" className="absolute right-3 top-2 h-4 w-4 p-0 text-[10px] flex items-center justify-center bg-red-500 text-white border-none">
                  0
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <WalkInSheet />
    </div>
  );
}
