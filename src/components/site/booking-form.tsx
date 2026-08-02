"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { submitBooking } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type NailService = { id: number; name: string };

export function BookingForm({ services }: { services: NailService[] }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  if (done) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-11 w-11 text-emerald-600" />
        <h2 className="mt-4 text-2xl font-extrabold text-navy-900">Appointment request received</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/75">
          Our Nail Spa team will call or message you to confirm the time.
        </p>
        <Button className="mt-5 rounded-full" variant="outline" onClick={() => setDone(false)}>
          Book another visit
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 rounded-3xl border border-brand-100 bg-white p-6 shadow-card md:p-8"
      action={async (formData) => {
        setPending(true);
        setError("");
        const result = await submitBooking(formData);
        setPending(false);
        if (result.ok) setDone(true);
        else setError(result.error || "We could not submit your booking. Please try again.");
      }}
    >
      <div className="flex items-center gap-3 border-b border-border pb-5">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-primary">
          <CalendarCheck className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-navy-900">Book your Nail Spa visit</h2>
          <p className="text-sm text-muted-foreground">Choose your preferred service, date and time.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="booking-name">Full name *</Label>
          <Input id="booking-name" name="name" required autoComplete="name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="booking-phone">Phone / WhatsApp *</Label>
          <Input id="booking-phone" name="phone" required autoComplete="tel" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="booking-email">Email (optional)</Label>
        <Input id="booking-email" name="email" type="email" autoComplete="email" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="booking-service">Nail service *</Label>
        <select
          id="booking-service"
          name="service"
          required
          defaultValue=""
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="" disabled>Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.name}>{service.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="booking-date">Preferred date *</Label>
          <Input id="booking-date" name="preferredDate" type="date" min={today} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="booking-time">Preferred time *</Label>
          <select
            id="booking-time"
            name="preferredTime"
            required
            defaultValue=""
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="" disabled>Select a time</option>
            <option>09:00 AM</option><option>10:30 AM</option><option>12:00 PM</option>
            <option>02:00 PM</option><option>03:30 PM</option><option>05:00 PM</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="booking-notes">Special request (optional)</Label>
        <Textarea id="booking-notes" name="notes" rows={3} placeholder="Tell us about preferred colours, accessibility needs or anything else." />
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <Button disabled={pending} type="submit" size="lg" className="w-full rounded-full font-bold">
        {pending ? "Sending request…" : "Request appointment"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">This is a booking request. We will confirm availability with you directly.</p>
    </form>
  );
}
