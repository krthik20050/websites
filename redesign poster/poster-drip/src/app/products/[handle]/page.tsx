import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products, getProduct } from "@/lib/data";
import AddToCartButton from "./AddToCartButton";

export const revalidate = 3600;
export async function generateStaticParams() {
  return products.map(p => ({ handle: p.handle }));
}
export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = getProduct(handle);
  if (!p) return { title: "Product not found" };
  return { title: p.title };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = getProduct(handle);
  if (!p) return notFound();

  const related = (() => {
    const byImage = new Map<string, (typeof products)[number]>();
    for (const x of products) {
      if (x.handle === p.handle) continue;
      if (!x.collections.some(c => p.collections.includes(c))) continue;
      const key = x.images[0];
      if (!byImage.has(key)) byImage.set(key, x);
    }
    let list = Array.from(byImage.values()).sort((a, b) => a.handle.localeCompare(b.handle));
    if (list.length < 4) {
      const extra = products.filter(y => y.handle !== p.handle && !byImage.has(y.images[0])).sort((a, b) => a.handle.localeCompare(b.handle)).slice(0, 4 - list.length);
      list = [...list, ...extra];
    }
    return list.slice(0, 4);
  })();

  return (
    <div className="max-w-[1680px] mx-auto px-4 lg:px-8 py-6 lg:py-8 w-full">
      <nav className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline underline-offset-2">Home</Link> <span className="text-zinc-400">›</span>
        {p.collections[0] && <><Link href={`/collections/${p.collections[0]}`} className="hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline underline-offset-2 capitalize">{p.collections[0].replace(/-/g, " ")}</Link> <span className="text-zinc-400">›</span></>}
        <span className="text-zinc-900 dark:text-zinc-100 line-clamp-1 font-semibold">{p.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 mt-4">
        <div className="relative aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <Image src={p.images[0]} alt={p.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[22px] lg:text-[28px] font-bold tracking-tight leading-tight text-zinc-900 dark:text-zinc-100">{p.title}</h1>
          <div className="flex items-baseline gap-2 mt-3 flex-wrap">
            <span className="text-[22px] font-bold text-zinc-900 dark:text-zinc-100">Rs. {p.price}.00</span>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 line-through">Rs. {p.compareAt}.00</span>
            <span className="bg-[#e11d48] text-white text-xs font-semibold px-2 py-1 rounded-full">Sale</span>
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-2 py-1 rounded-full">In stock</span>
          </div>
          <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mt-4 leading-relaxed">{p.description}</p>

          <div className="mt-6 flex flex-col gap-3">
            <AddToCartButton handle={p.handle} title={p.title} variants={p.variants} />
            <Link href="/cart" className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-full px-6 py-3 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 text-center">View cart - keep shopping</Link>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-3"><div className="font-semibold text-zinc-900 dark:text-zinc-100">Free Shipping</div><div className="font-medium text-zinc-600 dark:text-zinc-400">Over ₹250 prepaid</div></div>
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-3"><div className="font-semibold text-zinc-900 dark:text-zinc-100">Premium Print</div><div className="font-medium text-zinc-600 dark:text-zinc-400">300 GSM matte</div></div>
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-3"><div className="font-semibold text-zinc-900 dark:text-zinc-100">Fan Art</div><div className="font-medium text-zinc-600 dark:text-zinc-400">Not official</div></div>
          </div>

          <div className="mt-6 text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-200 dark:border-zinc-800 pt-4">
            Every design is created by fans for fans. Not affiliated with any official brand. Need help? <Link href="/pages/contact" className="underline">Contact us</Link>.
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-4">
            {related.map(r => (
              <Link key={r.handle} href={`/products/${r.handle}`} className="group border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 hover:shadow-md dark:hover:shadow-black/20 transition">
                <div className="relative aspect-[3/4] bg-zinc-100 dark:bg-zinc-800"><Image src={r.images[0]} alt={r.title} fill sizes="25vw" className="object-cover group-hover:scale-[1.02] transition-transform" /></div>
                <div className="p-3"><div className="text-sm font-semibold line-clamp-2 text-zinc-900 dark:text-zinc-100">{r.title}</div><div className="text-xs mt-1"><span className="line-through font-medium text-zinc-600 dark:text-zinc-400">Rs. {r.compareAt}</span> <span className="font-bold text-zinc-900 dark:text-zinc-100">Rs. {r.price}</span></div></div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
