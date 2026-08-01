import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug } from "@/lib/actions/project";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm uppercase tracking-widest text-coral">
        {project.location ?? "Sri Lanka"} · {formatDate(project.createdAt)}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{project.title}</h1>
      <p className="mt-4 text-lg text-muted">{project.summary}</p>

      {project.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.coverImage}
          alt={project.title}
          className="mt-8 w-full rounded-2xl object-cover"
        />
      ) : null}

      <div className="prose mt-8 max-w-none whitespace-pre-wrap text-ink/90">
        {project.content}
      </div>
    </article>
  );
}
