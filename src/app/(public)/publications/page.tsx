import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { getPublications } from "@/lib/actions/publication";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Publications" };

export default async function PublicationsPage() {
  const items = await getPublications({ onlyPublished: true });

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeading
        eyebrow="Resources"
        title="Research publications & reports"
        intro="Community needs assessments, programme reports and partner publications."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map((p: (typeof items)[number]) => {
          const href = p.externalUrl || p.fileUrl || "#";
          return (
            <a
              key={p.id}
              href={href}
              target={href !== "#" ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex gap-5 rounded-2xl border border-line bg-white p-5 transition hover:shadow-md"
            >
              {p.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImage} alt="" className="h-28 w-24 shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="h-28 w-24 shrink-0 rounded-lg bg-gradient-to-br from-sage/20 to-plum/20" />
              )}
              <div>
                <Badge>{p.kind}</Badge>
                <h3 className="mt-2 font-display text-lg leading-snug text-ink group-hover:text-plum">
                  {p.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{p.summary}</p>
                <p className="mt-2 text-xs text-muted">{formatDate(p.publishedAt)}</p>
              </div>
            </a>
          );
        })}
      </div>

      {items.length === 0 && <p className="mt-10 text-muted">No publications yet.</p>}
    </div>
  );
}
