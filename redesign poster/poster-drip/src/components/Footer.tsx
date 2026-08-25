"use client";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [honey, setHoney] = useState("");
  const lastSubmit = useState<number>(0)[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honey) return; // honeypot
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      setMsg("Please enter a valid email.");
      return;
    }
    // rate limit client side
    const now = Date.now();
    // @ts-expect-error
    if (window.__lastNL && now - (window.__lastNL as number) < 30000) { setMsg("Please wait before subscribing again."); return; }
    // @ts-expect-error
    window.__lastNL = now;
    setMsg("Thanks - you're on the list. (Demo - backend pending)");
    setEmail("");
    setTimeout(() => setMsg(null), 4000);
  };

  return (
    <footer className="bg-[#0a0a0a] text-white mt-10">
      <div className="max-w-[1680px] mx-auto px-4 lg:px-8 py-8 lg:py-10">
        <div className="grid lg:grid-cols-[1.4fr_0.8fr_1fr] gap-8">
          <div>
            <Link href="/" className="inline-block bg-white rounded px-2 py-1">
              <img src="https://posterdrip.in/cdn/shop/files/PD_LOGO_e64d00da-57e7-46a7-b3ee-23f1c7322104.png?v=1783427076&width=600" alt="Poster Drip" className="h-7 w-auto" width={120} height={28} loading="lazy" />
            </Link>
            <p className="text-[13px] leading-relaxed text-zinc-300 mt-3 max-w-md">Premium posters &amp; wall art delivered to your door. Anime, Sports, Aesthetic, Custom &amp; Bulk orders, We&apos;ve got your walls covered.</p>
            <div className="text-[13px] text-zinc-300 mt-4 space-y-1"><div>📍 India</div><div>📧 Email: posterdrip.in@gmail.com</div><div>💬 WhatsApp: +91 94933 44060</div></div>
          </div>
          <div>
            <h3 className="text-[13px] font-semibold tracking-wide uppercase mb-3">Quick links</h3>
            <ul className="space-y-2 text-[13px] text-zinc-300">
              <li><Link className="hover:text-white" href="/">Home</Link></li>
              <li><Link className="hover:text-white" href="/collections">Posters</Link></li>
              <li><Link className="hover:text-white" href="/collections/custom-collection">Custom</Link></li>
              <li><Link className="hover:text-white" href="/collections/frames">Frames</Link></li>
              <li><Link className="hover:text-white" href="/pages/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-semibold tracking-wide uppercase mb-3">Get Exclusive Poster Drops First</h3>
            <form onSubmit={submit} className="flex gap-2" noValidate>
              <input type="text" value={honey} onChange={e => setHoney(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value.slice(0, 254))}
                required
                placeholder="Email"
                className="flex-1 bg-white text-black rounded-full px-4 py-2.5 text-[13px] placeholder:text-zinc-500 focus:outline-none"
                maxLength={254}
              />
              <button className="bg-white text-black rounded-full px-5 py-2.5 text-[13px] font-semibold hover:bg-zinc-100">Subscribe</button>
            </form>
            {msg && <p className="text-[12px] text-emerald-300 mt-2" role="status">{msg}</p>}
            {!msg && <p className="text-[11px] font-medium text-zinc-400 mt-2">Demo - backend pending. No email stored.</p>}
            <a href="https://www.instagram.com/posterdrip.in/?hl=en" target="_blank" rel="noreferrer" className="inline-flex mt-4 w-8 h-8 rounded-full bg-white text-black place-items-center justify-center">◎</a>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col lg:flex-row gap-3 lg:items-center justify-between text-[11px] text-zinc-400">
          <div>© 2026, <Link href="/" className="underline">Poster Drip</Link> <span className="hidden lg:inline">· Fan art for fans - not affiliated unless stated. Contact: posterdrip.in@gmail.com</span></div>
          <div className="flex flex-wrap gap-3">
            <Link href="/policies/privacy-policy" className="hover:text-white">Privacy policy</Link>
            <Link href="/policies/refund-policy" className="hover:text-white">Refund policy</Link>
            <Link href="/policies/terms-of-service" className="hover:text-white">Terms of service</Link>
            <Link href="/policies/shipping-policy" className="hover:text-white">Shipping policy</Link>
            <Link href="/policies/contact-information" className="hover:text-white">Contact information</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
