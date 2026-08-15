"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Camera,
  ShieldCheck,
  Calendar,
  MapPin,
  Search,
  CreditCard,
  ShoppingBag,
  CheckCircle,
  Star,
  Play,
  ChevronDown,
  Award,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { DatePicker } from "@/components/shared/date-picker";

// --- Curated list of niche category shots from Unsplash for Creator Stories ---
const STORIES = [
  {
    title: "Weddings",
    subtitle: "Timeless memories",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80",
  },
  {
    title: "Travel",
    subtitle: "Capture the world",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80",
  },
  {
    title: "Films",
    subtitle: "Bring stories to life",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80",
  },
  {
    title: "Content Creation",
    subtitle: "Create. Post. Repeat.",
    image: "https://images.unsplash.com/photo-1530521951415-3dbd69e25bb3?w=600&auto=format&fit=crop&q=80",
  },
  {
    title: "Events",
    subtitle: "Every moment matters",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
  },
];

// Helper to format date string to "Jun 10, 2025" style (timezone-agnostic)
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (monthIdx < 0 || monthIdx > 11 || isNaN(day)) return dateStr;
  return `${months[monthIdx]} ${day}, ${year}`;
};

export default function HomePage() {
  const [category, setCategory] = useState("all");
  const [pickupInput, setPickupInput] = useState("2025-06-10");
  const [returnInput, setReturnInput] = useState("2025-06-12");

  // Revealing animations observer
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    params.set("pickup", pickupInput);
    params.set("return", returnInput);
    window.location.href = `/cameras?${params.toString()}`;
  };

  return (
    <div className="bg-[#050508] text-white min-h-screen">
      {/* ── 1. HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-visible pt-24 pb-20">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_bg.png"
            alt="Photographer holding camera overlooking misty mountains"
            className="w-full h-full object-cover object-center opacity-30 scale-105"
          />
          {/* Gradients to darken top, bottom and sides for premium cinematic look */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/40 to-[#050508]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/70 via-transparent to-[#050508]/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center mt-10">
          <div className="space-y-6 max-w-4xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-semibold uppercase tracking-[0.2em]">
              <Sparkles className="h-3.5 w-3.5" />
              Rent. Create. Inspire.
            </div>

            {/* Main Headings */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] uppercase text-white">
              Your vision. <br />
              Our gear. <br />
              <span className="font-cursive text-gold capitalize normal-case text-5xl sm:text-7xl lg:text-8xl tracking-normal block mt-2">
                Unforgettable stories.
              </span>
            </h1>

            {/* Description */}
            <p className="text-brand-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Premium camera gear for every kind of creator. <br className="hidden sm:inline" />
              Rent high-end. Create without limits.
            </p>

            {/* Sub-features bar */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-2 text-xs sm:text-sm text-brand-300 font-medium">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-gold" />
                <span>Top Brands</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-brand-600 hidden sm:inline" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" />
                <span>Well Maintained</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-brand-600 hidden sm:inline" />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gold" />
                <span>Flexible Rentals</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-brand-600 hidden sm:inline" />
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                <span>Easy Pickup in Thrissur</span>
              </div>
            </div>

            {/* Booking Form Card (Translucent Dark Panel) */}
            <div className="pt-6 w-full max-w-4xl mx-auto">
              <div className="bg-[#0c1017]/90 border border-white/10 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  
                  {/* Category Field */}
                  <div className="flex flex-col items-start px-4 py-2 border-b md:border-b-0 md:border-r border-white/10 w-full">
                    <label className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block mb-1">What are you looking for?</label>
                    <div className="relative w-full mt-1.5 flex items-center justify-between text-left">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-accent/40 appearance-none cursor-pointer pr-10 [&>option]:text-black [&>option]:bg-white"
                      >
                        <option value="all">Cameras, Lenses, Gimbals...</option>
                        <option value="camera_body">Camera Bodies</option>
                        <option value="lens">Lenses</option>
                        <option value="accessory">Accessories & Stabilizers</option>
                      </select>
                      <ChevronDown className="h-4 w-4 text-brand-400 absolute right-4 pointer-events-none" />
                    </div>
                  </div>

                  {/* Pickup Date Field */}
                  <div className="flex flex-col items-start px-4 py-2 border-b md:border-b-0 md:border-r border-white/10 w-full">
                    <DatePicker
                      value={pickupInput}
                      onChange={setPickupInput}
                      label="Pickup Date"
                      placeholder="Select Date"
                    />
                  </div>

                  {/* Return Date Field */}
                  <div className="flex flex-col items-start px-4 py-2 w-full">
                    <DatePicker
                      value={returnInput}
                      onChange={setReturnInput}
                      label="Return Date"
                      placeholder="Select Date"
                      minDate={pickupInput}
                    />
                  </div>

                  {/* Button Field */}
                  <div className="w-full">
                    <button
                      type="submit"
                      className="w-full bg-gold hover:bg-gold-hover text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold/20"
                    >
                      <span>Find Gear</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>

                {/* Subtext info under Form */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5 text-[11px] text-brand-400">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real-time Availability</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Pay Online or at Store</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Secure Payments</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. BRANDS SECTION ── */}
      <section id="brands" className="bg-surface-secondary text-foreground py-10 border-b border-border relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400">Trusted Gear. Top Brands.</span>
            </div>
            
            {/* Rotating Infinite Marquee Container with Fading Edge Masks */}
            <div className="relative flex-1 overflow-hidden w-full max-w-4xl py-2 flex [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
              <div className="flex min-w-full justify-around shrink-0 items-center gap-16 animate-marquee py-2 select-none">
                <span className="text-2xl font-extrabold tracking-tighter text-brand-900">SONY</span>
                <span className="text-2xl font-bold tracking-tight text-brand-900 font-serif">Canon</span>
                <span className="text-2xl font-extrabold italic text-brand-900">Nikon</span>
                <span className="text-2xl font-bold tracking-widest text-brand-900">FUJIFILM</span>
                <span className="text-2xl font-medium tracking-tight text-brand-900">TAMRON</span>
                <span className="text-2xl font-semibold tracking-wide text-brand-900">SIGMA</span>
              </div>
              <div className="flex min-w-full justify-around shrink-0 items-center gap-16 animate-marquee py-2 select-none" aria-hidden="true">
                <span className="text-2xl font-extrabold tracking-tighter text-brand-900">SONY</span>
                <span className="text-2xl font-bold tracking-tight text-brand-900 font-serif">Canon</span>
                <span className="text-2xl font-extrabold italic text-brand-900">Nikon</span>
                <span className="text-2xl font-bold tracking-widest text-brand-900">FUJIFILM</span>
                <span className="text-2xl font-medium tracking-tight text-brand-900">TAMRON</span>
                <span className="text-2xl font-semibold tracking-wide text-brand-900">SIGMA</span>
              </div>
            </div>

            <Link href="/cameras" className="shrink-0 text-sm font-semibold text-brand-900 dark:text-brand-300 flex items-center gap-1 hover:gap-2 transition-all duration-300">
              <span>View all brands</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. RENT WHAT YOU NEED (CATEGORIES) ── */}
      <section className="py-24 bg-surface text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Rent What You Need</h2>
              <p className="text-brand-500 dark:text-brand-400 text-sm sm:text-base">From camera bodies to lenses and accessories, we&apos;ve got you covered.</p>
            </div>
            <Link href="/cameras" className="text-sm font-bold text-brand-900 dark:text-brand-300 flex items-center gap-1 hover:gap-2 transition-all duration-300">
              <span>View all gear</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            
            {/* Category Card: Camera Bodies */}
            <Link href="/cameras?category=camera_body" className="group flex flex-col bg-card rounded-3xl p-6 border border-border shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-[4/3] w-full flex items-center justify-center overflow-hidden bg-surface-secondary rounded-2xl mb-6 p-4">
                <img
                  src="/camera_body.png"
                  alt="Camera Body"
                  className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-bold text-base text-foreground">Camera Bodies</h3>
              <span className="text-xs text-brand-500 dark:text-brand-400 flex items-center gap-1 mt-2 group-hover:text-gold transition-colors duration-300">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>

            {/* Category Card: Lenses */}
            <Link href="/cameras?category=lens" className="group flex flex-col bg-card rounded-3xl p-6 border border-border shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-[4/3] w-full flex items-center justify-center overflow-hidden bg-surface-secondary rounded-2xl mb-6 p-4">
                <img
                  src="/camera_lens.png"
                  alt="Camera Lenses"
                  className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-bold text-base text-foreground">Lenses</h3>
              <span className="text-xs text-brand-500 dark:text-brand-400 flex items-center gap-1 mt-2 group-hover:text-gold transition-colors duration-300">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>

            {/* Category Card: Gimbals */}
            <Link href="/cameras?category=accessory" className="group flex flex-col bg-card rounded-3xl p-6 border border-border shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-[4/3] w-full flex items-center justify-center overflow-hidden bg-surface-secondary rounded-2xl mb-6 p-4">
                <img
                  src="/camera_gimbal.png"
                  alt="Stabilizer Gimbals"
                  className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-bold text-base text-foreground">Gimbals</h3>
              <span className="text-xs text-brand-500 dark:text-brand-400 flex items-center gap-1 mt-2 group-hover:text-gold transition-colors duration-300">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>

            {/* Category Card: Flashes */}
            <Link href="/cameras?category=accessory" className="group flex flex-col bg-card rounded-3xl p-6 border border-border shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-[4/3] w-full flex items-center justify-center overflow-hidden bg-surface-secondary rounded-2xl mb-6 p-4">
                <img
                  src="/camera_flash.png"
                  alt="Camera Hotshoe Flashes"
                  className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-bold text-base text-foreground">Flashes</h3>
              <span className="text-xs text-brand-500 dark:text-brand-400 flex items-center gap-1 mt-2 group-hover:text-gold transition-colors duration-300">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>

            {/* Category Card: Accessories */}
            <Link href="/cameras?category=accessory" className="group flex flex-col bg-card rounded-3xl p-6 border border-border shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-[4/3] w-full flex items-center justify-center overflow-hidden bg-surface-secondary rounded-2xl mb-6 p-4">
                <img
                  src="/camera_backpack.png"
                  alt="Camera Backpacks & Accessories"
                  className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-bold text-base text-foreground">Accessories</h3>
              <span className="text-xs text-brand-500 dark:text-brand-400 flex items-center gap-1 mt-2 group-hover:text-gold transition-colors duration-300">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>

          </div>
        </div>
      </section>

      {/* ── 4. PROCESS ROADMAP ── */}
      <section className="py-24 bg-surface-secondary text-foreground border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-2 mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Simple. Transparent. Hassle-free.</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">How It Works</h2>
          </div>

          {/* Timeline Process flex */}
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-6 max-w-6xl mx-auto">
            
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center text-center relative z-10">
              <div className="h-16 w-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold mb-6 shadow-md transition-transform duration-500 hover:scale-110">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-foreground">1. Choose Gear</h3>
              <p className="text-xs text-brand-500 dark:text-brand-400 mt-2 max-w-[200px]">Browse and select the gear you need.</p>
            </div>

            {/* Dotted Connection Line 1 */}
            <div className="hidden lg:block h-[1px] w-20 border-t-2 border-dashed border-border mt-[-3rem]" />

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center text-center relative z-10">
              <div className="h-16 w-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold mb-6 shadow-md transition-transform duration-500 hover:scale-110">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-foreground">2. Pick Dates</h3>
              <p className="text-xs text-brand-500 dark:text-brand-400 mt-2 max-w-[200px]">Select your pickup and return dates.</p>
            </div>

            {/* Dotted Connection Line 2 */}
            <div className="hidden lg:block h-[1px] w-20 border-t-2 border-dashed border-border mt-[-3rem]" />

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center text-center relative z-10">
              <div className="h-16 w-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold mb-6 shadow-md transition-transform duration-500 hover:scale-110">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-foreground">3. Book & Pay</h3>
              <p className="text-xs text-brand-500 dark:text-brand-400 mt-2 max-w-[200px]">Pay online or choose pay at store.</p>
            </div>

            {/* Dotted Connection Line 3 */}
            <div className="hidden lg:block h-[1px] w-20 border-t-2 border-dashed border-border mt-[-3rem]" />

            {/* Step 4 */}
            <div className="flex-1 flex flex-col items-center text-center relative z-10">
              <div className="h-16 w-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold mb-6 shadow-md transition-transform duration-500 hover:scale-110">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-foreground">4. Pickup & Create</h3>
              <p className="text-xs text-brand-500 dark:text-brand-400 mt-2 max-w-[200px]">Pick up from our store and bring your vision to life.</p>
            </div>

            {/* Dotted Connection Line 4 */}
            <div className="hidden lg:block h-[1px] w-20 border-t-2 border-dashed border-border mt-[-3rem]" />

            {/* Step 5 */}
            <div className="flex-1 flex flex-col items-center text-center relative z-10">
              <div className="h-16 w-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold mb-6 shadow-md transition-transform duration-500 hover:scale-110">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-base text-foreground">5. Return & Relax</h3>
              <p className="text-xs text-brand-500 dark:text-brand-400 mt-2 max-w-[200px]">Return on time & get your deposit back.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. CREATOR STORIES / TESTIMONIALS ── */}
      <section className="py-24 bg-[#050508] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Loved by <br />
                200+ Creators
              </h2>
              
              {/* Star Rating Info */}
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                ))}
                <span className="text-sm font-semibold ml-2">4.9/5 from 200+ reviews</span>
              </div>

              {/* Ava overlaps */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-3.5 overflow-hidden">
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-brand-950 object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop"
                    alt="User portrait"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-brand-950 object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop"
                    alt="User portrait"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-brand-950 object-cover"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&fit=crop"
                    alt="User portrait"
                  />
                  <img
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-brand-950 object-cover"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&fit=crop"
                    alt="User portrait"
                  />
                </div>
                <p className="text-xs text-brand-300 max-w-[200px] leading-relaxed">
                  Join 200+ photographers, filmmakers & creators who trust CamRents.
                </p>
              </div>
            </div>

            {/* Right Interactive Cards Row */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row gap-4 h-[380px]">
              {STORIES.map((story, i) => (
                <div
                  key={story.title}
                  className="group relative flex-1 hover:flex-[1.8] rounded-3xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer shadow-lg"
                >
                  <img
                    src={story.image}
                    alt={story.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/20 to-transparent" />
                  
                  {/* Card text content */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-extrabold text-lg text-white leading-tight">{story.title}</h3>
                    <p className="text-[11px] text-brand-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {story.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── 6. CALL TO ACTION / STOREFRONT GRID ── */}
      <section className="py-20 bg-[#050508] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-brand-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
            {/* Ambient gold glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

            {/* Storefront Image */}
            <div className="md:col-span-4 rounded-2xl overflow-hidden aspect-[4/3] w-full shadow-lg border border-white/5">
              <img
                src="/storefront.png"
                alt="CamRents storefront counter interior"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center Content */}
            <div className="md:col-span-5 text-left space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Ready to create something unforgettable?
              </h2>
              <p className="text-sm text-brand-300 leading-relaxed">
                Book your gear today and turn your ideas into real moments.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/cameras"
                  className="bg-gold hover:bg-gold-hover text-black font-bold py-3 px-6 rounded-full text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-gold/10"
                >
                  <span>Explore Gear</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="border border-white/10 hover:bg-white/5 text-white font-semibold py-3 px-6 rounded-full text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="h-3 w-3 fill-white text-white" />
                  <span>How it Works</span>
                </Link>
              </div>
            </div>

            {/* Right Map/Temple Card */}
            <div className="md:col-span-3 bg-[#050508]/60 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-gold">
                  <MapPin className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Visit Our Store</span>
                </div>
                <p className="text-[11px] text-brand-300 leading-relaxed font-semibold">
                  CamRents, Kuriachira,<br />
                  Thrissur, Kerala 680006
                </p>
                <a
                  href="https://maps.google.com/?q=CamRents+Kuriachira+Thrissur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-white hover:text-gold flex items-center gap-1 transition-colors duration-300"
                >
                  <span>View on Map</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>

              {/* Temple Landmark Thumbnail */}
              <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md">
                <img
                  src="/temple_landmark.png"
                  alt="Vadakkumnathan Temple Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 7. FOOTER VALUE FEATURES BAR ── */}
      <section className="bg-[#050508] border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            
            <div className="flex flex-col items-start space-y-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <Camera className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Premium Gear</h4>
              <p className="text-[10px] text-brand-400 leading-relaxed">Top brands. Latest models.</p>
            </div>

            <div className="flex flex-col items-start space-y-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Well Maintained</h4>
              <p className="text-[10px] text-brand-400 leading-relaxed">Quality checked after every rental.</p>
            </div>

            <div className="flex flex-col items-start space-y-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <Calendar className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Flexible Rentals</h4>
              <p className="text-[10px] text-brand-400 leading-relaxed">Daily, weekly or custom plans.</p>
            </div>

            <div className="flex flex-col items-start space-y-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <MapPin className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Easy & Local</h4>
              <p className="text-[10px] text-brand-400 leading-relaxed">Pickup from our store in Thrissur.</p>
            </div>

            <div className="flex flex-col items-start space-y-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <CreditCard className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-xs text-white uppercase tracking-wider">Secure Payments</h4>
              <p className="text-[10px] text-brand-400 leading-relaxed">100% safe transactions via Razorpay.</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
