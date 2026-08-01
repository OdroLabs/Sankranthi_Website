import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { BookingForm } from "@/components/forms/booking-form";
import { getSpaServices } from "@/lib/actions/spa";

export const metadata: Metadata = { title: "Book — Nail SPA" };

export default async function SpaBookingPage() {
  const services = await getSpaServices({ onlyActive: true });
  const slim = services.map((s: (typeof services)[number]) => ({ id: s.id, name: s.name, priceCents: s.priceCents, durationMin: s.durationMin }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <SectionHeading eyebrow="Nail SPA" title="Book an appointment" intro="Pick a service and a time. We will call you to confirm." />
      <div className="mt-8 rounded-2xl border border-line bg-white p-6">
        <BookingForm services={slim} />
      </div>
    </div>
  );
}
