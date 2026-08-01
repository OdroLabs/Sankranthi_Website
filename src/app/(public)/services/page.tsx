import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { getServices } from "@/lib/actions/service";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Our services" };

export default async function ServicesPage() {
  const services = await getServices({ onlyPublished: true });

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeading
        eyebrow="Community health & support"
        title="Our services"
        intro="Free, confidential and judgement-free care for the trans women and sex worker community. Reach out for any service and we will route you to the right support."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s: (typeof services)[number]) => (
          <div key={s.id} className="rounded-2xl border border-line bg-white p-6">
            <div className="text-3xl">{s.icon || "🫂"}</div>
            <h3 className="mt-3 font-display text-xl text-ink">{s.title}</h3>
            <p className="mt-2 text-sm text-muted">{s.description}</p>
            {s.specialCase ? (
              <p className="mt-3 text-xs uppercase tracking-wide text-coral">{s.specialCase}</p>
            ) : null}
            <Link
              href={`/contact?service=${s.slug}`}
              className="mt-4 inline-block text-sm font-medium text-plum hover:underline"
            >
              Request this service →
            </Link>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <p className="mt-10 text-muted">No services published yet.</p>
      )}

      <div className="mt-12 rounded-2xl bg-plum p-8 text-sand">
        <p className="font-display text-2xl">Need help right now?</p>
        <p className="mt-2 text-sand/80">Call our confidential community hotline.</p>
        <a href={site.hotlineHref} className="mt-4 inline-block font-display text-2xl text-coral">
          {site.hotline}
        </a>
      </div>
    </div>
  );
}
