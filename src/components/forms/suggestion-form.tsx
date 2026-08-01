"use client";
import { useState, useTransition } from "react";
import { createSuggestion } from "@/lib/actions/suggestion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const categories = ["Services", "Health clinics", "Events", "Website", "Other"];

export function SuggestionForm() {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [v, setV] = useState({ name: "", contact: "", category: categories[0], message: "" });
  const set = (k: string, val: string) => setV((s) => ({ ...s, [k]: val }));

  if (done) {
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/10 p-8 text-center">
        <p className="font-display text-xl text-ink">Thank you</p>
        <p className="mt-2 text-muted">Your suggestion has been shared with the team.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="sname">Name (optional)</Label><Input id="sname" value={v.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div><Label htmlFor="scontact">Contact (optional)</Label><Input id="scontact" value={v.contact} onChange={(e) => set("contact", e.target.value)} /></div>
      </div>
      <div>
        <Label htmlFor="scat">Category</Label>
        <select
          id="scat"
          className="h-11 w-full rounded-lg border border-line bg-white px-3 text-ink focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/20"
          value={v.category}
          onChange={(e) => set("category", e.target.value)}
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div><Label htmlFor="smsg">Your suggestion</Label><Textarea id="smsg" rows={5} value={v.message} onChange={(e) => set("message", e.target.value)} /></div>
      <Button
        disabled={pending}
        onClick={() => {
          setError(null);
          start(async () => {
            const res = await createSuggestion(v);
            if (res.ok) setDone(true);
            else setError(res.error);
          });
        }}
      >
        {pending ? "Sending…" : "Submit suggestion"}
      </Button>
    </div>
  );
}
