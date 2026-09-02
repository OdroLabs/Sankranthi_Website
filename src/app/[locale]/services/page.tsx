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
import { resolveServiceIcon } from "@/lib/service-icons";

/**
 * Rotating rainbow accent per card — icon wash, top edge, hover ring and
 * "read more" colour — so the grid feels varied instead of a flat dashboard
 * of identical tiles. Cycled by index, independent of service content.
 */
const ACCENTS = [
  {
    bar: "bg-gradient-to-r from-[#FF6F91] to-[#FF716D]",
    icon: "bg-[#FFF0F4] ring-1 ring-[rgba(32,43,51,0.07)]",
    glow: "bg-[#FF6F91]/10",
    tint: "bg-[#FFF0F4]",
    ring: "hover:border-[rgba(255,111,145,0.25)]",
    link: "text-[#FF6F91]",
  },
  {
    bar: "bg-gradient-to-r from-[#83D8B6] to-[#83CDED]",
    icon: "bg-[#EFF9F4] ring-1 ring-[rgba(32,43,51,0.07)]",
    glow: "bg-[#83D8B6]/12",
    tint: "bg-[#EFF9F4]",
    ring: "hover:border-[rgba(131,216,182,0.35)]",
    link: "text-[#3A9A78]",
  },
  {
    bar: "bg-gradient-to-r from-[#FF9B69] to-[#FFD66B]",
    icon: "bg-[#FFF8DD] ring-1 ring-[rgba(32,43,51,0.07)]",
    glow: "bg-[#FFD66B]/20",
    tint: "bg-[#FFF8DD]",
    ring: "hover:border-[rgba(255,155,105,0.28)]",
    link: "text-[#C96A3A]",
  },
  {
    bar: "bg-gradient-to-r from-[#A995E8] to-[#83CDED]",
    icon: "bg-[#F5F1FF] ring-1 ring-[rgba(32,43,51,0.07)]",
    glow: "bg-[#A995E8]/12",
    tint: "bg-[#F5F1FF]",
    ring: "hover:border-[rgba(169,149,232,0.28)]",
    link: "text-[#6D4A7D]",
  },
  {
    bar: "bg-gradient-to-r from-[#FF716D] to-[#FF9B69]",
    icon: "bg-[#FFF3ED] ring-1 ring-[rgba(32,43,51,0.07)]",
    glow: "bg-[#FF716D]/10",
    tint: "bg-[#FFF3ED]",
    ring: "hover:border-[rgba(255,113,109,0.25)]",
    link: "text-[#C94F72]",
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
      <section className="surface-peach relative overflow-hidden py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-[0.15]" />
        <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-6">
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              return (
                <StaggerItem key={service.id} className="h-full">
                  <TiltCard className="h-full">
                    <Link
                      href={`/${locale}/services/${service.slug ?? service.id}`}
                      className={cn(
                        "group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[rgba(32,43,51,0.09)] shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-card",
                        accent.tint,
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
                        {(() => {
                          const Icon = resolveServiceIcon(service.icon);
                          return (
                            Icon && (
                              <span
                                className={cn(
                                  "mb-5 grid h-14 w-14 place-items-center rounded-2xl",
                                  accent.icon
                                )}
                              >
                                <Icon className="h-7 w-7" strokeWidth={1.75} />
                              </span>
                            )
                          );
                        })()}
                        <h2 className="mb-2.5 font-serif text-xl font-medium leading-snug text-[#202B33] transition-colors group-hover:text-[#C94F72]">
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
