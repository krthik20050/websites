"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const handleSave = async (e: React.FormEvent) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="p-4 lg:pl-52">
      <h1 className="mb-4 text-xl font-bold text-brand-950">Settings</h1>
      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <Card><CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-brand-950">Shop Information</h3>
          <div><label className="mb-1 block text-sm font-medium text-brand-700">Shop Name</label><Input defaultValue="CamRents Thrissur" /></div>
          <div><label className="mb-1 block text-sm font-medium text-brand-700">Address</label><textarea rows={2} className="w-full rounded-lg border border-border px-3 py-2 text-sm" defaultValue="Round West, Thrissur, Kerala 680001" /></div>
          <div><label className="mb-1 block text-sm font-medium text-brand-700">Phone</label><Input defaultValue="+91 99999 99999" /></div>
          <div><label className="mb-1 block text-sm font-medium text-brand-700">Email</label><Input defaultValue="hello@camrents.in" /></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-brand-950">Late Fee Rules</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-sm font-medium text-brand-700">Daily Late Fee (₹)</label><Input type="number" defaultValue={500} /></div>
            <div><label className="mb-1 block text-sm font-medium text-brand-700">Grace Hours</label><Input type="number" defaultValue={4} /></div>
          </div>
          <div><label className="mb-1 block text-sm font-medium text-brand-700">Max Late Fee (₹)</label><Input type="number" defaultValue={10000} /></div>
        </CardContent></Card>
        <Button type="submit" className="w-full">{saved ? "✓ Saved!" : "Save Settings"}</Button>
      </form>
    </div>
  );
}
