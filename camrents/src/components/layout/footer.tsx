import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-brand-950">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="text-xl font-bold text-white">
              Cam<span className="text-accent">Rents</span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-400">
              Premium camera rentals in Thrissur, Kerala. High-end Sony, Canon, Nikon, and Fujifilm gear for creators who demand the best.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">Navigate</h3>
            <div className="flex flex-col gap-3">
              {[
                { href: "/cameras", label: "Browse Catalog" },
                { href: "/how-it-works", label: "How It Works" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-brand-500 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">Contact</h3>
            <div className="flex flex-col gap-3 text-sm text-brand-500">
              <span>Thrissur, Kerala, India</span>
              <a href="tel:+919999999999" className="transition-colors duration-300 hover:text-white">
                +91 99999 99999
              </a>
              <a href="https://wa.me/919999999999" target="_blank" className="transition-colors duration-300 hover:text-white">
                WhatsApp Us
              </a>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">Hours</h3>
            <div className="flex flex-col gap-2 text-sm text-brand-500">
              <span>Mon – Sat: 9 AM – 8 PM</span>
              <span>Sun: 10 AM – 6 PM</span>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/5 pt-8 text-center text-xs text-brand-600">
          © {new Date().getFullYear()} CamRents Thrissur. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
