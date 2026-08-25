import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { collections, getCollection, getProductsByCollection, clampPrice, sanitizeSearch } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;
export async function generateStaticParams() {
  return collections.map(c => ({ handle: c.handle }));
}

type Props = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  const c = getCollection(handle);
  if (!c) return { title: "Collection not found" };
  return { title: `${c.title} - ${c.productCount} posters` };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { handle } = await params;
  const sp = await searchParams;
  const c = getCollection(handle);
  if (!c) return notFound();

  // sanitize inputs (security)
  const q = sanitizeSearch(sp.q ?? "");
  const sort = (sp.sort ?? "featured") as string;
  const page = Math.max(1, Math.min(20, Number(sp.page ?? 1) || 1));
  const min = clampPrice(sp.min, null);
  const max = clampPrice(sp.max, null);
  const perPage = 20;

  let list = getProductsByCollection(handle);

  // search filter
  if (q) list = list.filter(p => p.title.toLowerCase().includes(q.toLowerCase()));

  // price filter (server-side, validated)
  if (min !== null) list = list.filter(p => p.price >= min);
  if (max !== null) list = list.filter(p => p.price <= max);
  if (min !== null && max !== null && min > max) list = []; // invalid range -> empty

  // sort
  if (sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === "za") list = [...list].sort((a, b) => b.title.localeCompare(a.title));
  else if (sort === "price_low") list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === "price_high") list = [...list].sort((a, b) => b.price - a.price);

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const curPage = Math.min(page, totalPages);
  const start = (curPage - 1) * perPage;
  const pageItems = list.slice(start, start + perPage);

  const buildHref = (over: Record<string, string | undefined>) => {
    const u = new URLSearchParams();
    if ((over.q ?? q)) u.set("q", over.q ?? q);
    if ((over.sort ?? sort) !== "featured") u.set("sort", over.sort ?? sort);
    if ((over.min ?? (min !== null ? String(min) : ""))) u.set("min", over.min ?? String(min));
    if ((over.max ?? (max !== null ? String(max) : ""))) u.set("max", over.max ?? String(max));
    // clean empty
    if (!u.get("q")) u.delete("q");
    if (!u.get("min")) u.delete("min");
    if (!u.get("max")) u.delete("max");
    if (u.get("sort") === "featured") u.delete("sort");
    // page
    const p = over.page ?? String(curPage);
    if (p !== "1") u.set("page", p);
    else u.delete("page");
    const qs = u.toString();
    return `/collections/${handle}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="w-full">
      {/* Hero */}
      {c.heroImage && (
        <div className="relative bg-zinc-100">
          <div className="max-w-[1680px] mx-auto">
            <div className="relative h-[280px] lg:h-[420px] overflow-hidden">
              <Image src={c.heroImage} alt={`${c.title} hero`} fill priority sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-0 right-0">
                <div className="max-w-[1680px] mx-auto px-4 lg:px-8">
                  <h1 className="text-white text-[28px] lg:text-[36px] font-bold tracking-tight drop-shadow">Collection: {c.title}</h1>
                  <p className="text-white/90 text-[13px] lg:text-[14px] mt-1 max-w-xl">{c.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trust */}
      <div className="border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-[1680px] mx-auto px-4 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 py-3.5 text-[12.5px] lg:text-[13px] text-zinc-900 dark:text-zinc-100">
          <div className="flex items-center gap-2.5"><span className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 grid place-items-center text-xs">✓</span><span><b>Free Shipping</b> <span className="text-zinc-600 dark:text-zinc-400 hidden sm:inline font-medium">on Prepaid orders Above 249/-</span></span></div>
          <div className="flex items-center gap-2.5"><span className="w-7 h-7 rounded-full bg-zinc-900 text-white grid place-items-center text-xs">₹</span><span><b>Best Prices</b></span></div>
          <div className="flex items-center gap-2.5"><span className="w-7 h-7 rounded-full bg-zinc-900 text-white grid place-items-center text-xs">↺</span><span><b>No exchange</b></span></div>
          <div className="flex items-center gap-2.5"><span className="w-7 h-7 rounded-full bg-zinc-900 text-white grid place-items-center text-xs">★</span><span><b>Rated 4.7/5</b></span></div>
        </div>
      </div>

      <div className="max-w-[1680px] mx-auto px-4 lg:px-8 pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className={c.heroImage ? "text-[20px] font-semibold hidden" : "text-[26px] lg:text-[32px] font-bold tracking-tight"}>Collection: {c.title}</h1>
          {!c.heroImage && <h1 className="text-[26px] lg:text-[32px] font-bold tracking-tight">Collection: {c.title}</h1>}
          <div className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">{total} products • Page {curPage} of {totalPages}</div>
        </div>
      </div>

      <div className="max-w-[1680px] mx-auto px-4 lg:px-8 mt-5 flex gap-6 lg:gap-8 items-start">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[280px] shrink-0 sticky top-[72px] h-[calc(100dvh-72px)] overflow-auto py-1 pr-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold tracking-wide uppercase">Filter:</h2>
            <Link href={`/collections/${handle}`} className="text-[12px] underline decoration-zinc-400 underline-offset-2 hover:decoration-black">Remove all</Link>
          </div>

          <form method="GET" className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-3 bg-white dark:bg-zinc-900">
            <h3 className="text-[13px] font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Search</h3>
            <input name="q" defaultValue={q} placeholder="Search in collection..." maxLength={50} className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 rounded-lg px-3 py-2 text-sm focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none" />
            {/* preserve others */}
            {sort !== "featured" && <input type="hidden" name="sort" value={sort} />}
            {min !== null && <input type="hidden" name="min" value={String(min)} />}
            {max !== null && <input type="hidden" name="max" value={String(max)} />}
            <button className="mt-2 w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white hover:bg-black dark:hover:bg-zinc-100 rounded-full py-2 text-sm font-bold">Search</button>
          </form>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-3 bg-white dark:bg-zinc-900">
            <h3 className="text-[13px] font-semibold mb-3 text-zinc-900 dark:text-zinc-100">Price</h3>
            <form method="GET" className="space-y-2">
              {q && <input type="hidden" name="q" value={q} />}
              {sort !== "featured" && <input type="hidden" name="sort" value={sort} />}
              <div className="flex gap-2">
                <label className="flex-1"><span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">From ₹</span><input name="min" defaultValue={min ?? ""} type="number" min={0} max={10000} placeholder="0" className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-2.5 py-1.5 text-sm mt-1 focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none" /></label>
                <label className="flex-1"><span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">To ₹</span><input name="max" defaultValue={max ?? ""} type="number" min={0} max={10000} placeholder="200" className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg px-2.5 py-1.5 text-sm mt-1 focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none" /></label>
              </div>
              <button className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white hover:bg-black dark:hover:bg-zinc-100 rounded-full py-2 text-sm font-bold">Apply</button>
            </form>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-900">
            <h3 className="text-[13px] font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Sort by</h3>
            <div className="space-y-1 text-sm">
              {[
                ["featured", "Featured"],
                ["az", "A-Z"],
                ["za", "Z-A"],
                ["price_low", "Price, low to high"],
                ["price_high", "Price, high to low"],
              ].map(([v, l]) => (
                <Link key={v} href={buildHref({ sort: v })} className={`block px-2 py-1.5 rounded-lg font-medium ${sort === v ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"}`}>{l}</Link>
              ))}
            </div>
          </div>
          <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mt-4">Filters update via URL - shareable & back-button friendly.</p>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {/* mobile filters */}
          <form method="GET" className="lg:hidden flex gap-2 mb-4">
            <input name="q" defaultValue={q} placeholder="Search..." maxLength={50} className="flex-1 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 rounded-full px-4 py-2.5 text-sm focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none" />
            <select name="sort" defaultValue={sort} className="border border-zinc-300 dark:border-zinc-700 rounded-full px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <option value="featured">Featured</option><option value="az">A-Z</option><option value="za">Z-A</option><option value="price_low">Price low-high</option><option value="price_high">Price high-low</option>
            </select>
            <button className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white rounded-full px-4 text-sm font-bold">Go</button>
          </form>

          {(q || min !== null || max !== null) && (
            <div className="flex flex-wrap gap-2 mb-3 text-xs">
              {q && <span className="inline-flex items-center gap-1 border border-zinc-300 rounded-full px-3 py-1">Search: {q} <Link href={buildHref({ q: undefined })} className="ml-1 font-bold">×</Link></span>}
              {(min !== null || max !== null) && <span className="inline-flex items-center gap-1 border border-zinc-300 rounded-full px-3 py-1">Price ₹{min ?? 0} - ₹{max ?? "∞"} <Link href={buildHref({ min: undefined, max: undefined })} className="ml-1 font-bold">×</Link></span>}
              <Link href={`/collections/${handle}`} className="underline px-2 py-1">Clear all</Link>
            </div>
          )}

          {pageItems.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900">
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">No products found</div>
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1">Try adjusting price or search. Every filter is URL-synced - no dead ends.</div>
              <Link href={`/collections/${handle}`} className="inline-flex mt-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white rounded-full px-5 py-2 text-sm font-bold">Clear filters</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5">
              {pageItems.map((p, i) => (
                <ProductCard key={p.handle} handle={p.handle} title={p.title} image={p.images[0]} price={p.price} compareAt={p.compareAt} priority={i < 4 && curPage === 1} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <nav className="flex items-center justify-center gap-1 mt-8 text-sm" aria-label="Pagination">
            <Link href={buildHref({ page: String(Math.max(1, curPage - 1)) })} aria-disabled={curPage === 1} className={`w-8 h-8 grid place-items-center rounded-full border ${curPage === 1 ? "opacity-40 pointer-events-none" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"} border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300`}>‹</Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(n => (
              <Link key={n} href={buildHref({ page: String(n) })} aria-current={n === curPage ? "page" : undefined} className={`w-8 h-8 grid place-items-center rounded-full font-medium ${n === curPage ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"}`}>{n}</Link>
            ))}
            <Link href={buildHref({ page: String(Math.min(totalPages, curPage + 1)) })} aria-disabled={curPage === totalPages} className={`w-8 h-8 grid place-items-center rounded-full border ${curPage === totalPages ? "opacity-40 pointer-events-none" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"} border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300`}>›</Link>
          </nav>

          <p className="text-center text-[11px] lg:text-[12px] leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium border-t border-zinc-200 dark:border-zinc-800 mt-8 pt-6 max-w-3xl mx-auto">
            <b>Every design featured on this website is created by fans for fans and is not affiliated with or endorsed by any official brand unless explicitly mentioned. If you believe any artwork infringes upon your rights, please reach out to us at <a href="mailto:posterdrip.in@gmail.com" className="underline">posterdrip.in@gmail.com</a></b>
          </p>
        </div>
      </div>
    </div>
  );
}
