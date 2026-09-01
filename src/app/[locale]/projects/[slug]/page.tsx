import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Heart,
  Home,
  MapPin,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { RichText } from "@/components/site/rich-text";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";

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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);
  const param = decodeURIComponent(slug);
  let project = await prisma.project.findFirst({ where: { slug: param } });
  if (!project && /^\d+$/.test(param)) {
    // Legacy numeric URL — look up by id and redirect to the slug URL
    project = await prisma.project.findUnique({ where: { id: Number(param) } });
    if (project?.slug) redirect(`/${locale}/projects/${project.slug}`);
  }
  if (!project || !project.published) notFound();

  const others = await prisma.project.findMany({
    where: { published: true, id: { not: project.id } },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: 4,
  });

  const title = loc(project, "title", locale);
  const content = loc(project, "content", locale) || loc(project, "description", locale);
  const objectives = loc(project, "objectives", locale).split("\n").map((o) => o.trim()).filter(Boolean);
  const outcomes = parsePairs(loc(project, "outcomes", locale));
  const beneficiaries = loc(project, "beneficiaries", locale);
  const statusLabel = (dict.common as any)[project.status] ?? project.status;

  const facts = [
    {
      icon: CalendarDays,
      label: dict.common.date,
      value: project.startDate
        ? `${formatDate(project.startDate, locale)}${
            project.endDate ? ` – ${formatDate(project.endDate, locale)}` : ""
          }`
        : null,
    },
    { icon: MapPin, label: dict.common.location, value: project.location },
    { icon: Users, label: dict.common.beneficiaries, value: beneficiaries || null },
  ].filter((f) => f.value);

  // Sidebar donate card text comes from the home-page CTA settings.
  const donateTitle = s(settings, "home_donate_title", locale);
  const donateText = s(settings, "home_donate_text", locale);

  return (
    <>
      {/* Editorial banner — deep navy/violet field with a large serif title
          and the cover photo bleeding in behind it, breadcrumb up top. */}
      <section className="bg-grain relative overflow-hidden bg-navy-950 text-white">
        {project.image && (
          <>
            <div
              data-parallax="6"
              className="absolute -inset-y-[10%] inset-x-0 scale-110 bg-cover bg-center opacity-35"
              style={{ backgroundImage: `url(${project.image})` }}
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-brand-900/90 to-navy-800/85" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-pride-pink/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-16 pt-12 md:px-6 md:pb-24 md:pt-16">
          <nav className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 text-accent hover:text-white">
              <Home className="h-4 w-4" /> {dict.nav.home}
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link href={`/${locale}/projects`} className="text-white/80 hover:text-white">
              {dict.nav.projects}
            </Link>
          </nav>
          <Reveal direction="up">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Badge className="rounded-full bg-accent capitalize text-accent-foreground hover:bg-accent">
                {statusLabel}
              </Badge>
              {project.startDate && (
                <span className="flex items-center gap-1.5 text-sm text-white/80">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(project.startDate, locale)}
                  {project.endDate ? ` – ${formatDate(project.endDate, locale)}` : ""}
                </span>
              )}
              {project.location && (
                <span className="flex items-center gap-1.5 text-sm text-white/80">
                  <MapPin className="h-4 w-4" /> {project.location}
                </span>
              )}
            </div>
            <h1 className="text-display-hero max-w-3xl font-serif font-medium tracking-tight">
              {title}
            </h1>
            <span className="mt-7 block h-[3px] w-20 rounded-full bg-pride-flag" />
          </Reveal>
        </div>
      </section>

      <article className="mx-auto grid w-full max-w-[1400px] gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1fr_340px] lg:gap-16">
        {/* Main column */}
        <div>
          {project.image && (
            <Reveal direction="up">
              <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border shadow-card-hover">
                <Image src={project.image} alt="" fill priority className="object-cover" />
              </div>
            </Reveal>
          )}

          <div className="max-w-2xl">
            <RichText value={content} />
          </div>

          {/* Objectives checklist */}
          {objectives.length > 0 && (
            <StaggerContainer className="mt-10 grid gap-3 sm:grid-cols-2">
              {objectives.map((o, i) => (
                <StaggerItem key={i}>
                  <div className="flex items-start gap-2.5 rounded-xl border bg-card p-4 text-sm font-medium shadow-card">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    {o}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Gallery images */}
          {(project.image2 || project.image3) && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[project.image2, project.image3].filter(Boolean).map((img, i) => (
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

          {/* Numbered outcome cards */}
          {outcomes.length > 0 && (
            <div className="mt-14">
              <h3 className="text-display-lg mb-7 font-serif font-medium tracking-tight text-navy-900">
                {dict.common.outcomes}
              </h3>
              <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {outcomes.map((o, i) => (
                  <StaggerItem key={i}>
                    <div className="card-glow h-full rounded-2xl border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                      <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-accent text-sm font-bold text-white shadow-glow">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h4 className="mb-2 font-bold leading-snug text-navy-900">{o.title}</h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">{o.text}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Project facts */}
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-bold text-navy-900">{dict.nav.projects}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start justify-between gap-4 border-b pb-3">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="secondary" className="rounded-full capitalize">
                  {statusLabel}
                </Badge>
              </li>
              {facts.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span>
                    <span className="block text-xs text-muted-foreground">{f.label}</span>
                    <span className="font-medium">{f.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Donate card — hidden when the donate CTA text is cleared in the admin */}
          {(donateTitle || donateText) && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 via-brand-900 to-brand-700 p-7 text-white shadow-glow">
              <span className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-pride-pink/20 blur-2xl" />
              {donateTitle && (
                <h3 className="relative text-xl font-extrabold leading-tight">{donateTitle}</h3>
              )}
              {donateText && <p className="relative mt-2 text-sm text-white/75">{donateText}</p>}
              <Button
                asChild
                className="relative mt-5 w-full rounded-full bg-accent font-bold text-accent-foreground hover:bg-accent/90"
              >
                <Link href={`/${locale}/donate`}>
                  <Heart className="h-4 w-4" /> {dict.home.makeDonation}
                </Link>
              </Button>
            </div>
          )}

          {/* Other projects */}
          {others.length > 0 && (
            <div className="rounded-2xl bg-muted p-5">
              <h3 className="mb-4 px-1 font-bold text-navy-900">{dict.nav.projects}</h3>
              <ul className="space-y-2.5">
                {others.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/${locale}/projects/${p.slug ?? p.id}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3.5 text-sm font-semibold shadow-card transition-all hover:border-brand-400/40 hover:text-brand-700"
                    >
                      <span className="line-clamp-2">{loc(p, "title", locale)}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700" />
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
