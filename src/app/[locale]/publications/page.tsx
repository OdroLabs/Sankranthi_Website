import Image from "next/image";
import { FileText, Download, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { EmptyState } from "@/components/site/empty-state";
import { StaggerContainer, StaggerItem } from "@/components/animations";

const categoryLabels: Record<string, string> = {
  research: "Research",
  report: "Report",
  annual: "Annual Report",
  other: "Other",
};

export default async function PublicationsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [settings, publications] = await Promise.all([
    getSettings(),
    prisma.publication.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } }),
  ]);
  const dict = getLabels(locale, settings);

  return (
    <>
      <PageHero
        title={s(settings, "publications_hero_title", locale)}
        intro={s(settings, "publications_hero_intro", locale)}
        image={s(settings, "publications_hero_image") || undefined}
        nextSurface="ivory"
      />

      <div className="surface-ivory relative overflow-hidden">
      <div className="container py-14 md:py-20">
        {publications.length === 0 ? (
          <EmptyState message={s(settings, "publications_empty_text", locale)} />
        ) : (
          <StaggerContainer className="mx-auto flex max-w-4xl flex-col">
            {publications.map((pub, i) => (
              <StaggerItem key={pub.id}>
                <article
                  className={`group relative flex flex-col gap-6 py-9 sm:flex-row sm:items-center ${
                    i === 0 ? "" : "border-t border-border"
                  }`}
                >
                  <span
                    aria-hidden
                    className="hidden shrink-0 font-serif text-sm text-muted-foreground/50 sm:block"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Cover */}
                  <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl border border-border/60 shadow-card sm:w-40 md:w-48">
                    {pub.coverImage ? (
                      <Image
                        src={pub.coverImage}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-50 to-teal-50">
                        <FileText className="h-8 w-8 text-brand-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
                        {categoryLabels[pub.category] ?? pub.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(pub.publishedAt, locale)}
                      </span>
                    </div>
                    <h2 className="text-xl font-serif font-medium leading-snug tracking-tight md:text-2xl">
                      {loc(pub, "title", locale)}
                    </h2>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {loc(pub, "description", locale)}
                    </p>
                    {pub.fileUrl && (
                      <a
                        href={pub.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-600"
                      >
                        <Download className="h-4 w-4" /> {dict.common.download}
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    )}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
      </div>
    </>
  );
}
