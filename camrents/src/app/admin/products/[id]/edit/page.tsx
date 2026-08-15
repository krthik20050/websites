"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/lib/constants";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    router.push("/admin/products");
  };

  const handleDelete = async () => {
    if (!confirm("Deactivate this product?")) return;
    await new Promise((r) => setTimeout(r, 300));
    router.push("/admin/products");
  };

  return (
    <div className="p-4 lg:pl-52">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">← Back</Button>
        </Link>
        <h1 className="text-xl font-bold text-brand-950">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <Card>
          <CardContent className="space-y-4 p-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-700">Brand</label>
              <Input name="brand" placeholder="Sony" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-700">Model</label>
              <Input name="model" placeholder="A7III" required />
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
                <Input name="dailyRate" type="number" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-700">Weekly Rate (₹)</label>
                <Input name="weeklyRate" type="number" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-700">Monthly Rate (₹)</label>
                <Input name="monthlyRate" type="number" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-700">Deposit (₹)</label>
                <Input name="deposit" type="number" required />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-700">Description</label>
              <textarea name="description" rows={3} className="w-full rounded-lg border border-border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-700">Total Quantity</label>
              <Input name="quantity" type="number" min={1} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" variant="destructive" onClick={handleDelete}>Deactivate</Button>
          <Button type="button" variant="outline" asChild className="flex-1">
            <Link href="/admin/products">Cancel</Link>
          </Button>
          <Button type="submit" className="flex-1" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
