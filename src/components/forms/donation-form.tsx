"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const presets = [1000, 2500, 5000, 10000];

export function DonationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [v, setV] = useState({ donorName: "", email: "", amount: 2500, message: "" });

  async function donate() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start payment");

      // build a hidden form and post to PayHere
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.action;
      Object.entries(data.fields as Record<string, string>).forEach(([k, val]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = val;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div>
        <Label>Amount (LKR)</Label>
        <div className="mt-1 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setV((s) => ({ ...s, amount: p }))}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                v.amount === p ? "border-plum bg-plum text-sand" : "border-line text-ink hover:bg-card"
              }`}
            >
              {p.toLocaleString()}
            </button>
          ))}
          <Input
            type="number"
            min={100}
            value={v.amount}
            onChange={(e) => setV((s) => ({ ...s, amount: Number(e.target.value) }))}
            className="w-32"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="dn">Name (optional)</Label><Input id="dn" value={v.donorName} onChange={(e) => setV((s) => ({ ...s, donorName: e.target.value }))} /></div>
        <div><Label htmlFor="de">Email (optional)</Label><Input id="de" type="email" value={v.email} onChange={(e) => setV((s) => ({ ...s, email: e.target.value }))} /></div>
      </div>
      <div><Label htmlFor="dm">Message (optional)</Label><Textarea id="dm" rows={3} value={v.message} onChange={(e) => setV((s) => ({ ...s, message: e.target.value }))} /></div>
      <Button variant="accent" size="lg" disabled={loading} onClick={donate}>
        {loading ? "Redirecting to PayHere…" : `♥ Donate LKR ${v.amount.toLocaleString()}`}
      </Button>
      <p className="text-xs text-muted">You will be redirected to PayHere to complete your donation securely.</p>
    </div>
  );
}
