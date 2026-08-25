export type Collection = {
  handle: string;
  title: string;
  description: string;
  image: string;
  heroImage?: string;
  productCount: number;
};

export type Variant = {
  id: string;
  size: "A5" | "A4" | "A3" | "13x19 inches";
  price: number;
  compareAt: number | null;
  available: boolean;
  sku: string;
};

export type Product = {
  handle: string;
  title: string;
  description: string;
  price: number; // min price (A5)
  compareAt: number;
  images: string[];
  collections: string[];
  featured?: boolean;
  tags?: string[];
  variants: Variant[];
  options: { name: string; values: string[] };
};
