"use client";
import { useCart } from "@/components/CartProvider";
import { useState } from "react";
import type { Variant } from "@/lib/types";

export default function AddToCartButton({ handle, title, variants }: { handle: string; title: string; variants: Variant[] }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(variants[0]?.id ?? `${handle}-a5`);
  const selected = variants.find(v => v.id === selectedId) ?? variants[0];
  const price = selected?.price ?? 30;
  const compareAt = selected?.compareAt ?? 149;

  return (
    <div className="flex-1 flex flex-col gap-3">
      <fieldset className="flex flex-col gap-2">
        <legend className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">Size - <span className="font-normal text-zinc-600 dark:text-zinc-400">{selected?.size}</span> <span className="ml-1 font-bold">Rs. {price}</span>{compareAt && <span className="ml-1 text-zinc-500 dark:text-zinc-400 line-through font-normal">Rs. {compareAt}</span>}</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
          {variants.map(v => (
            <label key={v.id} className={`cursor-pointer rounded-full border px-3.5 py-2 text-[13px] font-semibold transition ${v.id === selectedId ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white" : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"} ${!v.available ? "opacity-40 cursor-not-allowed" : ""}`}>
              <input type="radio" name={`size-${handle}`} value={v.id} checked={v.id === selectedId} onChange={() => setSelectedId(v.id)} disabled={!v.available} className="sr-only" aria-label={`${v.size} Rs. ${v.price}`} />
              {v.size} <span className="ml-1 font-normal opacity-80">Rs. {v.price}</span>
            </label>
          ))}
        </div>
        <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Premium 300 GSM matte - Fan art, not official.</p>
      </fieldset>
      <button
        onClick={() => { add(handle, selected?.id, selected?.size); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
        className={`w-full lg:w-auto rounded-full px-8 py-3 text-sm font-bold tracking-wide border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 ${added ? "bg-emerald-700 dark:bg-emerald-600 text-white border-emerald-700 dark:border-emerald-600" : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white hover:bg-black dark:hover:bg-zinc-100"}`}
        aria-label={`Add ${title} ${selected?.size} to cart`}
      >
        {added ? "Added to cart ✓ - " : "Add to cart - "}Rs. {price}
      </button>
    </div>
  );
}
