import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Home,
  Phone,
  Plus,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { RichText } from "@/components/site/rich-text";
import { Button } from "@/components/ui/button";
import { Curve } from "@/components/site/curve";
import { TiltCard } from "@/components/site/tilt-card";
import { Reveal, StaggerContainer, StaggerItem, ImageReveal } from "@/components/animations";
import { cn } from "@/lib/utils";

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

/** Rotating rainbow accents for the numbered benefit cards — see services/page.tsx. */
const ACCENTS = [
  { badge: "bg-gradient-to-br from-brand-600 to-brand-400", ring: "hover:ring-brand-300/50" },
  { badge: "bg-gradient-to-br from-pride-blue to-brand-500", ring: "hover:ring-pride-blue/30" },
  { badge: "bg-gradient-to-br from-teal-600 to-teal-400", ring: "hover:ring-teal-300/50" },
  { badge: "bg-gradient-to-br from-pride-pink to-pride-violet", ring: "hover:ring-pride-pink/40" },
  { badge: "bg-gradient-to-br from-pride-orange to-pride-yellow", ring: "hover:ring-pride-orange/40" },
  { badge: "bg-gradient-to-br from-pride-green to-teal-400", ring: "hover:ring-pride-green/40" },
] as const;

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const param = decodeURIComponent(slug);
  const settings = await getSettings();
  const dict = getLabels(locale, settings);
  let service = await prisma.service.findFirst({ where: { slug: param } });
  if (!service && /^\d+$/.test(param)) {
    // Legacy numeric URL — look up by id and redirect to the slug URL
    service = await prisma.service.findUnique({ where: { id: Number(param) } });
    if (service?.slug) redirect(`/${locale}/services/${service.slug}`);
  }
  if (!service || !service.published) notFound();

  const others = await prisma.service.findMany({
    where: { published: true, id: { not: service.id } },
    orderBy: { order: "asc" },
  });

  const title = loc(service, "title", locale);
  const content = loc(service, "content", locale) || loc(service, "description", locale);
  const features = loc(service, "features", locale).split("\n").map((f) => f.trim()).filter(Boolean);
  const benefits = parsePairs(loc(service, "benefits", locale));
  const faqs = parsePairs(loc(service, "faqs", locale));
  const phone = s(settings, "phone");

  // Promo and CTA copy is shared with the home page settings.
  const contactPromoText = s(settings, "home_contact_text", locale);
  const donateTitle = s(settings, "home_donate_title", locale);
  const donateText = s(settings, "home_donate_text", locale);

  return (
    <>
      {/* Banner with breadcrumb */}
      <section className="bg-grain relative overflow-hidden bg-navy-950 text-white">
        {service.image && (
          <div
            className="absolute -inset-y-[10%] inset-x-0 scale-110 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${service.image})` }}
          />
        )}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-navy-950 via-brand-900 to-navy-800",
            service.image && "opacity-85"
          )}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-pride-pink/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-pride-yellow/10 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-20 pt-16 text-center md:px-6 md:pb-28 md:pt-20">
          <h1 className="text-display-lg mx-auto max-w-2xl font-serif font-medium tracking-tight">
            {title}
          </h1>
          <span className="mx-auto mt-6 block h-[3px] w-16 rounded-full bg-pride-flag" />
          <nav className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <Link href={`/${locale}`} className="flex items-center gap-1.5 text-accent hover:text-white">
              <Home className="h-4 w-4" /> {dict.nav.home}
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link href={`/${locale}/services`} className="text-white/80 hover:text-white">
              {dict.nav.services}
            </Link>
          </nav>
        </div>

        <Curve className="absolute inset-x-0 -bottom-px text-background" />
      </section>

      <div className="relative mx-auto grid w-full max-w-[1400px] gap-10 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <article>
          {service.image && (
            <ImageReveal className="relative mb-8 aspect-[16/9] w-full rounded-[24px] border border-border shadow-card">
              <Image src={service.image} alt="" fill className="object-cover" />
            </ImageReveal>
          )}

          <Reveal className="mb-6 flex items-center gap-4">
            {service.icon && (
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-2xl ring-1 ring-brand-200/70">
                {service.icon}
              </span>
            )}
            <h2 className="font-serif text-2xl font-medium tracking-tight text-navy-900 md:text-4xl">
              {title}
            </h2>
          </Reveal>

          <Reveal>
            <RichText value={content} />
          </Reveal>

          {/* Feature checklist */}
          {features.length > 0 && (
            <StaggerContainer className="mt-10 grid gap-3 sm:grid-cols-2">
              {features.map((f, i) => (
                <StaggerItem key={i}>
                  <div className="flex items-start gap-3 rounded-2xl border border-border bg-white p-4 text-sm font-medium shadow-card">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    {f}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* Gallery images */}
          {(service.image2 || service.image3) && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[service.image2, service.image3].filter(Boolean).map((img, i) => (
                <ImageReveal key={i} delay={i * 0.1} className="relative aspect-[4/3] rounded-[24px] border border-border shadow-card">
                  <Image src={img as string} alt="" fill className="object-cover" />
                </ImageReveal>
              ))}
            </div>
          )}

          {/* Numbered benefit cards */}
          {benefits.length > 0 && (
            <div className="mt-14">
              <Reveal className="mb-7 space-y-3">
                <h3 className="font-serif text-xl font-medium tracking-tight text-navy-900 md:text-2xl">
                  {dict.common.benefits}
                </h3>
                <span className="block h-1 w-14 rounded-full bg-spectrum" />
              </Reveal>
              <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {benefits.map((b, i) => {
                  const accent = ACCENTS[i % ACCENTS.length];
                  return (
                    <StaggerItem key={i} className="h-full">
                      <TiltCard className="h-full">
                        <div
                          className={cn(
                            "card-glow h-full rounded-[24px] border border-border bg-white p-6 shadow-card ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1",
                            accent.ring
                          )}
                        >
                          <span
                            className={cn(
                              "mb-4 grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white",
                              accent.badge
                            )}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h4 className="mb-2 font-bold leading-snug text-navy-900">{b.title}</h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">{b.text}</p>
                        </div>
                      </TiltCard>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
          )}

          {/* FAQ accordion */}
          {faqs.length > 0 && (
            <div className="mt-14">
              <Reveal className="mb-7 space-y-3">
                <h3 className="font-serif text-xl font-medium tracking-tight text-navy-900 md:text-2xl">FAQ</h3>
                <span className="block h-1 w-14 rounded-full bg-spectrum" />
              </Reveal>
              <Reveal className="space-y-3">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    open={i === 0}
                    className="group overflow-hidden rounded-2xl border border-border bg-white shadow-card open:border-primary/40 open:bg-primary/[0.03]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-navy-900 [&::-webkit-details-marker]:hidden">
                      {faq.title}
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-primary transition-transform group-open:rotate-45">
                        <Plus className="h-4 w-4" />
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.text}
                    </p>
                  </details>
                ))}
              </Reveal>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
          {others.length > 0 && (
            <Reveal direction="right" className="rounded-[24px] border border-border bg-white p-5 shadow-card">
              <h3 className="mb-4 px-1 font-serif text-lg font-medium text-navy-900">{dict.nav.services}</h3>
              <ul className="space-y-2.5">
                {others.map((sv) => (
                  <li key={sv.id}>
                    <Link
                      href={`/${locale}/services/${sv.slug ?? sv.id}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3.5 text-sm font-semibold transition-all hover:border-primary/40 hover:bg-white hover:text-primary hover:shadow-card"
                    >
                      <span className="flex items-center gap-2.5">
                        {sv.icon && <span className="text-lg">{sv.icon}</span>}
                        {loc(sv, "title", locale)}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {/* Contact promo card */}
          <Reveal direction="right" delay={0.1}>
            <div className="bg-grain relative overflow-hidden rounded-[24px] bg-gradient-to-br from-navy-950 via-brand-900 to-brand-700 p-7 text-white">
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-pride-pink/20 blur-3xl" />
              <h3 className="relative font-serif text-2xl font-medium leading-tight">{dict.home.getSupport}</h3>
              {/* Body copy comes from Site Settings → Home Page → Get in touch band. */}
              {contactPromoText && (
                <p className="relative mt-2 text-sm text-white/75">{contactPromoText}</p>
              )}
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground"
                >
                  <Phone className="h-4 w-4" /> {phone}
                </a>
              )}
              <Button
                asChild
                variant="outline"
                className="relative mt-4 w-full rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link href={`/${locale}/contact`}>{dict.nav.contact}</Link>
              </Button>
            </div>
          </Reveal>
        </aside>
      </div>

      {/* CTA band */}
      <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 md:px-6">
        <Reveal direction="scale">
          <div className="relative overflow-hidden rounded-[24px] bg-spectrum p-10 text-white shadow-glow md:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div>
                {donateTitle && (
                  <h2 className="max-w-xl font-serif text-2xl font-medium md:text-3xl">{donateTitle}</h2>
                )}
                {donateText && <p className="mt-2 max-w-xl text-white/85">{donateText}</p>}
              </div>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-7 font-bold text-brand-700 hover:bg-white/90"
              >
                <Link href={`/${locale}/donate`}>
                  {dict.home.makeDonation} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
