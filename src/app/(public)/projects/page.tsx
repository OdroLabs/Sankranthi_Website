import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { getProjects } from "@/lib/actions/project";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Projects" };

type Row = Awaited<ReturnType<typeof getProjects>>[number];

export default async function ProjectsPage() {
  const projects = await getProjects({ onlyPublished: true });

  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeading
        eyebrow="Our work"
        title="Projects"
        intro="Community health, advocacy and rights programmes across Colombo and Gampaha."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p: Row) => (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            className="group overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-md"
          >
            {p.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.coverImage} alt={p.title} className="h-44 w-full object-cover" />
            ) : (
              <div className="h-44 w-full bg-gradient-to-br from-plum/15 to-sage/15" />
            )}
            <div className="p-6">
              <p className="text-xs uppercase tracking-wide text-coral">
                {p.location ?? "Sri Lanka"}
              </p>
              <h3 className="mt-2 font-display text-xl text-ink group-hover:text-plum">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{p.summary}</p>
              <p className="mt-4 text-xs text-muted">{formatDate(p.createdAt)}</p>
            </div>
          </Link>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="mt-10 text-muted">No projects published yet.</p>
      )}
    </div>
  );
}
