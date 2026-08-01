import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEventBySlug } from "@/lib/actions/event";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = await getEventBySlug(slug);
  return { title: e?.title ?? "Event" };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event || !event.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm uppercase tracking-widest text-coral">
        {formatDate(event.startsAt)}
        {event.location ? ` · ${event.location}` : ""}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{event.title}</h1>
      {event.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.coverImage} alt="" className="mt-8 w-full rounded-2xl object-cover" />
      ) : null}
      <div className="prose mt-8 max-w-none whitespace-pre-wrap text-ink/90">{event.description}</div>

      {event.gallery.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-2xl text-ink">Gallery</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {event.gallery.map((g: (typeof event.gallery)[number]) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={g.id} src={g.url} alt={g.caption ?? ""} className="aspect-square w-full rounded-lg object-cover" />
            ))}
          </div>
        </>
      )}
    </article>
  );
}
