import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, show } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/site/page-hero";
import { Section } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";

export default async function EventsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const now = new Date();
  const [settings, upcoming, past, gallery] = await Promise.all([
    getSettings(),
    prisma.event.findMany({
      where: { published: true, startDate: { gte: now } },
      orderBy: { startDate: "asc" },
    }),
    prisma.event.findMany({
      where: { published: true, startDate: { lt: now } },
      orderBy: { startDate: "desc" },
      take: 6,
    }),
    prisma.galleryImage.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
  ]);
  const dict = getLabels(locale, settings);

  const upcomingTitle = s(settings, "home_events_title", locale);
  const galleryTitle = s(settings, "gallery_title", locale);
  const showGallery = show(settings, "show_gallery", gallery);
  const emptyText = s(settings, "events_empty_text", locale);

  const EventRow = ({ event, isPast }: { event: (typeof upcoming)[number]; isPast?: boolean }) => {
    const d = new Date(event.startDate);
    const day = d.toLocaleDateString(locale, { day: "2-digit" });
    const month = d.toLocaleDateString(locale, { month: "short" });
    const year = d.toLocaleDateString(locale, { year: "numeric" });

    return (
      <Link
        href={`/${locale}/events/${event.slug ?? event.id}`}
        className="group relative flex flex-col gap-6 border-t border-border py-8 first:border-t-0 sm:flex-row sm:items-center"
      >
        {/* Date block */}
        <div className="flex shrink-0 items-baseline gap-3 sm:w-28 sm:flex-col sm:items-start sm:gap-0">
          <span className="font-serif text-3xl font-medium leading-none tracking-tight text-foreground md:text-4xl">
            {day}
          </span>
          <span className="text-sm font-semibold uppercase tracking-widest text-brand-600">
            {month} {year}
          </span>
        </div>

        {/* Thumbnail */}
        {event.image && (
          <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border border-border/60 shadow-card sm:h-20 sm:w-28">
            <Image
              src={event.image}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                isPast
                  ? "border border-border text-muted-foreground"
                  : "border border-brand-200 bg-brand-50 text-brand-700"
              }`}
            >
              {isPast ? dict.common.past : dict.common.upcoming}
            </span>
            {event.location && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {event.location}
              </span>
            )}
          </div>
          <h3 className="text-lg font-serif font-medium leading-snug tracking-tight transition-colors group-hover:text-brand-600 md:text-xl">
            {loc(event, "title", locale)}
          </h3>
          <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {loc(event, "description", locale)}
          </p>
        </div>

        <span className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 sm:inline-flex">
          {dict.common.readMore}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    );
  };

  return (
    <>
      <PageHero
        title={s(settings, "events_hero_title", locale)}
        intro={s(settings, "events_hero_intro", locale)}
        image={s(settings, "events_hero_image") || undefined}
        nextSurface="ivory"
      />

      <div className="surface-ivory relative overflow-hidden">
      {/* Upcoming — hidden entirely when there is nothing scheduled and no
          empty-state message has been set in the admin. */}
      {(upcoming.length > 0 || emptyText) && (
        <Section title={upcoming.length > 0 ? upcomingTitle : undefined}>
          <div className="mx-auto flex max-w-4xl flex-col">
            {upcoming.length > 0 ? (
              <StaggerContainer className="flex flex-col">
                {upcoming.map((event) => (
                  <StaggerItem key={event.id}>
                    <EventRow event={event} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <EmptyState message={emptyText} />
            )}
          </div>
        </Section>
      )}

      {past.length > 0 && (
        <Section
          title={dict.common.past}
          className={upcoming.length > 0 || emptyText ? "pt-0" : ""}
        >
          <div className="mx-auto flex max-w-4xl flex-col opacity-80">
            {past.map((event) => (
              <EventRow key={event.id} event={event} isPast />
            ))}
          </div>
        </Section>
      )}

      {showGallery && (
        <section className="relative overflow-hidden bg-[#202B33] text-[#F8F5F2]">
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#FF6F91]/[0.10] blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#83D8B6]/[0.10] blur-3xl" />
          <Section
            title={galleryTitle}
            className="relative [&_h2]:text-white [&_h2]:font-serif [&_h2]:font-medium"
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {gallery.map((img, i) => {
                const caption = loc(img, "caption", locale);
                return (
                  <Reveal key={img.id} direction="scale" delay={Math.min(i * 0.05, 0.4)}>
                    <figure className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10">
                      <Image
                        src={img.image}
                        alt={caption}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {caption && (
                        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {caption}
                        </figcaption>
                      )}
                    </figure>
                  </Reveal>
                );
              })}
            </div>
          </Section>
        </section>
      )}
      </div>
    </>
  );
}
