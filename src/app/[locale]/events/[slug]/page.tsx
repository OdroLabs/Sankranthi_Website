import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  MapPin,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { RichText } from "@/components/site/rich-text";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations";

function parsePairs(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split("::");
      return { title: title.trim(), text: rest.join("::").trim() };
    });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);
  const param = decodeURIComponent(slug);
  let event = await prisma.event.findFirst({ where: { slug: param } });
  if (!event && /^\d+$/.test(param)) {
    // Legacy numeric URL — look up by id and redirect to the slug URL
    event = await prisma.event.findUnique({ where: { id: Number(param) } });
    if (event?.slug) redirect(`/${locale}/events/${event.slug}`);
  }
  if (!event || !event.published) notFound();

  const isPast = new Date(event.startDate) < new Date();
  const upcoming = await prisma.event.findMany({
    where: { published: true, id: { not: event.id }, startDate: { gte: new Date() } },
    orderBy: { startDate: "asc" },
    take: 3,
  });

  const title = loc(event, "title", locale);
  const content = loc(event, "content", locale) || loc(event, "description", locale);
  const highlights = loc(event, "highlights", locale).split("\n").map((h) => h.trim()).filter(Boolean);
  const agenda = parsePairs(loc(event, "agenda", locale));
  const dateText = `${formatDate(event.startDate, locale)}${
    event.endDate ? ` – ${formatDate(event.endDate, locale)}` : ""
  }`;
  const timeText = new Date(event.startDate).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {/* Banner with breadcrumb */}
      <section className="bg-grain relative overflow-hidden bg-navy-950 py-16 text-white md:py-24">
        {event.image && (
          <>
            <Image src={event.image} alt="" fill className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/30" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-brand-900/70 to-navy-900" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-pride-pink/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-6">
          <nav className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 text-white/80 hover:text-white">
              <Home className="h-4 w-4" /> {dict.nav.home}
            </Link>
            <ChevronRight className="h-4 w-4 text-white/40" />
            <Link href={`/${locale}/events`} className="text-white/80 hover:text-white">
              {dict.nav.events}
            </Link>
          </nav>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-spectrum px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {isPast ? dict.common.past : dict.common.upcoming}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-white/70">
              <CalendarDays className="h-4 w-4" /> {dateText}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <MapPin className="h-4 w-4" /> {event.location}
              </span>
            )}
          </div>
          <h1 className="max-w-3xl font-serif text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
            {title}
          </h1>
          <span className="mt-7 block h-[3px] w-20 rounded-full bg-pride-flag" />
        </div>
      </section>

      <article className="container grid gap-12 py-14 md:py-20 lg:grid-cols-[1fr_340px] lg:gap-16">
        {/* Main column */}
        <div>
          {event.image && (
            <Reveal>
              <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/60 shadow-card">
                <Image src={event.image} alt="" fill className="object-cover" />
              </div>
            </Reveal>
          )}

          <RichText value={content} />

          {/* What to expect */}
          {highlights.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-5 font-serif text-2xl font-medium tracking-tight md:text-3xl">
                {dict.common.whatToExpect}
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 rounded-2xl border border-border/60 bg-card p-4 text-sm font-medium shadow-card"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Agenda timeline */}
          {agenda.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-5 font-serif text-2xl font-medium tracking-tight md:text-3xl">
                {dict.common.agenda}
              </h3>
              <ol className="relative space-y-0 border-l-2 border-brand-200 pl-0">
                {agenda.map((a, i) => (
                  <li key={i} className="relative flex gap-4 pb-7 pl-8 last:pb-0">
                    <span className="absolute -left-[9px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-brand-600 bg-white" />
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                        <Clock className="h-3 w-3" /> {a.title}
                      </span>
                      <p className="mt-1.5 text-sm font-medium leading-relaxed">{a.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Gallery images */}
          {(event.image2 || event.image3) && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[event.image2, event.image3].filter(Boolean).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/60 shadow-card"
                >
                  <Image src={img as string} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Event facts */}
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-card">
            <span className="absolute inset-x-0 top-0 h-[3px] bg-spectrum" />
            <h3 className="mb-4 font-serif text-lg font-medium">{dict.nav.events}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span>
                  <span className="block text-xs text-muted-foreground">{dict.common.date}</span>
                  <span className="font-medium">{dateText}</span>
                  <span className="block text-xs text-muted-foreground">{timeText}</span>
                </span>
              </li>
              {event.location && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span>
                    <span className="block text-xs text-muted-foreground">
                      {dict.common.location}
                    </span>
                    <span className="font-medium">{event.location}</span>
                  </span>
                </li>
              )}
            </ul>
            <Button asChild className="mt-5 w-full rounded-full">
              <Link href={`/${locale}/contact`}>{dict.nav.contact}</Link>
            </Button>
          </div>

          {/* Upcoming events */}
          {upcoming.length > 0 && (
            <div className="rounded-3xl bg-muted/60 p-5">
              <h3 className="mb-4 px-1 font-serif text-lg font-medium">
                {s(settings, "home_events_title", locale)}
              </h3>
              <ul className="space-y-2.5">
                {upcoming.map((ev) => (
                  <li key={ev.id}>
                    <Link
                      href={`/${locale}/events/${ev.slug ?? ev.id}`}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3.5 text-sm font-semibold shadow-card transition-all hover:border-brand-300 hover:text-brand-600"
                    >
                      <span>
                        <span className="line-clamp-2">{loc(ev, "title", locale)}</span>
                        <span className="block text-xs font-normal text-muted-foreground">
                          {formatDate(ev.startDate, locale)}
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </article>
    </>
  );
}
