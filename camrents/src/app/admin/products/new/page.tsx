"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createProduct } from "@/lib/actions/products";
import { CATEGORIES } from "@/lib/constants";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    
    const brand = data.get("brand") as string;
    const model = data.get("model") as string;
    const slug = `${brand}-${model}`.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const category = data.get("category") as string;
    const dailyRate = parseInt((data.get("dailyRate") as string).replace(/,/g, ""), 10) * 100; // Convert ₹ to cents
    const weeklyRate = data.get("weeklyRate") ? parseInt((data.get("weeklyRate") as string).replace(/,/g, ""), 10) * 100 : undefined;
    const monthlyRate = data.get("monthlyRate") ? parseInt((data.get("monthlyRate") as string).replace(/,/g, ""), 10) * 100 : undefined;
    const deposit = parseInt((data.get("deposit") as string).replace(/,/g, ""), 10) * 100;
    const description = (data.get("description") as string) || undefined;
    const quantity = parseInt((data.get("quantity") as string) || "1", 10);
    const condition = (data.get("condition") as string) || "good";

    try {
      await createProduct({
        brand,
        model,
        category: category as any,
        slug,
        dailyRateCents: dailyRate,
        weeklyRateCents: weeklyRate,
        monthlyRateCents: monthlyRate,
        depositCents: deposit,
        description,
        condition,
        totalQuantity: quantity,
      });
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Failed to create product:", err);
      alert("Failed to save product: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 lg:pl-52">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <h1 className="text-xl font-bold text-brand-950">Add Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <Card>
          <CardContent className="space-y-4 p-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-700">Brand</label>
              <Input name="brand" placeholder="Sony, Canon, Nikon..." required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-700">Model</label>
              <Input name="model" placeholder="A7III, R5, Z8..." required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-700">Category</label>
              <select name="category" className="w-full rounded-lg border border-border px-3 py-2 text-sm" required>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-700">Daily Rate (₹)</label>
                <Input name="dailyRate" type="number" placeholder="1200" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-700">Weekly Rate (₹)</label>
                <Input name="weeklyRate" type="number" placeholder="6000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-700">Monthly Rate (₹)</label>
                <Input name="monthlyRate" type="number" placeholder="18000" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-700">Deposit (₹)</label>
                <Input name="deposit" type="number" placeholder="15000" required />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-700">Description</label>
              <textarea name="description" rows={3} className="w-full rounded-lg border border-border px-3 py-2 text-sm" placeholder="Describe the product..." />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-700">Total Quantity</label>
              <Input name="quantity" type="number" defaultValue={1} min={1} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-700">Condition</label>
              <select name="condition" className="w-full rounded-lg border border-border px-3 py-2 text-sm">
                <option value="excellent">Excellent</option>
                <option value="good" selected>Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="outline" asChild className="flex-1">
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" className="flex-1" disabled={saving}>
            {saving ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
