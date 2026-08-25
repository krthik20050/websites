import Link from "next/link";
import Image from "next/image";
import { collections } from "@/lib/data";

export const metadata = { title: "Collections" };
export const revalidate = 3600;

export default function CollectionsPage() {
  return (
    <div className="max-w-[1680px] mx-auto px-4 lg:px-8 py-6 lg:py-8 w-full">
      <h1 className="text-[28px] lg:text-[32px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">All Collections</h1>
      <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mt-1">{collections.length} collections • Click any to shop</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5 mt-6">
        {collections.map(c => (
          <Link key={c.handle} href={`/collections/${c.handle}`} className="group border border-zinc-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
            <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
              <Image src={c.image} alt={c.title} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
            </div>
            <div className="p-3">
              <div className="text-[14px] font-semibold leading-tight text-zinc-900 dark:text-zinc-100">{c.title}</div>
              <div className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400">{c.description.slice(0, 60)}…</div>
              <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mt-1">{c.productCount} products</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
