import type { MetadataRoute } from "next";
import { collections, products } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://posterdrip.in";
  const now = new Date();
  const staticRoutes = ["", "/collections", "/cart", "/search", "/pages/contact", "/policies/privacy-policy", "/policies/refund-policy", "/policies/terms-of-service", "/policies/shipping-policy"];
  const s: MetadataRoute.Sitemap = staticRoutes.map(r => ({ url: `${base}${r || "/"}`, lastModified: now, changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.7 }));
  for (const c of collections) s.push({ url: `${base}/collections/${c.handle}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 });
  for (const p of products) s.push({ url: `${base}/products/${p.handle}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 });
  return s;
}
