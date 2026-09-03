"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import { submitBooking } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type BookableService = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  price?: string;
};

const DEFAULT_TIME_SLOTS = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"];

export function BookingForm({
  services,
  formTitle,
  formIntro,
  submitLabel,
  successTitle,
  successBody,
  initialServiceId,
  timeSlots,
  availableDays,
}: {
  services: BookableService[];
  formTitle?: string;
  formIntro?: string;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
  initialServiceId?: number;
  timeSlots?: string[];
  availableDays?: string;
}) {
  const slots = timeSlots && timeSlots.length > 0 ? timeSlots : DEFAULT_TIME_SLOTS;
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [selectedService, setSelectedService] = useState(
    initialServiceId ? String(initialServiceId) : ""
  );
  const today = new Date().toISOString().slice(0, 10);

  if (done) {
    return (
      <div className="border border-[#BFD8CC] bg-[#F2F8F4] p-8 text-center">
        <CheckCircle2 className="mx-auto h-11 w-11 text-emerald-600" />
        {successTitle && <h2 className="mt-4 font-serif text-3xl text-[#293845]">{successTitle}</h2>}
        {successBody && <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#4C6658]">{successBody}</p>}
        <Button className="mt-5 rounded-[8px]" variant="outline" onClick={() => setDone(false)}>
          Book another visit
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-6 border border-[#DFD2C5] bg-[#FCFAF6] p-6 md:p-8"
      action={async (formData) => {
        setPending(true);
        setError("");
        const result = await submitBooking(formData);
        setPending(false);
        if (result.ok) setDone(true);
        else setError(result.error || "We could not submit your booking. Please try again.");
      }}
    >
      <div className="flex items-center gap-3 border-b border-[#DFD2C5] pb-5">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#EAF3F8] text-[#2F6590]">
          <CalendarCheck className="h-5 w-5" />
        </span>
        <div>
          {formTitle && <h2 className="font-serif text-2xl text-[#293845]">{formTitle}</h2>}
          {formIntro && <p className="text-sm text-[#5F7380]">{formIntro}</p>}
        </div>
      </div>

      {services.length > 0 ? (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-[#34434C]">Choose a service *</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {services.map((service) => {
              const serviceId = String(service.id);
              const selected = selectedService === serviceId;
              return (
                <button
                  key={service.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedService(serviceId)}
                  className={`flex min-h-[76px] items-center gap-3 border p-3 text-left transition-colors ${
                    selected
                      ? "border-[#2F6590] bg-[#EAF3F8]"
                      : "border-[#DFD2C5] bg-white hover:border-[#2F6590]/50"
                  }`}
                >
                  {service.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={service.image} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-[17px] leading-tight text-[#293845]">{service.name}</span>
                    {service.price && <span className="mt-1 block text-xs font-semibold text-[#2F6590]">LKR {service.price}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : (
        <p className="border border-[#DFD2C5] bg-white px-4 py-3 text-sm text-[#5F7380]">
          No services are currently available for online booking.
        </p>
      )}

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
        <Label htmlFor="booking-service">Selected service *</Label>
        <select
          id="booking-service"
          name="serviceId"
          required
          value={selectedService}
          onChange={(event) => setSelectedService(event.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="" disabled>Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="booking-date">Preferred date *</Label>
          {availableDays && <p className="text-xs text-[#5F7380]">Available {availableDays}</p>}
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
            {slots.map((slot) => (
              <option key={slot}>{slot}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="booking-notes">Special request (optional)</Label>
        <Textarea id="booking-notes" name="notes" rows={3} placeholder="Tell us about preferred colours, accessibility needs or anything else." />
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <Button
        disabled={pending || services.length === 0}
        type="submit"
        size="lg"
        className="w-full rounded-[8px] bg-[#2F6590] font-semibold text-white shadow-[0_10px_25px_rgba(47,101,144,0.15)] hover:bg-[#275879]"
      >
        {pending ? "Sending request…" : submitLabel}
      </Button>
      <p className="text-center text-xs text-muted-foreground">This is a booking request. We will confirm availability with you directly.</p>
    </form>
  );
}
