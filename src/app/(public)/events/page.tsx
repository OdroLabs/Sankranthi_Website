import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { getEvents } from "@/lib/actions/event";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await getEvents({ onlyPublished: true });
  const now = new Date();

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeading eyebrow="Volunteers & community" title="Events" intro="Clinics, workshops and community gatherings." />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e: (typeof events)[number]) => (
          <Link
            key={e.id}
            href={`/events/${e.slug}`}
            className="group overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-md"
          >
            {e.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.coverImage} alt="" className="h-40 w-full object-cover" />
            ) : (
              <div className="h-40 w-full bg-gradient-to-br from-coral/15 to-plum/15" />
            )}
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide text-coral">
                {new Date(e.startsAt) >= now ? "Upcoming" : "Past"} · {formatDate(e.startsAt)}
              </p>
              <h3 className="mt-2 font-display text-lg text-ink group-hover:text-plum">{e.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{e.description}</p>
            </div>
          </Link>
        ))}
      </div>
      {events.length === 0 && <p className="mt-10 text-muted">No events yet.</p>}
    </div>
  );
}
