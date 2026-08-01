import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { Badge } from "@/components/ui/badge";
import { getNews } from "@/lib/actions/news";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "News & stories" };

export default async function NewsPage() {
  const posts = await getNews({ onlyPublished: true });
  return (
    <div className="mx-auto max-w-content px-4 py-16">
      <SectionHeading eyebrow="Latest" title="News & stories" intro="Updates from our clinics, advocacy and community." />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((n: (typeof posts)[number]) => (
          <Link key={n.id} href={`/news/${n.slug}`} className="group overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-md">
            {n.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={n.coverImage} alt="" className="h-44 w-full object-cover" />
            ) : (
              <div className="h-44 w-full bg-gradient-to-br from-sage/15 to-coral/15" />
            )}
            <div className="p-5">
              {n.category ? <Badge>{n.category}</Badge> : null}
              <h3 className="mt-2 font-display text-lg text-ink group-hover:text-plum">{n.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{n.excerpt}</p>
              <p className="mt-3 text-xs text-muted">{formatDate(n.publishedAt)}</p>
            </div>
          </Link>
        ))}
      </div>
      {posts.length === 0 && <p className="mt-10 text-muted">No news yet.</p>}
    </div>
  );
}
