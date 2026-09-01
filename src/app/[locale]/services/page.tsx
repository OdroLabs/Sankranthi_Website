import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { EmptyState } from "@/components/site/empty-state";
import { TiltCard } from "@/components/site/tilt-card";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";
import { cn } from "@/lib/utils";

/**
 * Rotating rainbow accent per card — icon wash, top edge, hover ring and
 * "read more" colour — so the grid feels varied instead of a flat dashboard
 * of identical tiles. Cycled by index, independent of service content.
 */
const ACCENTS = [
  {
    bar: "bg-gradient-to-r from-brand-500 to-brand-300",
    icon: "bg-gradient-to-br from-brand-50 to-brand-100 ring-1 ring-brand-200/70",
    glow: "bg-brand-500/10",
    ring: "hover:ring-brand-300/50",
    link: "text-brand-700",
  },
  {
    bar: "bg-gradient-to-r from-pride-blue to-brand-400",
    icon: "bg-gradient-to-br from-blue-50 to-indigo-100 ring-1 ring-pride-blue/25",
    glow: "bg-pride-blue/10",
    ring: "hover:ring-pride-blue/30",
    link: "text-navy-800",
  },
  {
    bar: "bg-gradient-to-r from-teal-500 to-brand-300",
    icon: "bg-gradient-to-br from-teal-50 to-teal-100 ring-1 ring-teal-200/70",
    glow: "bg-teal-500/10",
    ring: "hover:ring-teal-300/50",
    link: "text-teal-700",
  },
  {
    bar: "bg-gradient-to-r from-pride-pink to-pride-violet",
    icon: "bg-gradient-to-br from-pink-50 to-rose-100 ring-1 ring-pride-pink/40",
    glow: "bg-pride-pink/15",
    ring: "hover:ring-pride-pink/40",
    link: "text-pride-violet",
  },
  {
    bar: "bg-gradient-to-r from-pride-orange to-pride-yellow",
    icon: "bg-gradient-to-br from-orange-50 to-amber-100 ring-1 ring-pride-orange/30",
    glow: "bg-pride-orange/10",
    ring: "hover:ring-pride-orange/40",
    link: "text-orange-700",
  },
  {
    bar: "bg-gradient-to-r from-pride-green to-teal-400",
    icon: "bg-gradient-to-br from-green-50 to-emerald-100 ring-1 ring-pride-green/25",
    glow: "bg-pride-green/10",
    ring: "hover:ring-pride-green/40",
    link: "text-pride-green",
  },
] as const;

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [settings, services] = await Promise.all([
    getSettings(),
    prisma.service.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ]);
  const dict = getLabels(locale, settings);

  return (
    <>
      <PageHero
        title={s(settings, "services_hero_title", locale)}
        intro={s(settings, "services_hero_intro", locale)}
        image={s(settings, "services_hero_image") || undefined}
      />
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-[0.15]" />
        <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-6">
          <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <StaggerItem key={service.id} className="h-full">
                  <TiltCard className="h-full">
                    <Link
                      href={`/${locale}/services/${service.slug ?? service.id}`}
                      className={cn(
                        "group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-white shadow-card ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
                        accent.ring
                      )}
                    >
                      <span className={cn("absolute inset-x-0 top-0 z-10 h-1", accent.bar)} />
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-70 blur-3xl transition-opacity duration-300 group-hover:opacity-100",
                          accent.glow
                        )}
                      />
                      {service.image && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                          <Image
                            src={service.image}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="relative flex flex-1 flex-col p-7">
                        {service.icon && (
                          <span
                            className={cn(
                              "mb-5 grid h-14 w-14 place-items-center rounded-2xl text-2xl",
                              accent.icon
                            )}
                          >
                            {service.icon}
                          </span>
                        )}
                        <h2 className="mb-2.5 font-serif text-xl font-medium leading-snug text-navy-900 transition-colors group-hover:text-primary">
                          {loc(service, "title", locale)}
                        </h2>
                        <p className="mb-6 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                          {loc(service, "description", locale)}
                        </p>
                        <span
                          className={cn(
                            "mt-auto inline-flex items-center gap-1.5 text-sm font-semibold",
                            accent.link
                          )}
                        >
                          {dict.common.readMore}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </TiltCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
          {services.length === 0 && (
            <Reveal>
              <EmptyState message={s(settings, "services_empty_text", locale)} />
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
