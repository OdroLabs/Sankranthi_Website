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

  return (
    <>
      <PageHero
        title={s(settings, "projects_hero_title", locale)}
        intro={s(settings, "projects_hero_intro", locale)}
        image={s(settings, "projects_hero_image") || undefined}
        nextSurface="ivory"
      />

      <div className="surface-ivory relative overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-14 md:px-6 md:py-20">
        {projects.length === 0 && (
          <EmptyState message={s(settings, "projects_empty_text", locale)} />
        )}

        {projects.length > 0 && (
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              return (
                <StaggerItem key={project.id}>
                  <Link
                    href={`/${locale}/projects/${project.slug ?? project.id}`}
                    className="group card-glow flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    {project.image && (
                      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
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
                          {dict.common[project.status as keyof typeof dict.common] ?? project.status}
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
      </div>
    </>
  );
}
