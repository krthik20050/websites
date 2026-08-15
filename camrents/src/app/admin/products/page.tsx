"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IMAGES } from "@/lib/images";
import { formatPrice } from "@/lib/format";
import { getAllProducts } from "@/lib/actions/products";
import type { ProductRow } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAllProducts();
        if (!cancelled) setProducts(data);
      } catch { /* ignore */ }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = products.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q);
  });

  return (
    <div className="p-4 lg:pl-52">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-brand-950">Products</h1>
        <Button asChild size="sm"><Link href="/admin/products/new">+ Add</Link></Button>
      </div>
      <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-secondary" />)}</div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((p) => {
            const imgSrc = IMAGES[p.slug as keyof typeof IMAGES] ?? IMAGES.placeholder;
            const img = Array.isArray(imgSrc) ? imgSrc[0] : imgSrc;
            return (
              <Card key={p.id}>
                <CardContent className="flex items-center gap-3 p-3">
                  <img src={img} alt={p.model} className="h-12 w-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-brand-950 truncate">{p.brand} {p.model}</p>
                      {!p.isActive && <Badge variant="secondary" className="text-xs">Inactive</Badge>}
                    </div>
                    <p className="text-xs text-brand-400">{formatPrice(p.dailyRateCents)}/day · Qty: {p.totalQuantity}</p>
                  </div>
                  <Link href={`/admin/products/${p.id}/edit`}><Button variant="ghost" size="sm">Edit</Button></Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card><CardContent className="py-8 text-center"><p className="text-sm text-brand-400">No products found</p></CardContent></Card>
      )}
    </div>
  );
}
