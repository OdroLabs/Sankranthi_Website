import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { getSpaServices } from "@/lib/actions/spa";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = { title: "Nail SPA" };

export default async function SpaPage() {
  const services = await getSpaServices({ onlyActive: true });

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeading
        eyebrow="Community business"
        title="Sankranthi Nail SPA"
        intro="A community-run nail spa. Every booking supports our health and advocacy programmes."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s: (typeof services)[number]) => (
          <div key={s.id} className="flex flex-col rounded-2xl border border-line bg-white p-6">
            <h3 className="font-display text-xl text-ink">{s.name}</h3>
            {s.description ? <p className="mt-2 text-sm text-muted">{s.description}</p> : null}
            <div className="mt-4 flex items-baseline justify-between">
              <span className="font-display text-2xl text-plum">{formatMoney(s.priceCents)}</span>
              <span className="text-sm text-muted">{s.durationMin} min</span>
            </div>
          </div>
        ))}
      </div>
      {services.length === 0 && <p className="mt-10 text-muted">No services available right now.</p>}

      <div className="mt-10">
        <Link href="/spa/booking"><Button size="lg">Book an appointment</Button></Link>
      </div>
    </div>
  );
}
