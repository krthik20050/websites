"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products as allProducts } from "@/lib/data";

export type CartItem = { handle: string; qty: number; variantId?: string; size?: string };

type CartCtx = {
  items: CartItem[];
  count: number;
  add: (handle: string, variantId?: string, size?: string) => void;
  remove: (handle: string, variantId?: string) => void;
  setQty: (handle: string, qty: number, variantId?: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pd_cart_v2");
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        // migration: old items without variantId -> default A5
        const migrated = parsed.map(it => {
          if (!it.variantId) {
            const p = allProducts.find(x => x.handle === it.handle);
            const v = p?.variants[0];
            return { ...it, variantId: v?.id ?? `${it.handle}-a5`, size: v?.size ?? "A5" };
          }
          return it;
        });
        setItems(migrated);
      } else {
        const legacy = localStorage.getItem("pd_cart");
        if (legacy) {
          const n = Number(legacy);
          if (n) setItems([{ handle: "poster-design-110-wall-art", qty: n, variantId: "poster-design-110-wall-art-a5", size: "A5" }]);
        }
      }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("pd_cart_v2", JSON.stringify(items)); } catch {}
  }, [items]);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const add = (handle: string, variantId?: string, size?: string) => setItems(prev => {
    const p = allProducts.find(x => x.handle === handle);
    const vid = variantId ?? p?.variants[0]?.id ?? `${handle}-a5`;
    const sz = size ?? p?.variants.find(v => v.id === vid)?.size ?? "A5";
    const ex = prev.find(x => x.handle === handle && x.variantId === vid);
    if (ex) return prev.map(x => x.handle === handle && x.variantId === vid ? { ...x, qty: Math.min(99, x.qty + 1) } : x);
    return [...prev, { handle, qty: 1, variantId: vid, size: sz }];
  });
  const remove = (handle: string, variantId?: string) => setItems(prev => prev.filter(p => variantId ? !(p.handle === handle && p.variantId === variantId) : p.handle !== handle));
  const setQty = (handle: string, qty: number, variantId?: string) => {
    if (qty <= 0) return remove(handle, variantId);
    setItems(prev => prev.map(p => (p.handle === handle && (!variantId || p.variantId === variantId)) ? { ...p, qty: Math.min(99, Math.max(1, qty)) } : p));
  };
  const clear = () => setItems([]);

  return <Ctx.Provider value={{ items, count, add, remove, setQty, clear }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart outside provider");
  return v;
}

// helper to get enriched cart lines with product data + price validation (never trust localStorage price)
export function useCartLines() {
  const { items } = useCart();
  return items.map(it => {
    const p = allProducts.find(x => x.handle === it.handle);
    if (!p) return { ...it, product: null as unknown as typeof p, variant: null, unitPrice: 0, lineTotal: 0 };
    const variant = it.variantId ? p.variants.find(v => v.id === it.variantId) ?? p.variants[0] : p.variants[0];
    const unitPrice = variant?.price ?? p.price;
    return { ...it, product: p, variant: variant ?? null, unitPrice, lineTotal: unitPrice * it.qty };
  }).filter(x => x.product);
}
