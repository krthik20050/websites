"use client";

import Link from "next/link";
import {
  Search,
  Calendar,
  CreditCard,
  ShoppingBag,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: "01",
    title: "Browse & Book",
    desc: "Browse our catalog of cameras, lenses, and accessories. Pick your gear, select your dates, and book online or choose Pay at Store.",
    icon: <Search className="h-6 w-6 text-gold" />,
  },
  {
    step: "02",
    title: "Confirm & Pay",
    desc: "Pay online via UPI (GPay, PhonePe) or choose to pay at our shop. You'll get a booking confirmation via WhatsApp and SMS.",
    icon: <CreditCard className="h-6 w-6 text-gold" />,
  },
  {
    step: "03",
    title: "Pickup at Shop",
    desc: "Visit our shop in Thrissur, show your booking number, pay the deposit (cash/UPI), and collect your gear. Quick and easy.",
    icon: <ShoppingBag className="h-6 w-6 text-gold" />,
  },
  {
    step: "04",
    title: "Return & Relax",
    desc: "Return the gear on time. We inspect it, release your deposit, and send you a PDF receipt. Optionally leave a review.",
    icon: <CheckCircle className="h-6 w-6 text-gold" />,
  },
];

const FAQS = [
  { q: "What do I need to bring for pickup?", a: "Bring a valid ID (Aadhaar/PAN), your booking number, and payment for the deposit. We accept cash and UPI at the counter." },
  { q: "How is the deposit calculated?", a: "Deposit amounts vary by product and are listed on each product page. It's refunded in full upon return if the gear is in the same condition." },
  { q: "Can I extend my rental?", a: "Yes! Contact us via WhatsApp or call us. We'll check availability and extend your booking if the dates are free." },
  { q: "What if I return late?", a: "Late returns incur a daily fee as per our late fee policy. We'll notify you via WhatsApp before your return date." },
  { q: "Do you deliver?", a: "Currently, all pickups and returns are at our shop in Thrissur. We're working on delivery options for the future." },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-[#050508] text-white min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-32 sm:px-6 sm:py-40 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles className="h-3.5 w-3.5" />
            Process
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Simple 4-Step{" "}
            <span className="font-cursive text-gold capitalize normal-case text-5xl sm:text-6xl tracking-normal block mt-1">
              Rental Process
            </span>
          </h1>
          <p className="mt-4 text-base text-brand-300 max-w-md mx-auto leading-relaxed">
            Renting cameras from CamRents is simple, fast, and transparent. Learn how to secure your gear.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <div key={s.step} className="bezel-outer group transition-all duration-500 hover:shadow-lg hover:shadow-gold/5">
              <div className="bezel-inner bg-card p-6 sm:p-8 transition-all duration-500 group-hover:bg-gold/5 flex flex-col h-full">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold border border-gold/20 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                  {s.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Step {s.step}</span>
                <h3 className="mt-2 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-3 text-sm text-brand-300 leading-relaxed flex-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 border-t border-white/5 pt-20">
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <HelpCircle className="h-5 w-5 text-gold" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bezel-outer transition-all duration-500 hover:shadow-lg hover:shadow-gold/5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 bezel-inner bg-card p-5 text-white">
                  <h3 className="text-sm font-semibold pr-4">{faq.q}</h3>
                  <span className="shrink-0 rounded-full bg-brand-900 p-2 text-brand-400 transition-transform duration-300 group-open:-rotate-180">
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <div className="bezel-inner bg-card px-5 pb-5 -mt-2">
                  <p className="text-sm text-brand-300 border-t border-white/5 pt-4 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-24 bg-brand-900/40 border border-white/5 rounded-[2rem] p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,184,0,0.06)_0%,transparent_60%)] pointer-events-none" />
          <h2 className="text-2xl font-extrabold text-white">Ready to get started?</h2>
          <p className="mt-2 text-sm text-brand-300 max-w-sm mx-auto leading-relaxed">Browse our catalog and reserve your camera or lens today.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 relative z-10">
            <Link
              href="/cameras"
              className="bg-gold hover:bg-gold-hover text-black font-bold py-3.5 px-7 rounded-full text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-gold/15"
            >
              <span>Browse Cameras</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/10 hover:bg-white/5 text-white font-semibold py-3.5 px-7 rounded-full text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              Contact via WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
