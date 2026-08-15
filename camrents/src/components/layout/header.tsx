"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MapPin, User, ShoppingCart, Camera, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthNav } from "./auth-nav";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "bg-brand-950/80 backdrop-blur-md border-b border-white/5 py-4"
            : "bg-transparent py-6"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white transition-transform duration-300 group-hover:scale-105">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-none">
                Cam<span className="text-gold">Rents</span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.3em] text-brand-400 uppercase leading-none mt-1">
                Thrissur
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="/cameras?category=camera_body">Cameras</NavLink>
            <NavLink href="/cameras?category=lens">Lenses</NavLink>
            <NavLink href="/cameras?category=accessory">Accessories</NavLink>
            <NavLink href="/#brands">Brands</NavLink>
            <NavLink href="/how-it-works">How It Works</NavLink>
            <NavLink href="/contact">About Us</NavLink>
          </nav>

          {/* Actions / Right Side */}
          <div className="hidden items-center gap-6 md:flex">
            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs text-brand-300 hover:text-white transition-colors duration-300">
              <MapPin className="h-4 w-4 text-gold" />
              <span>Thrissur, Kerala</span>
            </div>

            {/* Profile / Auth */}
            <AuthNav />

            {/* Cart */}
            <Link
              href="/checkout"
              className="relative text-brand-300 hover:text-white transition-colors duration-300"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-brand-950">
                0
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-brand-950/98 backdrop-blur-lg transition-all duration-500 ease-in-out md:hidden",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8 px-6 text-center">
          <Link
            href="/cameras?category=camera_body"
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-bold text-white hover:text-gold transition-colors duration-300"
          >
            Cameras
          </Link>
          <Link
            href="/cameras?category=lens"
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-bold text-white hover:text-gold transition-colors duration-300"
          >
            Lenses
          </Link>
          <Link
            href="/cameras?category=accessory"
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-bold text-white hover:text-gold transition-colors duration-300"
          >
            Accessories
          </Link>
          <Link
            href="/#brands"
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-bold text-white hover:text-gold transition-colors duration-300"
          >
            Brands
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-bold text-white hover:text-gold transition-colors duration-300"
          >
            How It Works
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="text-2xl font-bold text-white hover:text-gold transition-colors duration-300"
          >
            About Us
          </Link>

          <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/10 pt-8 w-full max-w-xs">
            <div className="flex items-center gap-2 text-sm text-brand-300">
              <MapPin className="h-4 w-4 text-gold" />
              <span>Thrissur, Kerala</span>
            </div>
            <div className="flex flex-col items-center gap-4 mt-4 w-full">
              <AuthNav mobile={true} />
              <Link href="/checkout" onClick={() => setMenuOpen(false)} className="relative text-brand-300 hover:text-gold transition-colors duration-300 flex items-center gap-2 mt-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-sm font-semibold">View Cart</span>
                <span className="absolute -top-1.5 -right-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-brand-950">
                  0
                </span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative rounded-full px-4 py-2 text-sm font-medium text-brand-300 transition-colors duration-300 hover:text-white"
    >
      {children}
    </Link>
  );
}
