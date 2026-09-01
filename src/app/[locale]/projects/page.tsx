import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/page-hero";
import { EmptyState } from "@/components/site/empty-state";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";

export default async function ProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [settings, projects] = await Promise.all([
    getSettings(),
    prisma.project.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
  ]);
  const dict = getLabels(locale, settings);

  const [featured, ...rest] = projects;

  return (
    <>
      <PageHero
        title={s(settings, "projects_hero_title", locale)}
        intro={s(settings, "projects_hero_intro", locale)}
        image={s(settings, "projects_hero_image") || undefined}
      />

      <div className="mx-auto w-full max-w-[1400px] px-4 py-20 md:px-6 md:py-28">
        {projects.length === 0 && (
          <EmptyState message={s(settings, "projects_empty_text", locale)} />
        )}

        {featured && (
          <Reveal direction="up">
            <Link
              href={`/${locale}/projects/${featured.slug ?? featured.id}`}
              className="group card-glow relative grid overflow-hidden rounded-3xl border bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover lg:grid-cols-2"
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden lg:aspect-auto">
                {featured.image ? (
                  <Image
                    src={featured.image}
                    alt=""
                    fill
                    priority
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-brand-700 via-brand-600 to-navy-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/0 to-navy-950/0 lg:hidden" />
              </div>
              <div className="relative flex flex-col justify-center p-8 md:p-12">
                <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pride-pink/10 blur-3xl" />
                <div className="relative mb-5 flex flex-wrap items-center gap-3">
                  <Badge
                    variant={featured.status === "completed" ? "success" : "secondary"}
                    className="rounded-full capitalize"
                  >
                    {(dict.common as any)[featured.status] ?? featured.status}
                  </Badge>
                  {featured.startDate && (
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatDate(featured.startDate, locale)}
                    </span>
                  )}
                  <span className="rounded-full bg-spectrum bg-clip-text text-xs font-bold uppercase tracking-[0.2em] text-transparent">
                    Featured
                  </span>
                </div>
                <h2 className="text-display-lg font-serif font-medium tracking-tight text-navy-900 transition-colors group-hover:text-brand-700">
                  {loc(featured, "title", locale)}
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground line-clamp-4">
                  {loc(featured, "description", locale)}
                </p>
                <span className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-brand-700">
                  {dict.common.readMore}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        {rest.length > 0 && (
          <StaggerContainer className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((project, i) => {
              const wide = i % 5 === 2;
              return (
                <StaggerItem
                  key={project.id}
                  className={wide ? "sm:col-span-2" : undefined}
                >
                  <Link
                    href={`/${locale}/projects/${project.slug ?? project.id}`}
                    className={`group card-glow flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
                      wide ? "sm:flex-row" : ""
                    }`}
                  >
                    {project.image && (
                      <div
                        className={`relative w-full shrink-0 overflow-hidden ${
                          wide ? "aspect-[16/10] sm:aspect-auto sm:w-2/5" : "aspect-[16/10]"
                        }`}
                      >
                        <Image
                          src={project.image}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-center gap-2">
                        <Badge
                          variant={project.status === "completed" ? "success" : "secondary"}
                          className="rounded-full capitalize"
                        >
                          {(dict.common as any)[project.status] ?? project.status}
                        </Badge>
                        {project.startDate && (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(project.startDate, locale)}
                          </span>
                        )}
                      </div>
                      <h3 className="mb-2 text-lg font-bold leading-snug text-navy-900 transition-colors group-hover:text-brand-700">
                        {loc(project, "title", locale)}
                      </h3>
                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {loc(project, "description", locale)}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                        {dict.common.readMore}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </>
  );
}
