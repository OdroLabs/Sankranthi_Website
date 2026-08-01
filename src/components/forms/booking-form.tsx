"use client";
import { useState, useTransition } from "react";
import { createBooking } from "@/lib/actions/spa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/utils";

type SpaService = { id: string; name: string; priceCents: number; durationMin: number };

export function BookingForm({ services }: { services: SpaService[] }) {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [v, setV] = useState({
    spaServiceId: services[0]?.id ?? "",
    customerName: "",
    phone: "",
    email: "",
    scheduledAt: "",
    notes: "",
  });
  const set = (k: string, val: string) => setV((s) => ({ ...s, [k]: val }));

  if (done) {
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/10 p-8 text-center">
        <p className="font-display text-xl text-ink">Booking received</p>
        <p className="mt-2 text-muted">We will call you to confirm your appointment. Thank you.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div>
        <Label htmlFor="svc">Service</Label>
        <select
          id="svc"
          className="h-11 w-full rounded-lg border border-line bg-white px-3 text-ink focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/20"
          value={v.spaServiceId}
          onChange={(e) => set("spaServiceId", e.target.value)}
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {formatMoney(s.priceCents)} · {s.durationMin} min
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="cn">Your name</Label><Input id="cn" value={v.customerName} onChange={(e) => set("customerName", e.target.value)} /></div>
        <div><Label htmlFor="ph">Phone</Label><Input id="ph" value={v.phone} onChange={(e) => set("phone", e.target.value)} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="em">Email (optional)</Label><Input id="em" type="email" value={v.email} onChange={(e) => set("email", e.target.value)} /></div>
        <div><Label htmlFor="dt">Preferred date & time</Label><Input id="dt" type="datetime-local" value={v.scheduledAt} onChange={(e) => set("scheduledAt", e.target.value)} /></div>
      </div>
      <div><Label htmlFor="nt">Notes (optional)</Label><Textarea id="nt" rows={3} value={v.notes} onChange={(e) => set("notes", e.target.value)} /></div>
      <Button
        disabled={pending || services.length === 0}
        onClick={() => {
          setError(null);
          start(async () => {
            const res = await createBooking(v);
            if (res.ok) setDone(true);
            else setError(res.error);
          });
        }}
      >
        {pending ? "Booking…" : "Request booking"}
      </Button>
    </div>
  );
}
