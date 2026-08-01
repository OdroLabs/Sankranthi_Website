import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNewsBySlug } from "@/lib/actions/news";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = await getNewsBySlug(slug);
  return { title: n?.title ?? "News" };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post || !post.published) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm uppercase tracking-widest text-coral">
        {post.category ? `${post.category} · ` : ""}{formatDate(post.publishedAt)}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">{post.title}</h1>
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImage} alt="" className="mt-8 w-full rounded-2xl object-cover" />
      ) : null}
      <div className="prose mt-8 max-w-none whitespace-pre-wrap text-ink/90">{post.content}</div>
    </article>
  );
}
