"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { useState } from "react";

export default function ProductCard({ handle, title, image, price, compareAt, priority = false }: { handle: string; title: string; image: string; price: number; compareAt: number; priority?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <article className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col hover:shadow-md dark:hover:shadow-black/30 transition-shadow">
      <Link href={`/products/${handle}`} className="block relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {/* next/image needs https - cdn() already https */}
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1440px) 20vw, 16vw"
          className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
          priority={priority}
          unoptimized={false}
        />
        <span className="absolute bottom-2 left-2 bg-[#e11d48] text-white text-[11px] font-semibold tracking-wide px-2 py-1 rounded-full">Sale</span>
      </Link>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <Link href={`/products/${handle}`} className="text-[13px] leading-snug font-semibold line-clamp-2 min-h-[36px] text-zinc-900 dark:text-zinc-100 hover:underline decoration-zinc-400 dark:decoration-zinc-500 underline-offset-2">
          {title}
        </Link>
        <div className="text-[12px] leading-none"><span className="text-zinc-600 dark:text-zinc-400 line-through">Rs. {compareAt}.00</span> <span className="font-bold text-zinc-900 dark:text-zinc-100">From Rs. {price}.00 INR</span></div>
        <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Unit price / per</div>
        <button
          onClick={() => { add(handle); setAdded(true); setTimeout(() => setAdded(false), 1200); }}
          className={`mt-1 w-full rounded-full py-2.5 text-[12px] font-bold tracking-wide border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 ${added ? "bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-700 dark:border-emerald-600" : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white hover:bg-black dark:hover:bg-zinc-100 hover:border-black dark:hover:border-zinc-100"}`}
          aria-label={`Add ${title} to cart`}
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
