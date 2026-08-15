"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductCard } from "@/components/shared/product-card";
import { AvailabilityCalendar } from "@/components/shared/availability-calendar";
import { BestForSection } from "@/components/shared/best-for-section";
import { IMAGES } from "@/lib/images";
import { formatPrice, calcDays } from "@/lib/format";
import { getProductBySlug, getAllProducts } from "@/lib/actions/products";
import { checkAvailability, getBookedRanges } from "@/lib/actions/bookings";
import type { ProductRow } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ProductRow | null>(null);
  const [allProducts, setAllProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickup, setPickup] = useState("");
  const [retD, setRetD] = useState("");
  const [hasWaiver, setHasWaiver] = useState(false);
  const [bookedRanges, setBookedRanges] = useState<{ pickupDate: string; returnDate: string }[]>([]);

  const [availability, setAvailability] = useState<{ available: boolean; availableUnits: number } | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const p = await getProductBySlug(slug);
        if (!cancelled && p) {
          setProduct(p);
          const ranges = await getBookedRanges(p.id);
          if (!cancelled) setBookedRanges(ranges);
        }

        const all = await getAllProducts();
        if (!cancelled) setAllProducts(all);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (!product || !pickup || !retD) {
      setAvailability(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setCheckingAvailability(true);
      try {
        const res = await checkAvailability({
          productModelId: product.id,
          pickupDate: pickup,
          returnDate: retD,
        });
        if (!cancelled) {
          setAvailability({ available: res.available, availableUnits: res.availableUnits });
        }
      } catch (err) {
        console.error("Availability check error:", err);
      } finally {
        if (!cancelled) setCheckingAvailability(false);
      }
    })();

    return () => { cancelled = true; };
  }, [product, pickup, retD]);

  const price = useMemo(() => {
    if (!product || !pickup || !retD) return null;
    const days = calcDays(pickup, retD);
    const rental = product.dailyRateCents * days;
    const waiver = hasWaiver ? Math.round(rental * 0.1) : 0;
    return { days, rental, waiver, total: rental + waiver };
  }, [product, pickup, retD, hasWaiver]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const mount = (product.specs as any)?.mount;
    if (!mount || mount === "universal") return [];

    if (product.category === "camera_body") {
      return allProducts.filter(
        (p) => p.category === "lens" && (p.specs as any)?.mount === mount && p.slug !== product.slug
      );
    } else if (product.category === "lens") {
      return allProducts.filter(
        (p) => p.category === "camera_body" && (p.specs as any)?.mount === mount && p.slug !== product.slug
      );
    }
    return [];
  }, [product, allProducts]);

  const productImages = useMemo(() => {
    const src = IMAGES[slug as keyof typeof IMAGES] ?? [IMAGES.placeholder];
    return Array.isArray(src) ? src : [src];
  }, [slug]);

  const specs = product?.specs as Record<string, string> | null;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-[2rem] bg-surface-secondary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
        <p className="mt-2 text-brand-500">This camera may no longer be available.</p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/cameras">Back to Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#050508] text-white min-h-screen pt-36 pb-24 sm:pt-40 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-10 flex flex-wrap items-center gap-1 text-xs text-brand-400 animate-fade-in">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/cameras" className="transition-colors hover:text-white">Cameras</Link>
          <span className="mx-1">/</span>
          <span className="text-white truncate max-w-[200px]">{product.brand} {product.model}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          {/* Left: Image Gallery */}
          <div className="space-y-4 animate-fade-up">
            <div className="bezel-outer">
              <div className="bezel-inner relative overflow-hidden bg-white/5 aspect-[4/3]">
                <img
                  src={productImages[activeImage]}
                  alt={`${product.brand} ${product.model}`}
                  className="h-full w-full object-contain p-6 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105"
                />
                <Badge className="absolute top-4 left-4 text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-white border-white/15" variant="secondary">
                  {product.category === "camera_body" ? "Camera Body" : product.category === "lens" ? "Lens" : product.category === "kit" ? "Kit" : "Accessory"}
                </Badge>
              </div>
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 h-16 w-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === i ? "border-accent ring-1 ring-accent/30" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-6 animate-fade-up delay-200">
            <div>
              <span className="eyebrow bg-accent/10 text-accent border border-accent/20 mb-3 inline-block">{product.brand}</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{product.model}</h1>
              <p className="mt-3 text-sm sm:text-base text-brand-400 leading-relaxed">{product.description}</p>
            </div>

            <BestForSection
              specs={specs}
              description={product.description}
              brand={product.brand}
              model={product.model}
              category={product.category}
            />

            {/* Pricing Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 rounded-xl p-1">
                <TabsTrigger value="details" className="rounded-lg text-xs font-semibold py-2 text-brand-400 data-[state=active]:bg-accent data-[state=active]:text-brand-950 cursor-pointer">Details</TabsTrigger>
                <TabsTrigger value="specs" className="rounded-lg text-xs font-semibold py-2 text-brand-400 data-[state=active]:bg-accent data-[state=active]:text-brand-950 cursor-pointer">Specs</TabsTrigger>
                <TabsTrigger value="availability" className="rounded-lg text-xs font-semibold py-2 text-brand-400 data-[state=active]:bg-accent data-[state=active]:text-brand-950 cursor-pointer">Availability</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4 space-y-4">
                <Card className="border-white/10 bg-card">
                  <CardContent className="p-5 sm:p-6 space-y-3">
                    <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 pb-4 border-b border-white/5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white">
                        {formatPrice(product.dailyRateCents)}
                        <span className="text-sm font-normal text-brand-400">/day</span>
                      </span>
                    </div>
                    {[
                      { label: "Refundable Deposit", value: formatPrice(product.depositCents) },
                      { label: "Available Units", value: String(product.totalQuantity) },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between py-2 border-b border-white/5 text-sm">
                        <span className="text-brand-400">{row.label}</span>
                        <span className="font-medium text-white capitalize">{row.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="specs" className="mt-4">
                <Card className="border-white/10 bg-card">
                  <CardContent className="p-5 sm:p-6 space-y-2">
                    {specs && Object.keys(specs).length > 0 ? (
                      Object.entries(specs).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-white/5 text-sm">
                          <span className="text-brand-400 capitalize">{key.replace(/_/g, " ")}</span>
                          <span className="font-medium text-white capitalize">{val}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-brand-400 py-2">No specifications specified.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="availability" className="mt-4">
                <Card className="border-white/10 bg-card">
                  <CardContent className="p-5 sm:p-6">
                    <AvailabilityCalendar
                      bookedRanges={bookedRanges}
                      pickupDate={pickup}
                      returnDate={retD}
                      onPickupChange={setPickup}
                      onReturnChange={setRetD}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

          {/* Price Summary */}
          {price && (
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-5">
                <div className="flex justify-between text-sm">
                  <span>{price.days} day{price.days !== 1 ? "s" : ""} × {formatPrice(product.dailyRateCents)}</span>
                  <span>{formatPrice(price.rental)}</span>
                </div>
                {hasWaiver && (
                  <div className="mt-1 flex justify-between text-sm text-accent-dark">
                    <span>Damage waiver (10%)</span>
                    <span>{formatPrice(price.waiver)}</span>
                  </div>
                )}
                <div className="mt-3 flex justify-between border-t border-white/5 pt-3 font-bold text-base">
                  <span>Total</span>
                  <span>{formatPrice(price.total)}</span>
                </div>
                <p className="mt-1.5 text-xs text-brand-400">
                  + Refundable deposit of {formatPrice(product.depositCents)} at pickup
                </p>
              </CardContent>
            </Card>
          )}

          {/* Waiver */}
          <label className="flex items-center gap-3 text-sm text-brand-600 cursor-pointer group">
            <input
              type="checkbox"
              checked={hasWaiver}
              onChange={(e) => setHasWaiver(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            <span className="group-hover:text-foreground transition-colors">Add damage waiver (+10%, caps minor damage liability)</span>
          </label>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            {pickup && retD ? (
              <Button
                asChild={!!availability?.available}
                className="flex-1 font-semibold h-13 text-sm rounded-full bg-accent hover:bg-accent-dark transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
                disabled={checkingAvailability || !availability?.available}
              >
                {availability?.available ? (
                  <Link href={`/checkout?slug=${slug}&pickup=${pickup}&return=${retD}&waiver=${hasWaiver}`}>
                    Book Now — {formatPrice(price?.total || 0)}
                  </Link>
                ) : (
                  <span>Unavailable for selected dates</span>
                )}
              </Button>
            ) : (
              <Button className="flex-1 font-semibold h-13 text-sm rounded-full" disabled>
                Select Dates to Book
              </Button>
            )}
            <Button variant="outline" asChild className="h-13 rounded-full border-white/10 hover:bg-white/5">
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">
                <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 sm:mt-20 border-t border-white/5 pt-12 sm:pt-16">
          <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.04em] text-foreground">
            {product.category === "camera_body" ? "Compatible Lenses" : "Compatible Camera Bodies"}
          </h2>
          <p className="mt-2 text-sm text-brand-500">
            {product.category === "camera_body"
              ? `Lenses with the ${specs?.mount || "matching"} mount — build your kit`
              : `Cameras with the ${specs?.mount || "matching"} mount`}
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                brand={p.brand}
                model={p.model}
                dailyRateCents={p.dailyRateCents}
                depositCents={p.depositCents}
                description={p.description ?? ""}
                category={p.category}
                condition={p.condition ?? "good"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
}
