import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Home,
  Quote,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { RichText } from "@/components/site/rich-text";
import { formatDate } from "@/lib/utils";
import { Reveal } from "@/components/animations";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);
  const param = decodeURIComponent(slug);
  let item = await prisma.news.findFirst({ where: { slug: param } });
  if (!item && /^\d+$/.test(param)) {
    // Legacy numeric URL — look up by id and redirect to the slug URL
    item = await prisma.news.findUnique({ where: { id: Number(param) } });
    if (item?.slug) redirect(`/${locale}/news/${item.slug}`);
  }
  if (!item || !item.published) notFound();

  const latest = await prisma.news.findMany({
    where: { published: true, id: { not: item.id } },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  const highlights = loc(item, "highlights", locale).split("\n").map((h) => h.trim()).filter(Boolean);
  const rawQuote = loc(item, "quote", locale);
  const [quoteText, quoteAuthor] = rawQuote
    ? rawQuote.split("::").map((p) => p.trim())
    : ["", ""];

  return (
    <>
      {/* Banner with breadcrumb */}
      <section className="bg-grain relative overflow-hidden bg-navy-950 py-20 text-white md:py-28">
        {item.image && (
          <>
            <Image src={item.image} alt="" fill priority className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/30" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-[#202B33] via-[#2A353C]/75 to-[#202B33]/90" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#FF6F91]/[0.10] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-[#83D8B6]/[0.10] blur-3xl" />

        <div className="container relative">
          <nav className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 text-white/80 hover:text-white">
              <Home className="h-4 w-4" /> {dict.nav.home}
            </Link>
            <ChevronRight className="h-4 w-4 text-white/40" />
            <Link href={`/${locale}/news`} className="text-white/80 hover:text-white">
              {dict.nav.news}
            </Link>
          </nav>
          <p className="mb-5 flex items-center gap-1.5 text-sm text-white/70">
            <CalendarDays className="h-4 w-4" /> {formatDate(item.publishedAt, locale)}
          </p>
          <h1 className="font-serif max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            {loc(item, "title", locale)}
          </h1>
        </div>
      </section>

      <article className="container grid gap-12 py-14 md:py-20 lg:grid-cols-[1fr_340px]">
        <div className="max-w-3xl">
          {item.image && (
            <Reveal direction="up">
              <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border shadow-card">
                <Image src={item.image} alt="" fill className="object-cover" />
              </div>
            </Reveal>
          )}

          {/* Key points box */}
          {highlights.length > 0 && (
            <div className="mb-10 rounded-3xl border border-brand-500/20 bg-brand-500/[0.04] p-7">
              <h3 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-[#C94F72]">
                {dict.common.keyPoints}
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-navy-900">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article body — written in the rich editor, so it may contain
              headings, lists, links and inline images. */}
          <RichText value={loc(item, "content", locale)} className="text-base md:text-[1.05rem]" />

          {/* Optional pull quote, kept as its own field so it can be styled
              differently from a quote typed inside the editor. */}
          {quoteText && (
            <blockquote className="relative my-10 overflow-hidden rounded-3xl bg-[#202B33] p-8 text-[#F8F5F2] shadow-card md:p-10">
              <Quote className="absolute right-6 top-6 h-9 w-9 text-white/15" />
              <p className="max-w-2xl text-xl font-semibold leading-relaxed md:text-2xl">
                “{quoteText}”
              </p>
              {quoteAuthor && (
                <footer className="mt-5 flex items-center gap-3 text-sm text-white/70">
                  <span className="block h-0.5 w-8 rounded-full bg-[#FF6F91]" /> {quoteAuthor}
                </footer>
              )}
            </blockquote>
          )}

          {/* Gallery images */}
          {(item.image2 || item.image3) && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[item.image2, item.image3].filter(Boolean).map((img, i) => (
                <div
                  key={i}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border shadow-card"
                >
                  <Image
                    src={img as string}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        {latest.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border bg-muted/50 p-6">
              <h3 className="mb-5 px-1 font-serif text-lg font-bold text-navy-900">
                {s(settings, "home_news_title", locale)}
              </h3>
              <ul className="space-y-3">
                {latest.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`/${locale}/news/${n.slug ?? n.id}`}
                      className="card-glow group flex items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-4 text-sm font-semibold shadow-card transition-all hover:-translate-y-0.5 hover:text-primary"
                    >
                      <span>
                        <span className="line-clamp-2">{loc(n, "title", locale)}</span>
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">
                          {formatDate(n.publishedAt, locale)}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </article>
    </>
  );
}
