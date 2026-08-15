"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/shared/product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageLoading } from "@/components/shared/loading-spinner";
import type { ProductCategory } from "@/db/schema";
import { getAllProducts } from "@/lib/actions/products";
import type { ProductRow } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

const CATEGORIES: { label: string; value: ProductCategory | "all" }[] = [
  { label: "All Gear", value: "all" },
  { label: "Bodies", value: "camera_body" },
  { label: "Lenses", value: "lens" },
  { label: "Accessories", value: "accessory" },
];

const BRANDS = [
  { label: "All Brands", value: "all" },
  { label: "Sony", value: "sony" },
  { label: "Canon", value: "canon" },
  { label: "Nikon", value: "nikon" },
  { label: "Fujifilm", value: "fujifilm" },
  { label: "DJI", value: "dji" },
  { label: "Godox", value: "godox" },
];

export default function CamerasPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [brand, setBrand] = useState<string>("all");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAllProducts();
        if (!cancelled) setProducts(data);
      } catch {
        console.error("Failed to fetch products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [loading, products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (brand !== "all" && p.brand.toLowerCase() !== brand.toLowerCase()) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, category, brand, search]);

  if (loading) return <PageLoading />;

  return (
    <div className="bg-[#050508] text-white min-h-screen pt-36 pb-24 sm:pt-40 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="eyebrow bg-accent/10 text-accent border border-accent/20 mb-4 inline-block animate-fade-in">Catalog</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl animate-fade-up">Browse Rental Gear</h1>
          <p className="mt-3 text-brand-400 animate-fade-up delay-100">Rent premium camera equipment in Thrissur, Kerala. Find bodies, lenses, and accessories.</p>
        </div>

        <div className="mb-10">
          <div className="mb-6">
            <Input
              placeholder="Search by brand or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs bg-white/5 border-white/10 text-white placeholder:text-brand-500 focus-visible:ring-accent rounded-full"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-400">Category</span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] ${
                      category === c.value
                        ? "bg-accent text-black shadow-md shadow-accent/15"
                        : "bg-white/5 text-brand-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-6 w-px bg-white/5 hidden sm:block" />

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-400">Brand</span>
              <div className="flex flex-wrap gap-2">
                {BRANDS.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setBrand(b.value)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] ${
                      brand === b.value
                        ? "bg-accent text-black shadow-md shadow-accent/15"
                        : "bg-white/5 text-brand-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <div key={p.id} data-reveal style={{ opacity: 0, animationDelay: `${i * 50}ms` }}>
                <ProductCard
                  slug={p.slug}
                  brand={p.brand}
                  model={p.model}
                  dailyRateCents={p.dailyRateCents}
                  depositCents={p.depositCents}
                  description={p.description ?? ""}
                  category={p.category}
                  condition={p.condition ?? "good"}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No cameras found"
            description="Try adjusting your search or filters"
            action={{ label: "Clear Filters", onClick: () => { setSearch(""); setCategory("all"); setBrand("all"); } }}
          />
        )}

        <p className="mt-8 text-sm text-brand-500">
          Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
