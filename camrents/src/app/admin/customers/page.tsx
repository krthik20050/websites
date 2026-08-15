"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DatePicker } from "@/components/shared/date-picker";
import { formatPrice, formatPhone, formatDate } from "@/lib/format";
import { STATUS_COLORS } from "@/lib/constants";
import {
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  FileText,
  Plus,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  role: string | null;
  createdAt: string | Date;
  idProofUrl: string | null;
  rentalCount: number | null;
  totalSpentCents: number | null;
  status?: string | null;
  adminNotes?: string | null;
}

interface BookingDetails {
  id: string;
  bookingNumber: string;
  status: string;
  pickupDate: string;
  returnDate: string;
  grandTotalCents: number | null;
  brand: string;
  model: string;
}

interface CRMStats {
  totalCustomers: number;
  totalSpent: number;
  avgSpent: number;
  topCustomers: Customer[];
  activeRentersCount: number;
  repeatRenterRate: number;
}

export default function AdminCRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "vip" | "active" | "id" | "suspended">("all");
  
  // CRM statistics state
  const [stats, setStats] = useState<CRMStats>({
    totalCustomers: 0,
    totalSpent: 0,
    avgSpent: 0,
    topCustomers: [],
    activeRentersCount: 0,
    repeatRenterRate: 0,
  });

  // Selected customer sheet states
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerDetails, setCustomerDetails] = useState<{
    customer: Customer;
    bookings: BookingDetails[];
  } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<"rentals" | "id" | "new_booking">("rentals");

  // Local admin control states
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  // In-profile Walk-in booking state
  const [productSearch, setProductSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [returnDate, setReturnDate] = useState("");
  const [depositCollected, setDepositCollected] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState("");
  const [bookingError, setBookingError] = useState("");

  // Load CRM Stats and Directory
  const loadCrmData = async (searchQuery?: string) => {
    try {
      const { adminGetCustomers, adminGetCrmStats } = await import("@/lib/actions/admin");
      
      const [listData, statsData] = await Promise.all([
        adminGetCustomers(searchQuery || undefined),
        adminGetCrmStats(),
      ]);

      setCustomers(listData as Customer[]);

      setStats({
        totalCustomers: statsData.totalCustomers,
        totalSpent: statsData.totalSpent,
        avgSpent: statsData.avgSpent,
        topCustomers: statsData.topCustomers as Customer[],
        activeRentersCount: statsData.activeRentersCount,
        repeatRenterRate: statsData.repeatRenterRate,
      });
    } catch (err) {
      console.error("Failed to load CRM data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrmData(search);
  }, [search]);

  // Load individual customer details when selected
  useEffect(() => {
    if (!selectedCustomerId) {
      setCustomerDetails(null);
      return;
    }
    
    (async () => {
      setLoadingDetails(true);
      setActiveTab("rentals");
      setBookingSuccessMsg("");
      setBookingError("");
      setSelectedProduct(null);
      setProductSearch("");
      
      try {
        const { adminGetCustomerDetails } = await import("@/lib/actions/admin");
        const details = await adminGetCustomerDetails(selectedCustomerId);
        setCustomerDetails(details as any);
        setAdminNotesInput(details.customer.adminNotes ?? "");
      } catch (err) {
        console.error("Failed to load customer details:", err);
      } finally {
        setLoadingDetails(false);
      }
    })();
  }, [selectedCustomerId]);

  const handleSaveNotes = async () => {
    if (!selectedCustomerId) return;
    setSavingNotes(true);
    try {
      const { adminUpdateCustomerNotes } = await import("@/lib/actions/admin");
      await adminUpdateCustomerNotes(selectedCustomerId, adminNotesInput);
      
      if (customerDetails) {
        setCustomerDetails({
          ...customerDetails,
          customer: {
            ...customerDetails.customer,
            adminNotes: adminNotesInput,
          } as any,
        });
      }
      loadCrmData(search);
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleUpdateStatus = async (newStatus: "active" | "suspended") => {
    if (!selectedCustomerId) return;
    setSavingStatus(true);
    try {
      const { adminUpdateCustomerStatus } = await import("@/lib/actions/admin");
      await adminUpdateCustomerStatus(selectedCustomerId, newStatus);
      
      if (customerDetails) {
        setCustomerDetails({
          ...customerDetails,
          customer: {
            ...customerDetails.customer,
            status: newStatus,
          } as any,
        });
      }
      loadCrmData(search);
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setSavingStatus(false);
    }
  };

  // Handle product search inside walk-in panel
  useEffect(() => {
    if (!productSearch.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { searchProducts } = await import("@/lib/actions/products");
        const results = await searchProducts({ q: productSearch });
        setSearchResults(results);
      } catch (err) {
        console.error("Product search failed:", err);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [productSearch]);

  // Submit in-profile Walk-in booking
  const handleCreateWalkIn = async () => {
    if (!customerDetails || !selectedProduct || !pickupDate || !returnDate) {
      setBookingError("Please fill out all required fields.");
      return;
    }
    setSubmittingBooking(true);
    setBookingError("");
    try {
      const { adminCreateWalkInBooking } = await import("@/lib/actions/admin");
      const res = await adminCreateWalkInBooking({
        productModelId: selectedProduct.id,
        customerName: customerDetails.customer.name,
        customerPhone: customerDetails.customer.phone || "0000000000",
        pickupDate,
        returnDate,
        depositCollected,
      });

      setBookingSuccessMsg(`Walk-in booking created successfully! Reference: ${res.bookingNumber}`);
      setSelectedProduct(null);
      setProductSearch("");
      setReturnDate("");
      setDepositCollected(false);
      
      // Refresh statistics and booking list
      const { adminGetCustomerDetails } = await import("@/lib/actions/admin");
      const updatedDetails = await adminGetCustomerDetails(customerDetails.customer.id);
      setCustomerDetails(updatedDetails as any);
      loadCrmData(search);
    } catch (err: any) {
      setBookingError(err?.message || "Failed to create walk-in booking");
    } finally {
      setSubmittingBooking(false);
    }
  };

  // Filtering customer records
  const filteredCustomers = customers.filter((c) => {
    if (filter === "vip") return (c.totalSpentCents ?? 0) >= 1500000; // ₹15,000 threshold for VIP
    if (filter === "id") return !!c.idProofUrl;
    if (filter === "suspended") return c.status === "suspended";
    return true;
  });

  return (
    <div className="p-4 lg:pl-52">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin CRM Hub</h1>
        <p className="text-xs text-brand-400 mt-1">
          Manage client profiles, analyze lifetime value (LTV), review documents, and schedule offline walk-in bookings.
        </p>
      </div>

      {/* Top CRM Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 mb-6">
        <Card className="border-white/5 bg-[#0a1018]/50 backdrop-blur-md">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                {stats.totalCustomers}
              </p>
              <p className="text-[10px] text-brand-500 font-semibold uppercase tracking-wider mt-1">
                Total Clients
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-[#0a1018]/50 backdrop-blur-md">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                {formatPrice(stats.totalSpent)}
              </p>
              <p className="text-[10px] text-brand-500 font-semibold uppercase tracking-wider mt-1">
                LTV / Revenue
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-[#0a1018]/50 backdrop-blur-md">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                {formatPrice(stats.avgSpent)}
              </p>
              <p className="text-[10px] text-brand-500 font-semibold uppercase tracking-wider mt-1">
                Average LTV
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-[#0a1018]/50 backdrop-blur-md">
          <CardContent className="p-4 flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white leading-none">
                {stats.repeatRenterRate}%
              </p>
              <p className="text-[10px] text-brand-500 font-semibold uppercase tracking-wider mt-1">
                Repeat Renters
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top LTV Customers Leaderboard */}
      {stats.topCustomers.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-accent" /> LTV Leaderboard (VIPs)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stats.topCustomers.map((cust, i) => (
              <button
                key={cust.id}
                onClick={() => setSelectedCustomerId(cust.id)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-[#0c0c12] hover:bg-white/5 transition-all text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-accent/25 to-accent/5 border border-accent/20 text-xs font-bold text-accent">
                    {cust.name.split(" ").map(n => n[0]).join("")}
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-black text-black">
                      {i + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-accent transition-colors">
                      {cust.name}
                    </p>
                    <p className="text-[10px] text-brand-400 truncate">
                      {cust.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-white">
                    {formatPrice(cust.totalSpentCents ?? 0)}
                  </p>
                  <p className="text-[9px] text-brand-400 mt-0.5">
                    {cust.rentalCount ?? 0} rents
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Directory & Controls */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Input
            placeholder="Search by client name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-brand-500 focus:border-accent/40 rounded-xl"
          />
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-brand-500" />
        </div>

        {/* Directory Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          <button
            onClick={() => setFilter("all")}
            className={`shrink-0 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
              filter === "all"
                ? "bg-accent text-black font-bold shadow-md shadow-accent/15"
                : "bg-white/5 text-brand-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            All Clients
          </button>
          <button
            onClick={() => setFilter("vip")}
            className={`shrink-0 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
              filter === "vip"
                ? "bg-accent text-black font-bold shadow-md shadow-accent/15"
                : "bg-white/5 text-brand-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            ⭐ VIP (₹15k+ LTV)
          </button>
          <button
            onClick={() => setFilter("id")}
            className={`shrink-0 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
              filter === "id"
                ? "bg-accent text-black font-bold shadow-md shadow-accent/15"
                : "bg-white/5 text-brand-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            🪪 ID Uploaded
          </button>
          <button
            onClick={() => setFilter("suspended")}
            className={`shrink-0 rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
              filter === "suspended"
                ? "bg-accent text-black font-bold shadow-md shadow-accent/15"
                : "bg-white/5 text-brand-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            ⚠️ Suspended
          </button>
        </div>
      </div>

      {/* Customers List Grid */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="space-y-2">
          {filteredCustomers.map((c) => {
            const isVip = (c.totalSpentCents ?? 0) >= 1500000;
            const hasId = !!c.idProofUrl;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCustomerId(c.id)}
                className="w-full text-left"
              >
                <Card className="hover:shadow-lg hover:border-white/10 hover:bg-white/5 transition-all border-white/5 bg-[#0a1018]/30">
                  <CardContent className="flex items-center justify-between p-3.5">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          c.status === "suspended"
                            ? "bg-gradient-to-tr from-red-950/30 to-red-900/10 border border-red-500/30 text-red-400"
                            : isVip
                            ? "bg-gradient-to-tr from-accent/30 to-accent/10 border border-accent/30 text-accent"
                            : "bg-white/5 border border-white/10 text-brand-300"
                        }`}
                      >
                        {c.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white truncate">{c.name}</p>
                          {c.status === "suspended" && (
                            <Badge className="bg-red-950 text-red-400 border-red-500/20 text-[9px] px-1.5 py-0 font-bold">
                              Suspended
                            </Badge>
                          )}
                          {isVip && (
                            <Badge className="bg-accent text-black hover:bg-accent border-none text-[9px] font-black px-1.5 py-0">
                              VIP
                            </Badge>
                          )}
                          {hasId && (
                            <Badge className="bg-blue-950 text-blue-400 border-blue-500/20 text-[9px] px-1.5 py-0">
                              IDProof
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-brand-400 mt-0.5 truncate">
                          {c.email} · {c.phone ? formatPhone(c.phone) : "No Phone"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div>
                        <p className="text-xs font-extrabold text-white">
                          {formatPrice(c.totalSpentCents ?? 0)}
                        </p>
                        <p className="text-[10px] text-brand-500 mt-0.5">
                          {c.rentalCount ?? 0} bookings
                        </p>
                      </div>
                      <ChevronRight className="h-4.5 w-4.5 text-brand-500 group-hover:text-white" />
                    </div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>
      ) : (
        <Card className="border-white/5 bg-[#0a1018]/30">
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-8 w-8 text-brand-500 mb-3" />
            <p className="text-sm text-brand-400">No CRM client profiles matching this query.</p>
          </CardContent>
        </Card>
      )}

      {/* Customer Profile Side Drawer */}
      <Sheet open={!!selectedCustomerId} onOpenChange={(open) => !open && setSelectedCustomerId(null)}>
        <SheetContent side="right" className="w-[100vw] sm:max-w-md bg-[#0c0c10] border-l border-white/10 text-white p-0 shadow-2xl flex flex-col h-full">
          {loadingDetails || !customerDetails ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-accent mb-2" />
              <p className="text-xs text-brand-400">Fetching Customer Portfolio...</p>
            </div>
          ) : (
            <>
              {/* Sheet Header Profile View */}
              <div className="p-5 border-b border-white/5 bg-[#0f0f15]/80 backdrop-blur-md">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${
                        customerDetails.customer.status === "suspended"
                          ? "bg-gradient-to-tr from-red-950/30 to-red-900/10 border border-red-500/30 text-red-400"
                          : (customerDetails.customer.totalSpentCents ?? 0) >= 1500000
                          ? "bg-gradient-to-tr from-accent/30 to-accent/5 border border-accent/30 text-accent"
                          : "bg-white/5 border border-white/10 text-brand-300"
                      }`}
                    >
                      {customerDetails.customer.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-1.5 leading-snug">
                        {customerDetails.customer.name}
                      </h2>
                      <p className="text-xs text-brand-400 mt-0.5">
                        Client since {formatDate(customerDetails.customer.createdAt)}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {customerDetails.customer.status === "suspended" && (
                          <Badge className="bg-red-950 text-red-400 border-red-500/20 text-[8px] font-bold px-1 py-0">
                            ACCOUNT SUSPENDED
                          </Badge>
                        )}
                        {(customerDetails.customer.totalSpentCents ?? 0) >= 1500000 && (
                          <Badge className="bg-accent text-black border-none text-[8px] font-black px-1 py-0">
                            VIP MEMBER
                          </Badge>
                        )}
                        {customerDetails.customer.idProofUrl ? (
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[8px] font-bold px-1 py-0 flex items-center gap-0.5">
                            <ShieldCheck className="h-2 w-2" /> ID DOCUMENT ATTACHED
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[8px] font-bold px-1 py-0">
                            NO ID DOCUMENT
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Contact Shortcuts */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-1">
                  <a
                    href={customerDetails.customer.phone ? `tel:${customerDetails.customer.phone}` : "#"}
                    className="flex flex-col items-center justify-center py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs text-brand-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Phone className="h-4 w-4 mb-1 text-brand-400" />
                    <span>Call</span>
                  </a>
                  <a
                    href={customerDetails.customer.email ? `mailto:${customerDetails.customer.email}` : "#"}
                    className="flex flex-col items-center justify-center py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs text-brand-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Mail className="h-4 w-4 mb-1 text-brand-400" />
                    <span>Email</span>
                  </a>
                  <a
                    href={
                      customerDetails.customer.phone
                        ? `https://wa.me/91${customerDetails.customer.phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(
                            customerDetails.customer.name
                          )},%20this%20is%20CamRents%20admin.`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs text-brand-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mb-1 text-brand-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* CRM Segment Navigation */}
              <div className="flex border-b border-white/5 bg-[#0c0c10] px-4 pt-2">
                <button
                  onClick={() => setActiveTab("rentals")}
                  className={`flex-1 text-center py-2.5 text-xs font-bold transition-all border-b-2 ${
                    activeTab === "rentals"
                      ? "border-accent text-accent"
                      : "border-transparent text-brand-400 hover:text-white"
                  }`}
                >
                  Rentals History ({customerDetails.bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab("id")}
                  className={`flex-1 text-center py-2.5 text-xs font-bold transition-all border-b-2 ${
                    activeTab === "id"
                      ? "border-accent text-accent"
                      : "border-transparent text-brand-400 hover:text-white"
                  }`}
                >
                  Verification & Admin
                </button>
                <button
                  onClick={() => setActiveTab("new_booking")}
                  className={`flex-1 text-center py-2.5 text-xs font-bold transition-all border-b-2 ${
                    activeTab === "new_booking"
                      ? "border-accent text-accent"
                      : "border-transparent text-brand-400 hover:text-white"
                  }`}
                >
                  Quick Walk-In
                </button>
              </div>

              {/* Scrollable Details Body */}
              <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
                {activeTab === "rentals" && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">
                      Booking Timeline
                    </h3>
                    
                    {customerDetails.bookings.length > 0 ? (
                      <div className="space-y-3 relative border-l border-white/10 pl-4 ml-2 mt-4">
                        {customerDetails.bookings.map((book) => (
                          <div key={book.id} className="relative">
                            <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-[#0c0c10] bg-accent" />
                            <Card className="border-white/5 bg-white/5">
                              <CardContent className="p-3.5 space-y-2">
                                <div className="flex items-center justify-between">
                                  <Link
                                    href={`/admin/bookings/${book.id}`}
                                    className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                                  >
                                    {book.bookingNumber} <ExternalLink className="h-3 w-3" />
                                  </Link>
                                  <Badge className={`text-[10px] scale-95 font-semibold px-2 py-0 border-none ${STATUS_COLORS[book.status] || ""}`}>
                                    {book.status}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-white">
                                    {book.brand} {book.model}
                                  </p>
                                  <p className="text-[10px] text-brand-400 mt-0.5">
                                    {formatDate(book.pickupDate)} → {formatDate(book.returnDate)}
                                  </p>
                                </div>
                                <div className="flex justify-between border-t border-white/5 pt-1.5 text-xs">
                                  <span className="text-brand-500 font-medium">Rental Total:</span>
                                  <span className="font-extrabold text-white">
                                    {formatPrice(book.grandTotalCents ?? 0)}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-xs text-brand-400">
                        No previous bookings listed.
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "id" && (
                  <div className="space-y-5">
                    {/* Admin Notes & Status Controls */}
                    <div className="space-y-4 border-b border-white/5 pb-5">
                      <div>
                        <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">
                          Account Status
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus("active")}
                            disabled={savingStatus}
                            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                              customerDetails.customer.status !== "suspended"
                                ? "bg-green-500/10 border-green-500/30 text-green-400"
                                : "border-white/10 bg-transparent text-brand-400 hover:text-white"
                            }`}
                          >
                            Active
                          </button>
                          <button
                            onClick={() => handleUpdateStatus("suspended")}
                            disabled={savingStatus}
                            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                              customerDetails.customer.status === "suspended"
                                ? "bg-red-500/15 border-red-500/30 text-red-400"
                                : "border-white/10 bg-transparent text-brand-400 hover:text-white"
                            }`}
                          >
                            Suspend Account
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                            Internal Staff Notes
                          </h3>
                          <button
                            onClick={handleSaveNotes}
                            disabled={savingNotes}
                            className="text-[10px] font-bold text-accent hover:underline disabled:opacity-50"
                          >
                            {savingNotes ? "Saving..." : "Save Notes"}
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          value={adminNotesInput}
                          onChange={(e) => setAdminNotesInput(e.target.value)}
                          placeholder="Type internal remarks here (e.g. preferences, verification call logs, security concerns)..."
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-brand-600 focus:outline-none focus:border-accent/40 resize-none"
                        />
                      </div>
                    </div>

                    {/* ID Verification Preview */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                        Identity Verification Document
                      </h3>
                      {customerDetails.customer.idProofUrl ? (
                        <div className="space-y-3">
                          <Card className="border-white/5 overflow-hidden bg-white/5">
                            <img
                              src={customerDetails.customer.idProofUrl}
                              alt={`${customerDetails.customer.name} ID Proof`}
                              className="w-full h-auto object-cover max-h-56 rounded-lg"
                            />
                          </Card>
                          <a
                            href={customerDetails.customer.idProofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-white transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" /> Open In Full View
                          </a>
                        </div>
                      ) : (
                        <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                          <FileText className="mx-auto h-6 w-6 text-brand-500 mb-2" />
                          <p className="text-xs font-bold text-white">No Document Uploaded</p>
                          <p className="text-[10px] text-brand-500 mt-1">
                            Client has not uploaded any identity proofs yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "new_booking" && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2">
                      New Walk-In Booking
                    </h3>

                    {bookingSuccessMsg ? (
                      <div className="py-6 text-center border border-green-500/20 bg-green-500/5 rounded-2xl">
                        <CheckCircle2 className="mx-auto h-8 w-8 text-green-400 mb-2" />
                        <p className="text-sm font-bold text-white">Success!</p>
                        <p className="text-xs text-brand-300 px-4 mt-1.5">{bookingSuccessMsg}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 border-white/15"
                          onClick={() => setBookingSuccessMsg("")}
                        >
                          New Rental Form
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Search Camera */}
                        <div>
                          <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block mb-1">
                            Search Gear / Camera
                          </label>
                          <Input
                            placeholder="Search Sony, Canon, Nikon, Lens..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="bg-white/5 border-white/10 text-white placeholder:text-brand-500 focus:border-accent/40"
                          />
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                          <div className="space-y-1.5 max-h-40 overflow-y-auto border border-white/10 bg-black/40 p-2 rounded-xl">
                            {searchResults.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => {
                                  setSelectedProduct(p);
                                  setSearchResults([]);
                                  setProductSearch("");
                                }}
                                className="w-full text-left p-2 hover:bg-white/10 rounded-lg text-xs flex justify-between items-center transition-colors"
                              >
                                <span className="font-semibold text-white">
                                  {p.brand} {p.model}
                                </span>
                                <span className="text-accent font-bold">
                                  {formatPrice(p.dailyRateCents)}/day
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Selected Camera Indicator */}
                        {selectedProduct && (
                          <Card className="border-accent/30 bg-accent/5 p-3 flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-white">
                                {selectedProduct.brand} {selectedProduct.model}
                              </p>
                              <p className="text-[10px] text-accent mt-0.5">
                                Daily Rate: {formatPrice(selectedProduct.dailyRateCents)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-brand-400 hover:text-white"
                              onClick={() => setSelectedProduct(null)}
                            >
                              Clear
                            </Button>
                          </Card>
                        )}

                        {/* Rental Dates */}
                        <div className="grid grid-cols-2 gap-3">
                          <DatePicker
                            label="Pickup Date"
                            value={pickupDate}
                            onChange={setPickupDate}
                            minDate={new Date().toISOString().split("T")[0]}
                          />
                          <DatePicker
                            label="Return Date"
                            value={returnDate}
                            onChange={setReturnDate}
                            minDate={pickupDate || new Date().toISOString().split("T")[0]}
                          />
                        </div>

                        {/* Deposit collected */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            id="drawer_deposit"
                            checked={depositCollected}
                            onChange={(e) => setDepositCollected(e.target.checked)}
                            className="h-4 w-4 rounded accent-accent bg-white/5 border-white/10"
                          />
                          <label
                            htmlFor="drawer_deposit"
                            className="text-xs text-brand-300 cursor-pointer select-none"
                          >
                            UPI / Cash Security Deposit Collected
                          </label>
                        </div>

                        {bookingError && (
                          <div className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                            <AlertCircle className="h-4 w-4 shrink-0" /> {bookingError}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="pt-2">
                          <Button
                            className="w-full bg-accent text-brand-950 hover:bg-accent-dark font-extrabold"
                            disabled={submittingBooking || !selectedProduct || !returnDate}
                            onClick={handleCreateWalkIn}
                          >
                            {submittingBooking ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Processing
                                Booking...
                              </>
                            ) : (
                              "Create Offline Rental"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
