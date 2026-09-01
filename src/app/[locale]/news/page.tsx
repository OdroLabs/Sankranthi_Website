import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { toPlainText } from "@/lib/sanitize";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { EmptyState } from "@/components/site/empty-state";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";

export default async function NewsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [settings, news] = await Promise.all([
    getSettings(),
    prisma.news.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } }),
  ]);
  const dict = getLabels(locale, settings);

  const [featured, ...rest] = news;

  const excerptOf = (item: (typeof news)[number]) =>
    // The body is HTML now, so flatten it for the card preview.
    loc(item, "excerpt", locale) || toPlainText(loc(item, "content", locale), 220);

  return (
    <>
      <PageHero
        title={s(settings, "news_hero_title", locale)}
        intro={s(settings, "news_hero_intro", locale)}
        image={s(settings, "news_hero_image") || undefined}
      />

      <div className="relative overflow-hidden py-12 md:py-20">
        <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-pride-sky/10 blur-3xl" />

        <div className="container relative space-y-14">
          {featured && (
            <Reveal direction="up">
              <Link
                href={`/${locale}/news/${featured.slug ?? featured.id}`}
                className="card-glow group grid overflow-hidden rounded-3xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover lg:grid-cols-2"
              >
                {featured.image && (
                  <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                    <Image
                      src={featured.image}
                      alt=""
                      fill
                      priority
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
                  </div>
                )}
                <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-700">
                    <CalendarDays className="h-3.5 w-3.5" /> {formatDate(featured.publishedAt, locale)}
                  </span>
                  <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-navy-900 transition-colors group-hover:text-primary md:text-4xl">
                    {loc(featured, "title", locale)}
                  </h2>
                  <p className="line-clamp-3 text-base leading-relaxed text-muted-foreground">
                    {excerptOf(featured)}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 bg-spectrum bg-clip-text text-sm font-bold text-transparent">
                    {dict.common.readMore}
                    <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          {rest.length > 0 && (
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((item) => (
                <StaggerItem key={item.id} className="h-full">
                  <Link
                    href={`/${locale}/news/${item.slug ?? item.id}`}
                    className="card-glow group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    {item.image && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <CalendarDays className="h-3.5 w-3.5" /> {formatDate(item.publishedAt, locale)}
                      </p>
                      <h3 className="mb-2 font-bold leading-snug text-navy-900 transition-colors group-hover:text-primary">
                        {loc(item, "title", locale)}
                      </h3>
                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {excerptOf(item)}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                        {dict.common.readMore}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {news.length === 0 && (
            <EmptyState message={s(settings, "news_empty_text", locale)} />
          )}
        </div>
      </div>
    </>
  );
}
