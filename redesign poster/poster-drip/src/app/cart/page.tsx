"use client";
import Link from "next/link";
import Image from "next/image";
import { useCartLines, useCart } from "@/components/CartProvider";

export default function CartPage() {
  const lines = useCartLines();
  const { remove, setQty, clear, count } = useCart();
  const total = lines.reduce((s, l) => s + l.lineTotal, 0);

  const milestones = [
    { label: "Free Shipping", threshold: 250 },
    { label: "Free Gift", threshold: 500 },
    { label: "Extra Poster", threshold: 1000 },
  ];
  const nextMilestone = milestones.find(m => total < m.threshold);
  const unlockedCount = milestones.filter(m => total >= m.threshold).length;
  const progressPct = total >= 1000 ? 100 : total < 250 ? (total / 250) * 33 : total < 500 ? 33 + ((total - 250) / 250) * 33 : 66 + ((total - 500) / 500) * 34;

  const MilestoneBar = () => {
    const remaining = nextMilestone ? nextMilestone.threshold - total : 0;
    const Truck = ({ active, small = false }: { active: boolean; small?: boolean }) => (
      <svg width={small ? 16 : 18} height={small ? 16 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={active ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-500"}>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.32A1 1 0 0 0 17.52 8H14" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    );
    return (
      <div className="py-3">
        <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100" aria-live="polite">
          {total === 0 ? (
            <>Your cart: <span className="font-bold">₹250</span> away from getting free shipping.</>
          ) : nextMilestone ? (
            <>Your cart: <span className="font-bold">₹{remaining}</span> away from getting free shipping.</>
          ) : (
            <span className="text-emerald-700 dark:text-emerald-300 font-semibold">✓ Free shipping unlocked - all 3 milestones done!</span>
          )}
        </p>
        <div className="relative mt-3 px-1">
          <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-900 dark:bg-white rounded-full transition-all duration-700 ease-out" style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }} />
          </div>
          {/* milestones - no out-of-box: flex with equal columns, trucks centered */}
          <div className="mt-2 grid grid-cols-3 gap-2">
            {milestones.map((m, i) => {
              const done = total >= m.threshold;
              return (
                <div key={m.threshold} className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full grid place-items-center border bg-white dark:bg-zinc-900 ${done ? "border-emerald-600 dark:border-emerald-400" : "border-zinc-300 dark:border-zinc-700"}`}>
                    <Truck active={done} small />
                  </div>
                  <span className={`text-[10px] font-bold tracking-wide ${done ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-500 dark:text-zinc-400"}`}>Milestone {i + 1}</span>
                  <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 leading-none">{m.label}</span>
                  {!done && <span className="text-[10px] font-medium text-zinc-400">₹{m.threshold}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (lines.length === 0) {
    return (
      <div className="max-w-[1680px] mx-auto px-4 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Your cart</h1>
          <Link href="/collections" className="text-sm font-medium underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-4 hover:decoration-zinc-900 dark:hover:decoration-zinc-100 text-zinc-700 dark:text-zinc-300">Continue shopping</Link>
        </div>
        <div className="mt-4 max-w-2xl"><MilestoneBar /></div>
        <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl mt-6 bg-white dark:bg-zinc-900">
          <div className="text-5xl mb-3">🛒</div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Your cart is empty</h2>
          <Link href="/collections" className="inline-flex mt-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white rounded-full px-6 py-2.5 text-sm font-bold hover:bg-black dark:hover:bg-zinc-100">Continue shopping</Link>
          <p className="text-sm mt-6 text-zinc-700 dark:text-zinc-300"><span className="font-semibold">Have an account?</span> <Link href="/pages/contact" className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2 hover:decoration-zinc-900 dark:hover:decoration-zinc-100">Log in</Link> to check out faster.</p>
        </div>
        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 max-w-md ml-auto">
          <div className="flex justify-between items-baseline">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Estimated total</h2>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Rs. 0.00 INR</span>
          </div>
          <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mt-1">Taxes, Discounts and <Link href="/policies/shipping-policy" className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2">shipping</Link> calculated at checkout</p>
          <button disabled className="mt-4 w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full py-3 text-sm font-bold opacity-40 cursor-not-allowed">Check out</button>
          <p className="text-center text-[11px] font-medium text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 mt-6 pt-6"><span className="font-bold">Every design featured on this website is created by fans for fans and is not affiliated with or endorsed by any official brand unless explicitly mentioned. If you believe any artwork infringes upon your rights, please reach out to us at </span><a href="mailto:posterdrip.in@gmail.com" className="underline font-bold">posterdrip.in@gmail.com</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1680px] mx-auto px-4 lg:px-8 py-6 lg:py-8 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Your cart</h1>
        <Link href="/collections" className="text-sm font-medium underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-4 hover:decoration-zinc-900 dark:hover:decoration-zinc-100 text-zinc-700 dark:text-zinc-300">Continue shopping</Link>
      </div>
      <p className="text-sm mt-2 text-zinc-700 dark:text-zinc-300"><span className="font-semibold">Have an account?</span> <Link href="/pages/contact" className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2 hover:decoration-zinc-900 dark:hover:decoration-zinc-100">Log in</Link> to check out faster.</p>

      <div className="mt-4"><MilestoneBar /></div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 mt-6">
        <div className="space-y-4">
          {lines.map(l => (
            <div key={`${l.handle}-${l.variantId}`} className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800 py-4 first:border-t">
              <Link href={`/products/${l.handle}`} className="relative w-24 h-32 sm:w-28 sm:h-36 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800">
                <Image src={l.product!.images[0]} alt={l.product!.title} fill sizes="112px" className="object-cover" />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col">
                <Link href={`/products/${l.handle}`} className="text-[14px] font-semibold leading-snug hover:underline text-zinc-900 dark:text-zinc-100 decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2 line-clamp-2">{l.product!.title}</Link>
                <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mt-1">{l.size ?? l.variant?.size ?? "A5"} - Premium 300 GSM matte</div>
                <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Unit price / per</div>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100">Rs. {l.unitPrice}.00</span>
                  {l.variant?.compareAt && <span className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400 line-through">Rs. {l.variant.compareAt}.00</span>}
                  <span className="ml-1 bg-[#e11d48] text-white text-[10px] font-bold tracking-wide px-1.5 py-0.5 rounded-full">Sale</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-full bg-white dark:bg-zinc-900 overflow-hidden">
                    <button onClick={() => setQty(l.handle, l.qty - 1, l.variantId)} className="w-8 h-8 grid place-items-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[14px]" aria-label="Decrease quantity">−</button>
                    <span className="w-8 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">{l.qty}</span>
                    <button onClick={() => setQty(l.handle, l.qty + 1, l.variantId)} className="w-8 h-8 grid place-items-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-[14px]" aria-label="Increase quantity">+</button>
                  </div>
                  <button onClick={() => remove(l.handle, l.variantId)} className="text-[12px] font-medium underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100" aria-label={`Remove ${l.product!.title}`}>Remove</button>
                  <span className="ml-auto text-[14px] font-bold text-zinc-900 dark:text-zinc-100">Rs. {l.lineTotal}.00</span>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clear} className="text-sm font-medium underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">Clear cart</button>
        </div>

        <div className="h-fit lg:sticky lg:top-[80px]">
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 lg:border lg:rounded-xl lg:p-6 bg-white dark:bg-zinc-900 lg:border-zinc-200 dark:lg:border-zinc-800">
            <div className="flex justify-between items-baseline">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Estimated total</h2>
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Rs. {total}.00 INR</span>
            </div>
            <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mt-1">Taxes, Discounts and <Link href="/policies/shipping-policy" className="underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2">shipping</Link> calculated at checkout</p>
            <button onClick={() => alert("Demo checkout - wire to Shopify Storefront cartCreate to charge. Prices re-validated.")} className="mt-4 w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white rounded-full py-3.5 text-sm font-bold hover:bg-black dark:hover:bg-zinc-100">Check out</button>
            <Link href="/collections" className="mt-3 block w-full text-center text-sm font-medium underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-4 hover:decoration-zinc-900 dark:hover:decoration-zinc-100 text-zinc-700 dark:text-zinc-300">Continue shopping</Link>
            <p className="text-center text-[11px] font-medium text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 mt-6 pt-6"><span className="font-bold">Every design featured on this website is created by fans for fans and is not affiliated with or endorsed by any official brand unless explicitly mentioned. If you believe any artwork infringes upon your rights, please reach out to us at </span><a href="mailto:posterdrip.in@gmail.com" className="underline font-bold">posterdrip.in@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
