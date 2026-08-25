import Link from "next/link";
import Image from "next/image";
import { collections, products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

export default function Home() {
  const trending = products.filter(p => p.featured).slice(0, 8);
  const movie = products.filter(p => p.collections.includes("tamil-cinema") || p.collections.includes("hollywood-cinema")).slice(0, 10);
  // distinct Baddie posters - avoid variants so 4 unique artworks show
  const baddieAll = products.filter(p => p.collections.includes("baddie-collection") && !p.handle.includes("-v2") && !p.handle.includes("-v3") && !p.handle.includes("-v4"));
  const baddie = (baddieAll.length >= 4 ? baddieAll : products.filter(p => p.collections.includes("baddie-collection"))).slice(0, 4);
  const heroCollections = collections.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Trust bar - hero removed per feedback (cluttered AI image) - collections first */}
      <section className="border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-[1680px] mx-auto px-4 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 py-3.5 text-[12.5px] lg:text-[13px] text-zinc-900 dark:text-zinc-100">
          <div className="flex items-center gap-2.5"><span className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 grid place-items-center text-xs">✓</span><span><b>Free Shipping</b> <span className="text-zinc-600 dark:text-zinc-400 hidden sm:inline font-medium">on Prepaid orders Above 249/-</span></span></div>
          <div className="flex items-center gap-2.5"><span className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 grid place-items-center text-xs">₹</span><span><b>Best Prices</b> <span className="text-zinc-600 dark:text-zinc-400 hidden sm:inline font-medium">Most Bang for your buck</span></span></div>
          <div className="flex items-center gap-2.5"><span className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 grid place-items-center text-xs">↺</span><span><b>No exchange</b> <span className="text-zinc-600 dark:text-zinc-400 hidden sm:inline font-medium">No return or exchange</span></span></div>
          <div className="flex items-center gap-2.5"><span className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 grid place-items-center text-xs">★</span><span><b>Rated 4.7/5</b> <span className="text-zinc-600 dark:text-zinc-400 hidden sm:inline font-medium">Customer satisfaction #1</span></span></div>
        </div>
      </section>

      {/* Collections */}
      <section className="max-w-[1680px] mx-auto px-4 lg:px-8 w-full pt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[20px] lg:text-[24px] font-bold tracking-tight">Collections</h2>
          <Link href="/collections" className="text-[13px] font-medium underline decoration-zinc-300 hover:decoration-black underline-offset-4">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mt-4">
          {heroCollections.map(c => (
            <Link key={c.handle} href={`/collections/${c.handle}`} className="group relative rounded-xl overflow-hidden bg-zinc-100 aspect-[4/3] border border-zinc-200">
              <Image src={c.image} alt={c.title} fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover group-hover:scale-[1.04] transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 p-3 text-white">
                <div className="text-[14px] font-semibold leading-tight">{c.title}</div>
                <div className="text-[11px] opacity-80">{c.productCount} posters</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-[1680px] mx-auto px-4 lg:px-8 w-full pt-8">
        <h2 className="text-[20px] lg:text-[24px] font-bold tracking-tight">Trending Right Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5 mt-4">
          {trending.map((p, i) => <ProductCard key={p.handle} handle={p.handle} title={p.title} image={p.images[0]} price={p.price} compareAt={p.compareAt} priority={i < 4} />)}
        </div>
        <div className="text-center mt-6"><Link href="/collections/tamil-cinema" className="inline-flex border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-full px-5 py-2 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800">View Tamil Cinema →</Link></div>
      </section>

      {/* Movie Posters */}
      <section className="max-w-[1680px] mx-auto px-4 lg:px-8 w-full pt-8">
        <h2 className="text-[20px] lg:text-[24px] font-bold tracking-tight">Movie Posters</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5 mt-4">
          {movie.map(p => <ProductCard key={p.handle} handle={p.handle} title={p.title} image={p.images[0]} price={p.price} compareAt={p.compareAt} />)}
        </div>
      </section>

      {/* Baddie */}
      {baddie.length > 0 && (
        <section className="max-w-[1680px] mx-auto px-4 lg:px-8 w-full pt-8 pb-8">
          <div className="flex items-baseline justify-between"><h2 className="text-[20px] lg:text-[24px] font-bold tracking-tight">Baddie Collection</h2><Link href="/collections/baddie-collection" className="text-[13px] font-medium underline">View all</Link></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 mt-4">
            {baddie.map(p => <ProductCard key={p.handle} handle={p.handle} title={p.title} image={p.images[0]} price={p.price} compareAt={p.compareAt} />)}
          </div>
        </section>
      )}
    </div>
  );
}
