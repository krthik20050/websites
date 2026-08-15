import Link from "next/link";
import { IMAGES } from "@/lib/images";
import { formatPrice } from "@/lib/format";

interface ProductCardProps {
  slug: string;
  brand: string;
  model: string;
  dailyRateCents: number;
  depositCents: number;
  description: string;
  category: string;
  condition: string;
}

export function ProductCard({ slug, brand, model, dailyRateCents, depositCents, description, category, condition }: ProductCardProps) {
  const imgSrc = IMAGES[slug as keyof typeof IMAGES];
  const img = Array.isArray(imgSrc) ? imgSrc[0] : imgSrc;

  return (
    <Link
      href={`/cameras/${slug}`}
      className="group bezel-outer block transition-all duration-500 hover:shadow-lg hover:shadow-accent/5"
    >
      <div className="bezel-inner bg-card overflow-hidden flex flex-col h-full transition-all duration-500 group-hover:bg-accent/5">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-secondary">
          <img
            src={img}
            alt={model}
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 dark:bg-surface/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-900 dark:text-white backdrop-blur-sm border border-white/20 capitalize">
            {condition}
          </span>
        </div>
        <div className="flex flex-col flex-1 p-5">
          <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-brand-400">{brand}</span>
          <h3 className="font-bold text-foreground mt-0.5 text-sm">{model}</h3>
          <p className="text-xs text-brand-500 mt-2 line-clamp-2 flex-1 leading-relaxed">{description}</p>
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-sm font-bold text-foreground">
              {formatPrice(dailyRateCents)}<span className="text-[10px] font-normal text-brand-400">/day</span>
            </span>
            <span className="text-[10px] text-brand-400 font-medium">Deposit {formatPrice(depositCents)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
