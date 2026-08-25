import Link from "next/link";
import { searchProducts, sanitizeSearch } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const raw = sp.q ?? "";
  const q = sanitizeSearch(raw);
  const results = q ? searchProducts(q, 24) : [];

  return (
    <div className="max-w-[1680px] mx-auto px-4 lg:px-8 py-6 w-full">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Search</h1>
      <form className="flex gap-2 mt-3 max-w-xl">
        <input name="q" defaultValue={q} placeholder="Search posters, movies, artists..." maxLength={50} className="flex-1 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 rounded-full px-4 py-2.5 text-sm focus:border-zinc-900 dark:focus:border-zinc-100 focus:outline-none" />
        <button className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white hover:bg-black dark:hover:bg-zinc-100 rounded-full px-6 text-sm font-bold">Search</button>
      </form>

      {q ? (
        <>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-4" aria-live="polite">{results.length} results for “{q}”</p>
          {results.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl mt-6 bg-white dark:bg-zinc-900">
              <div className="text-3xl">🔍</div>
              <div className="font-semibold mt-2 text-zinc-900 dark:text-zinc-100">No results for “{q}”</div>
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Try Tamil, Rajinikanth, Spider-Man, or Anime.</div>
              <Link href="/collections/tamil-cinema" className="inline-flex mt-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white rounded-full px-5 py-2 text-sm font-bold">Browse Tamil Cinema</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4 xl:gap-5 mt-6">
              {results.map(p => <ProductCard key={p.handle} handle={p.handle} title={p.title} image={p.images[0]} price={p.price} compareAt={p.compareAt} />)}
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">Type a query and press Search. Try <Link href="/search?q=Rajinikanth" className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">Rajinikanth</Link>, <Link href="/search?q=Anime" className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">Anime</Link>, <Link href="/search?q=F1" className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">F1</Link>.</div>
      )}
    </div>
  );
}
