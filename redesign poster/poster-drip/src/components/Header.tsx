"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import SkiperToggle from "./SkiperToggle";
import { sanitizeSearch } from "@/lib/data";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [q, setQ] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { count } = useCart();
  const router = useRouter();

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const clean = sanitizeSearch(q);
    if (!clean) return;
    router.push(`/search?q=${encodeURIComponent(clean)}`);
    setShowSearch(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="bg-black dark:bg-zinc-950 text-white text-center text-[12px] lg:text-[13px] tracking-wide py-2.5 px-4">
        Free Shipping on Prepaid Orders Above ₹250
      </div>

      <div className="max-w-[1680px] mx-auto px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-[64px] lg:h-[72px] gap-4">
          <nav className="hidden lg:flex items-center gap-6 text-[14px] font-medium">
            <Link href="/" className="hover:opacity-70">Home</Link>
            <div className="relative group">
              <button className="flex items-center gap-1 py-2">Posters <span className="text-xs">▾</span></button>
              <div className="absolute left-0 top-full hidden group-hover:block group-focus-within:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl p-4 min-w-[720px] grid grid-cols-4 gap-6 text-[13px] z-10">
                <div><div className="font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Movies</div><ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400"><li><Link className="hover:text-black dark:hover:text-white font-medium" href="/collections/tamil-cinema">Tamil Movies</Link></li><li><Link className="hover:text-black dark:hover:text-white font-medium" href="/collections/telugu-cinema">Telugu</Link></li><li><Link className="hover:text-black dark:hover:text-white font-medium" href="/collections/hollywood-cinema">Hollywood</Link></li><li><Link className="hover:text-black dark:hover:text-white font-medium" href="/collections/web-series">Web Series</Link></li></ul></div>
                <div><div className="font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Motivation</div><ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400"><li><Link className="hover:text-black dark:hover:text-white font-medium" href="/collections/gym-posters">Gym</Link></li><li><Link className="hover:text-black dark:hover:text-white font-medium" href="/collections/aesthetic-collections">Qoutes</Link></li></ul>
                  <div className="font-semibold mt-4 mb-2 text-zinc-900 dark:text-zinc-100">Sports</div><ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400"><li><Link href="/collections/cricket-collections" className="hover:text-black dark:hover:text-white font-medium">Cricket</Link></li><li><Link href="/collections/football-collection" className="hover:text-black dark:hover:text-white font-medium">Football</Link></li><li><Link href="/collections/f1-collections" className="hover:text-black dark:hover:text-white font-medium">F1</Link></li></ul></div>
                <div><div className="font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Comics</div><ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400"><li><Link href="/collections/dc-posters" className="hover:text-black dark:hover:text-white font-medium">DC Comic</Link></li><li><Link href="/collections/marvel-posters" className="hover:text-black dark:hover:text-white font-medium">Marvel</Link></li></ul>
                  <div className="font-semibold mt-4 mb-2 text-zinc-900 dark:text-zinc-100">More</div><ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400"><li><Link href="/collections/anime-posters" className="hover:text-black dark:hover:text-white font-medium">Anime</Link></li><li><Link href="/collections/god" className="hover:text-black dark:hover:text-white font-medium">God</Link></li><li><Link href="/collections/8-split-panel" className="hover:text-black dark:hover:text-white font-medium">3 Split Panel</Link></li></ul></div>
                <div><div className="font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Custom</div><ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400"><li><Link href="/collections/custom-collection" className="hover:text-black dark:hover:text-white font-medium">Custom Collection</Link></li><li><Link href="/collections/single-poster-customize" className="hover:text-black dark:hover:text-white font-medium">Single Poster</Link></li><li><Link href="/collections/frames" className="hover:text-black dark:hover:text-white font-medium">Frame</Link></li></ul></div>
              </div>
            </div>
            <div className="relative group"><button className="flex items-center gap-1 py-2">Custom <span className="text-xs">▾</span></button>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white dark:bg-zinc-900 border dark:border-zinc-800 shadow-xl rounded-xl p-3 min-w-[200px] text-[13px] space-y-1.5 text-zinc-600 dark:text-zinc-400 z-10"><Link className="block hover:text-black dark:hover:text-white" href="/collections/custom-collection">Custom Collection</Link><Link className="block hover:text-black dark:hover:text-white" href="/collections/single-poster-customize">Single Poster Customize</Link><Link className="block hover:text-black dark:hover:text-white" href="/collections/frames">Frame</Link></div>
            </div>
            <Link href="/collections/frames" className="hover:opacity-70">Frames</Link>
            <Link href="/pages/contact" className="hover:opacity-70">Contact</Link>
          </nav>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 -ml-2" aria-label="Open menu" aria-expanded={mobileOpen}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h16M3 11h16M3 16h16" /></svg>
          </button>

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="https://posterdrip.in/cdn/shop/files/PD_LOGO_e64d00da-57e7-46a7-b3ee-23f1c7322104.png?v=1783427076&width=600" alt="Poster Drip" className="h-7 lg:h-8 w-auto object-contain" width={120} height={32} />
          </Link>

          <div className="flex items-center gap-1 lg:gap-2">
            <SkiperToggle variant="circle" start="center" />
            <button onClick={() => setShowSearch(v => !v)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full dark:text-zinc-200" aria-label="Search">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="8" cy="8" r="6" /><path d="M12.5 12.5 16 16" /></svg>
            </button>
            <Link href="/pages/contact" className="hidden lg:inline-flex text-[14px] font-semibold px-3 py-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">Log in</Link>
            <a href="https://www.instagram.com/posterdrip.in/?hl=en" target="_blank" rel="noreferrer" className="hidden lg:inline-flex p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
            <Link href="/cart" className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full dark:text-zinc-200" aria-label={`Cart with ${count} items`}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h14l-1.2 9H4.2z" /><path d="M7 5V3.5a3 3 0 0 1 6 0V5" /></svg>
              <span className="absolute -top-0.5 -right-0.5 bg-black dark:bg-white dark:text-black text-white text-[10px] leading-none min-w-[16px] h-[16px] grid place-items-center rounded-full px-1" aria-hidden>{count}</span>
            </Link>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-zinc-200 py-3 text-[14px] font-medium">
            <Link className="block py-2" href="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link className="block py-2" href="/collections/tamil-cinema" onClick={() => setMobileOpen(false)}>Tamil Movies</Link>
            <Link className="block py-2" href="/collections/telugu-cinema" onClick={() => setMobileOpen(false)}>Telugu</Link>
            <Link className="block py-2" href="/collections/hollywood-cinema" onClick={() => setMobileOpen(false)}>Hollywood</Link>
            <Link className="block py-2" href="/collections/anime-posters" onClick={() => setMobileOpen(false)}>Anime</Link>
            <Link className="block py-2" href="/collections/gym-posters" onClick={() => setMobileOpen(false)}>Gym</Link>
            <Link className="block py-2" href="/collections/frames" onClick={() => setMobileOpen(false)}>Frames</Link>
            <Link className="block py-2" href="/pages/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
          </div>
        )}

        {showSearch && (
          <form onSubmit={submitSearch} className="pb-3 flex gap-2">
            <input
              value={q}
              onChange={e => setQ(e.target.value.slice(0, 50))}
              type="search"
              placeholder="Search posters, movies, artists..."
              className="flex-1 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 rounded-full px-4 py-2.5 text-[14px] focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              maxLength={50}
            />
            <button type="submit" className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white hover:bg-black dark:hover:bg-zinc-100 rounded-full px-5 text-sm font-bold">Search</button>
            <button type="button" onClick={() => setShowSearch(false)} className="text-sm px-3 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white font-medium">Close</button>
          </form>
        )}
      </div>
    </header>
  );
}
