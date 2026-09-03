import Link from "next/link";
import {
  Heart,
  ArrowRight,
  CalendarDays,
  MapPin,
  PhoneCall,
  Mail,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sNum, show } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestimonialsPanel } from "@/components/site/testimonials-panel";
import { HomeEditorialHero } from "@/components/site/home-editorial-hero";
import { ServiceCard } from "@/components/site/service-card";
import { TiltCard } from "@/components/site/tilt-card";
import { Reveal, StaggerContainer, StaggerItem, CountUp } from "@/components/animations";

function SectionTag({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] ${
        light ? "text-[#C94F72]" : "text-[#C94F72]"
      }`}
    >
      <span className={`block h-0.5 w-8 rounded-full ${light ? "bg-[#FF6F91]" : "bg-[#FF6F91]"}`} />
      {children}
    </p>
  );
}

/** Turn an admin-entered link into a locale-aware href. */
function link(locale: string, value: string): string {
  const target = value || "/";
  if (/^(https?:)?\/\//.test(target) || target.startsWith("mailto:") || target.startsWith("tel:"))
    return target;
  return `/${locale}${target.startsWith("/") ? target : `/${target}`}`;
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  // How many items each list section shows is configurable in the admin.
  const servicesCount = sNum(settings, "home_services_count", 6);
  const projectsCount = sNum(settings, "home_projects_count", 4);
  const newsCount = sNum(settings, "home_news_count", 3);
  const eventsCount = sNum(settings, "home_events_count", 2);

  const [stats, services, projects, news, events, testimonials, partners] = await Promise.all([
    prisma.stat.findMany({ orderBy: { order: "asc" } }),
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: servicesCount,
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: projectsCount,
    }),
    prisma.news.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: newsCount,
    }),
    prisma.event.findMany({
      where: { published: true, startDate: { gte: new Date() } },
      orderBy: { startDate: "asc" },
      take: eventsCount,
    }),
    prisma.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.partner.findMany({ orderBy: { order: "asc" } }),
  ]);

  /* ------------------------------- Content ------------------------------- */
  const phone = s(settings, "phone");
  const email = s(settings, "email");
  const address = s(settings, "address", locale);

  const heroImage = s(settings, "hero_image");
  const heroRightsImage = s(settings, "hero_rights_image");
  const heroOpportunityImage = s(settings, "hero_opportunity_image");
  const heroCommunityImage = s(settings, "hero_community_image");
  const heroDignityImage = s(settings, "hero_dignity_image");
  const heroTitle = s(settings, "hero_title", locale);
  const heroSubtitle = s(settings, "hero_subtitle", locale);
  const heroCta1Label = s(settings, "hero_cta1_label", locale);
  const heroCta2Label = s(settings, "hero_cta2_label", locale);
  const heroScrollLabel = s(settings, "hero_scroll_label", locale);

  const aboutTitle = s(settings, "home_about_title", locale);
  const aboutText = s(settings, "home_about_text", locale);
  const statsTitle = s(settings, "home_stats_title", locale);
  const statsImage = s(settings, "home_stats_image");

  const servicesTitle = s(settings, "home_services_title", locale);
  const servicesText = s(settings, "home_services_text", locale);
  const servicesLinkLabel = s(settings, "home_services_link_label", locale);

  const projectsTitle = s(settings, "home_projects_title", locale);
  const projectsText = s(settings, "home_projects_text", locale);
  const projectsLinkLabel = s(settings, "home_projects_link_label", locale);

  const contactTitle = s(settings, "home_contact_title", locale);
  const contactText = s(settings, "home_contact_text", locale);
  const contactCardTitle = s(settings, "home_contact_card_title", locale);
  const contactImage = s(settings, "home_contact_image");
  const contactButton = s(settings, "home_contact_button", locale);

  const testimonialsTitle = s(settings, "home_testimonials_title", locale);
  const newsTitle = s(settings, "home_news_title", locale);
  const newsFacebookLabel = s(settings, "home_news_facebook_label", locale);
  const eventsTitle = s(settings, "home_events_title", locale);
  const eventsLinkLabel = s(settings, "home_events_link_label", locale);
  const partnersTitle = s(settings, "home_partners_title", locale);

  const donateTitle = s(settings, "home_donate_title", locale);
  const donateText = s(settings, "home_donate_text", locale);
  const donateButton = s(settings, "home_donate_button", locale);
  const donateButton2 = s(settings, "home_donate_button2", locale);

  /* ---------------------- Which sections actually render ------------------ */
  const showHero = Boolean(heroTitle || heroSubtitle);
  const showAbout = show(settings, "show_home_about", aboutTitle, aboutText);
  const showStats = show(settings, "show_home_stats", stats);
  const showServices = show(settings, "show_home_services", services);
  const showProjects = show(settings, "show_home_projects", projects);
  const showContact = show(settings, "show_home_contact", contactTitle, contactText, phone, email);
  const showTestimonials = show(settings, "show_home_testimonials", testimonials);
  const showNews = show(settings, "show_home_news", news);
  const showEvents = show(settings, "show_home_events", events);
  const showPartners = show(settings, "show_home_partners", partners);
  const showDonate = show(settings, "show_home_donate", donateTitle, donateText);

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero — scroll-driven living-thread story */}
      {/* ------------------------------------------------------------------ */}
      {showHero && (
        <HomeEditorialHero
          title={heroTitle || undefined}
          subtitle={heroSubtitle || undefined}
          primaryAction={
            heroCta1Label
              ? {
                  label: heroCta1Label,
                  href: link(locale, s(settings, "hero_cta1_link")),
                }
              : undefined
          }
          secondaryAction={
            heroCta2Label
              ? {
                  label: heroCta2Label,
                  href: link(locale, s(settings, "hero_cta2_link")),
                }
              : undefined
          }
          galleryImages={[
            heroImage,
            heroRightsImage || projects[0]?.image,
            heroOpportunityImage || services[0]?.image,
            heroCommunityImage || projects[1]?.image,
            heroDignityImage || heroImage,
          ].filter((value): value is string => Boolean(value))}
          scrollLabel={heroScrollLabel || undefined}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Who we are                                                          */}
      {/* ------------------------------------------------------------------ */}
      {showAbout && (
        <section id="sec-about" className="relative overflow-hidden border-y border-[#F2E7E3] bg-[#FFFDF9] py-16 md:py-20">
          <div className="pointer-events-none absolute -left-16 top-1/2 h-28 w-72 -translate-y-1/2 rounded-[50%] border-t-2 border-[#83D8B6]/40" />
          <div className="pointer-events-none absolute -right-16 top-1/2 h-28 w-72 -translate-y-1/2 rounded-[50%] border-t-2 border-[#FF6F91]/35" />
          <Reveal className="relative mx-auto max-w-4xl px-6 text-center">
            {s(settings, "home_about_eyebrow", locale) && (
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#F35F62]">
                {s(settings, "home_about_eyebrow", locale)}
              </p>
            )}
            {aboutTitle && (
              <h2 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-medium leading-[1.08] tracking-normal text-[#20313A] md:text-5xl">
                {aboutTitle}
              </h2>
            )}
            <span className="mx-auto mt-5 block h-0.5 w-14 bg-[#F35F62]" />
            {aboutText && (
              <p className="mx-auto mt-5 max-w-3xl whitespace-pre-line text-sm leading-6 text-[#647078] md:text-base md:leading-7">
                {aboutText}
              </p>
            )}
          </Reveal>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Impact stats — rainbow band with curves                             */}
      {/* ------------------------------------------------------------------ */}
      {showStats && (
        <section id="sec-stats" className="relative">
          <div className="surface-mint relative overflow-hidden py-12 text-charcoal-900 md:py-14">
            {statsImage && (
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute -inset-y-[14%] inset-x-0 scale-110 bg-cover bg-center opacity-10"
                  style={{ backgroundImage: `url(${statsImage})` }}
                />
              </div>
            )}
            <span className="pointer-events-none absolute inset-x-0 -top-10 text-center font-serif text-[9rem] leading-none text-[#3AAE91]/[0.045] md:text-[14rem]">
              IMPACT
            </span>

            <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 relative">
              {(statsTitle || s(settings, "home_stats_eyebrow", locale)) && (
                <Reveal className="mx-auto mb-8 max-w-2xl space-y-2 text-center">
                  {s(settings, "home_stats_eyebrow", locale) && (
                    <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[#F35F62]">
                      {s(settings, "home_stats_eyebrow", locale)}
                    </p>
                  )}
                  {statsTitle && (
                    <h2 className="font-serif text-2xl font-medium tracking-normal text-[#20313A] md:text-3xl">{statsTitle}</h2>
                  )}
                </Reveal>
              )}
              <StaggerContainer className="grid grid-cols-2 md:grid-cols-4">
                {stats.map((stat, index) => {
                  const StatIcon = [Heart, Sparkles, CalendarDays, MapPin][index % 4];
                  return (
                  <StaggerItem key={stat.id}>
                    <div className={`h-full px-4 py-5 text-center md:px-7 ${index > 0 ? "border-l border-[#3AAE91]/20" : ""}`}>
                      <p className="font-number text-3xl font-extrabold text-[#2D9F84] md:text-4xl">
                        <CountUp value={stat.value} />
                      </p>
                      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#52656B] md:text-sm">
                        <StatIcon className="h-4 w-4 text-[#2D9F84]" />
                        {loc(stat, "label", locale)}
                      </p>
                    </div>
                  </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Services                                                            */}
      {/* ------------------------------------------------------------------ */}
      {showServices && (
        <section id="sec-services" className="surface-peach relative overflow-hidden py-12 md:py-20">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-gradient-to-b from-[#EFF9F4] to-transparent" />
          <div className="pointer-events-none absolute -right-40 top-24 h-80 w-80 rounded-full bg-[#FF9B69]/[0.10] blur-3xl" />
          <div className="pointer-events-none absolute -left-32 bottom-10 h-64 w-64 rounded-full bg-[#FFD66B]/[0.10] blur-3xl" />
          <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 relative">
            {(servicesTitle || servicesText || s(settings, "home_services_eyebrow", locale)) && (
              <Reveal className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  {s(settings, "home_services_eyebrow", locale) && (
                    <SectionTag>{s(settings, "home_services_eyebrow", locale)}</SectionTag>
                  )}
                  {servicesTitle && (
                    <h2 className="text-display-xl mt-3 font-serif font-medium tracking-tight text-charcoal-900">
                      {servicesTitle}
                    </h2>
                  )}
                </div>
                {servicesText && (
                  <p className="max-w-sm leading-relaxed text-muted-foreground lg:text-right">
                    {servicesText}
                  </p>
                )}
              </Reveal>
            )}
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <StaggerItem key={service.id} className="h-full">
                  <ServiceCard
                    href={`/${locale}/services/${service.slug ?? service.id}`}
                    icon={service.icon}
                    title={loc(service, "title", locale)}
                    description={loc(service, "description", locale)}
                    readMoreLabel={dict.common.readMore}
                    index={index}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
            {servicesLinkLabel && (
              <Reveal className="mt-9 text-center">
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-semibold">
                  <Link href={`/${locale}/services`}>{servicesLinkLabel}</Link>
                </Button>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Featured projects                                                   */}
      {/* ------------------------------------------------------------------ */}
      {showProjects && (
        <section id="sec-projects" className="surface-ivory relative overflow-hidden py-12 md:py-20">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-gradient-to-b from-[#FFF3ED] to-transparent" />
          <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#A995E8]/[0.08] blur-3xl" />
          <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 relative">
            {(projectsTitle || projectsText || s(settings, "home_projects_eyebrow", locale)) && (
              <Reveal className="mb-9 max-w-3xl space-y-3">
                {s(settings, "home_projects_eyebrow", locale) && (
                  <SectionTag>{s(settings, "home_projects_eyebrow", locale)}</SectionTag>
                )}
                {projectsTitle && (
                  <h2 className="text-display-xl font-serif font-medium tracking-tight text-charcoal-900">
                    {projectsTitle}
                  </h2>
                )}
                {projectsText && (
                  <p className="leading-relaxed text-muted-foreground">{projectsText}</p>
                )}
              </Reveal>
            )}

            {(() => {
              const [featured, ...rest] = projects;
              const projectCard = (project: (typeof projects)[number], big?: boolean) => (
                <Link
                  key={project.id}
                  href={`/${locale}/projects/${project.slug ?? project.id}`}
                  className={`group flex h-full flex-col overflow-hidden rounded-[20px] border border-[rgba(32,43,51,0.09)] bg-[#FFFDF9] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,111,145,0.25)] hover:shadow-card ${
                    big ? "lg:flex-row" : ""
                  }`}
                >
                  {project.image && (
                    <div
                      className={`relative overflow-hidden ${
                        big ? "aspect-[5/4] lg:aspect-auto lg:w-1/2" : "aspect-[5/4]"
                      }`}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{ backgroundImage: `url(${project.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#202B33]/55 via-[#202B33]/10 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
                      <Badge className="glass-light absolute left-4 top-4 rounded-full border-0 font-semibold capitalize text-charcoal-900 shadow-sm hover:bg-white/80">
                        {(dict.common as any)[project.status] ?? project.status}
                      </Badge>
                    </div>
                  )}
                  <div
                    className={`flex flex-1 flex-col gap-2 p-6 ${big ? "lg:justify-center lg:p-10" : ""}`}
                  >
                    <h3
                      className={`font-bold leading-snug text-charcoal-900 transition-colors group-hover:text-[#C94F72] ${
                        big ? "text-xl md:text-2xl" : ""
                      }`}
                    >
                      {loc(project, "title", locale)}
                    </h3>
                    <p
                      className={`leading-relaxed text-muted-foreground ${
                        big ? "line-clamp-3 text-base" : "line-clamp-3 text-sm"
                      }`}
                    >
                      {loc(project, "description", locale)}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-[#C94F72]">
                      {dict.common.readMore}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </div>
                </Link>
              );

              return (
                <div className="space-y-6">
                  {featured && (
                    <StaggerContainer>
                      <StaggerItem>{projectCard(featured, true)}</StaggerItem>
                    </StaggerContainer>
                  )}
                  {rest.length > 0 && (
                    <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {rest.map((project) => (
                        <StaggerItem key={project.id}>{projectCard(project)}</StaggerItem>
                      ))}
                    </StaggerContainer>
                  )}
                </div>
              );
            })()}

            {projectsLinkLabel && (
              <Reveal className="mt-9 text-center">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full bg-white px-8 font-semibold"
                >
                  <Link href={`/${locale}/projects`}>{projectsLinkLabel}</Link>
                </Button>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Get in touch — warm supportive band                                 */}
      {/* ------------------------------------------------------------------ */}
      {showContact && (
        <section id="sec-contact" className="surface-blush relative overflow-hidden py-12 text-charcoal-900 md:py-20">
          {contactImage && (
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute -inset-y-[14%] inset-x-0 scale-110 bg-cover bg-center opacity-[0.08]"
                  style={{ backgroundImage: `url(${contactImage})` }}
                />
              </div>
            )}
            <div className="pointer-events-none absolute -right-16 top-8 h-64 w-64 rounded-full bg-[#FF6F91]/[0.08] blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-[#FF9B69]/[0.10] blur-3xl" />

            <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 relative grid items-center gap-9 lg:grid-cols-[0.85fr_1.15fr]">
              <Reveal direction="scale">
                <TiltCard className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[20px] border border-[rgba(32,43,51,0.09)] bg-[#FFF3ED] p-8 text-center text-charcoal-900 shadow-sm">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#FF6F91]/[0.10] blur-2xl" />
                  <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-white/70 ring-1 ring-[rgba(32,43,51,0.07)]">
                    <PhoneCall className="h-6 w-6 text-[#C94F72]" />
                  </span>
                  {contactCardTitle && (
                    <h3 className="text-2xl font-extrabold">{contactCardTitle}</h3>
                  )}
                  <span className="mx-auto my-4 block h-0.5 w-8 rounded-full bg-charcoal-900/25" />
                  {address && <p className="whitespace-pre-line text-sm text-charcoal-800/85">{address}</p>}
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="mt-4 block font-number text-xl font-bold text-charcoal-900 hover:underline"
                    >
                      {phone}
                    </a>
                  )}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-sm text-charcoal-800/85 hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5" /> {email}
                    </a>
                  )}
                </TiltCard>
              </Reveal>
              <Reveal delay={0.15}>
                {s(settings, "home_contact_eyebrow", locale) && (
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C94F72]">
                    {s(settings, "home_contact_eyebrow", locale)}
                  </p>
                )}
                {contactTitle && (
                  <h2 className="text-display-xl mt-3 font-serif font-medium tracking-tight text-charcoal-900">
                    {contactTitle}
                  </h2>
                )}
                <span className="mt-4 flex gap-1.5">
                  <span className="block h-1 w-8 rounded-full bg-[#FF6F91]" />
                  <span className="block h-1 w-4 rounded-full bg-[#FF6F91]/40" />
                </span>
                {contactText && (
                  <p className="mt-6 max-w-xl whitespace-pre-line leading-relaxed text-charcoal-700">
                    {contactText}
                  </p>
                )}
                {contactButton && (
                  <Button
                    asChild
                    size="lg"
                    className="mt-8 rounded-full bg-[#202B33] px-8 font-bold text-white shadow-[0_10px_28px_rgba(32,43,51,0.18)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#2A353C]"
                  >
                    <Link href={`/${locale}/contact`}>
                      {contactButton} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </Reveal>
            </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Testimonials                                                        */}
      {/* ------------------------------------------------------------------ */}
      {showTestimonials && (
        <section id="sec-testimonials" className="surface-lavender relative py-12 md:py-20">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-gradient-to-b from-[#FFF0F4] to-transparent" />
          <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
          <Reveal>
            <TestimonialsPanel
              eyebrow={s(settings, "home_testimonials_eyebrow", locale) || undefined}
              title={testimonialsTitle || undefined}
              items={testimonials.map((t) => ({
                quote: loc(t, "quote", locale),
                author: loc(t, "author", locale),
              }))}
            />
          </Reveal>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* News — migrated 1:1 from the legacy static site's news-section      */}
      {/* ------------------------------------------------------------------ */}
      {showNews && (
        <section id="sec-news" className="surface-ivory relative pb-12 pt-4 md:pb-20">
          <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
          {(newsTitle || s(settings, "home_news_eyebrow", locale)) && (
            <Reveal className="mb-12 max-w-2xl space-y-3">
              {s(settings, "home_news_eyebrow", locale) && (
                <SectionTag>{s(settings, "home_news_eyebrow", locale)}</SectionTag>
              )}
              {newsTitle && (
                <h2 className="text-display-xl font-serif font-medium tracking-tight text-charcoal-900">
                  {newsTitle}
                </h2>
              )}
            </Reveal>
          )}

          {(() => {
            const [featured, ...rest] = news;
            const newsCard = (item: (typeof news)[number], big?: boolean) => (
              <Link
                key={item.id}
                href={`/${locale}/news/${item.slug ?? item.id}`}
                className={`group flex h-full flex-col overflow-hidden rounded-[28px] border border-[rgba(32,43,51,0.07)] bg-[#FFFDF9] shadow-card transition-all duration-300 hover:-translate-y-[5px] hover:border-[rgba(255,111,145,0.25)] hover:shadow-card-hover ${
                  big ? "lg:flex-row" : ""
                }`}
              >
                {item.image && (
                  <div
                    className={`relative overflow-hidden ${
                      big ? "aspect-[16/10] lg:aspect-auto lg:w-1/2" : "aspect-[16/10]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={loc(item, "title", locale)}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#202B33]/50 via-transparent to-transparent" />
                  </div>
                )}
                <div className={`flex flex-1 flex-col gap-2.5 p-6 ${big ? "lg:justify-center lg:p-10" : ""}`}>
                  <time
                    dateTime={new Date(item.publishedAt).toISOString()}
                    className="text-xs font-bold uppercase tracking-[0.14em] text-[#C94F72]"
                  >
                    {formatDate(item.publishedAt, locale)}
                  </time>
                  <h3
                    className={`font-bold leading-snug text-charcoal-900 transition-colors group-hover:text-[#C94F72] ${
                      big ? "text-xl md:text-2xl" : "text-base"
                    }`}
                  >
                    {loc(item, "title", locale)}
                  </h3>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-bold text-[#C94F72]">
                    {dict.common.readMore}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            );

            return (
              <div className="space-y-6">
                {featured && (
                  <StaggerContainer>
                    <StaggerItem>{newsCard(featured, true)}</StaggerItem>
                  </StaggerContainer>
                )}
                {rest.length > 0 && (
                  <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((item) => (
                      <StaggerItem key={item.id}>{newsCard(item)}</StaggerItem>
                    ))}
                  </StaggerContainer>
                )}
              </div>
            );
          })()}

          {s(settings, "facebook") && newsFacebookLabel && (
            <Reveal className="mt-12 text-center">
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-semibold">
                <a href={s(settings, "facebook")} target="_blank" rel="noopener noreferrer">
                  {newsFacebookLabel}
                </a>
              </Button>
            </Reveal>
          )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Events                                                              */}
      {/* ------------------------------------------------------------------ */}
      {showEvents && (
        <section className="surface-ivory relative pb-16 md:pb-24">
          <div id="sec-events" className="mx-auto max-w-2xl px-4 md:px-6">
            <Reveal className="mb-8 space-y-3 text-center">
              {s(settings, "home_events_eyebrow", locale) && (
                <SectionTag>{s(settings, "home_events_eyebrow", locale)}</SectionTag>
              )}
              {eventsTitle && (
                <h2 className="text-display-lg font-serif font-medium tracking-tight text-charcoal-900">{eventsTitle}</h2>
              )}
            </Reveal>
            <StaggerContainer className="divide-y divide-[rgba(32,43,51,0.07)] overflow-hidden rounded-[28px] border border-[rgba(32,43,51,0.07)] bg-[#FFFDF9] shadow-card">
              {events.map((event) => (
                <StaggerItem key={event.id}>
                  <Link
                    href={`/${locale}/events/${event.slug ?? event.id}`}
                    className="group relative flex items-center gap-4 px-6 py-5 transition-colors duration-300 hover:bg-[#FFF0F4]"
                  >
                    <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF617F] to-[#FF846F] text-white shadow-[0_10px_24px_rgba(255,97,127,0.22)] transition-transform duration-300 group-hover:scale-105">
                      <span className="font-number text-xl font-bold leading-none">
                        {new Date(event.startDate).getDate()}
                      </span>
                      <span className="mt-0.5 text-[10px] uppercase">
                        {new Date(event.startDate).toLocaleString("en", { month: "short" })}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold leading-snug text-charcoal-900 transition-colors group-hover:text-[#C94F72]">
                        {loc(event, "title", locale)}
                      </h3>
                      {event.location && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 text-[#C94F72]" /> {event.location}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#C94F72] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
            {eventsLinkLabel && (
              <Reveal className="mt-5">
                <Button asChild variant="outline" className="w-full rounded-full font-semibold">
                  <Link href={`/${locale}/events`}>
                    <CalendarDays className="h-4 w-4" /> {eventsLinkLabel}
                  </Link>
                </Button>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Partners                                                            */}
      {/* ------------------------------------------------------------------ */}
      {showPartners && (
        <section id="sec-partners" className="surface-ivory relative pb-16 md:pb-24">
          <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
          {(partnersTitle || s(settings, "home_partners_eyebrow", locale)) && (
            <div data-animate className="mx-auto mb-10 max-w-2xl text-center">
              {s(settings, "home_partners_eyebrow", locale) && (
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C94F72]">
                  {s(settings, "home_partners_eyebrow", locale)}
                </p>
              )}
              {partnersTitle && (
                <h2 className="mt-2 text-2xl font-serif font-medium tracking-tight text-charcoal-900 md:text-3xl">
                  {partnersTitle}
                </h2>
              )}
              <span className="living-spectrum-line mx-auto mt-3" />
            </div>
          )}
          <div data-stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-center rounded-[24px] border border-[rgba(32,43,51,0.07)] bg-[#FFFDF9] px-4 py-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,111,145,0.25)] hover:shadow-card-hover"
              >
                {partner.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-10 w-auto object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  <span className="text-sm font-semibold text-[#6D4A7D]">{partner.name}</span>
                )}
              </div>
            ))}
          </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Donate CTA                                                          */}
      {/* ------------------------------------------------------------------ */}
      {showDonate && (
        <section id="sec-donate" className="surface-cream relative pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
          <Reveal direction="scale">
            <div className="donate-spectrum-wash cta-gradient-shift relative grid items-center gap-8 overflow-hidden rounded-[2rem] border border-[#2D9F84]/20 p-10 text-[#202B33] shadow-[0_18px_50px_rgba(45,159,132,0.10)] md:grid-cols-[1.2fr_auto] md:p-14">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-pride-flag" />
              <span className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-pride-pink/[0.22] blur-3xl" />
              <span className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-teal-500/[0.22] blur-3xl" />
              <span className="pointer-events-none absolute right-1/4 top-1/2 h-40 w-40 rounded-full bg-pride-yellow/[0.2] blur-3xl" />
              <span className="pointer-events-none absolute -left-10 bottom-1/4 h-44 w-44 rounded-full bg-pride-violet/[0.2] blur-3xl" />
              <div className="relative">
                {s(settings, "home_donate_eyebrow", locale) && (
                  <p className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#237E6A]">
                    <span className="block h-0.5 w-8 rounded-full bg-[#2D9F84]" />
                    {s(settings, "home_donate_eyebrow", locale)}
                  </p>
                )}
                {donateTitle && (
                  <h2 className="text-display-xl mt-4 max-w-2xl font-serif font-medium">{donateTitle}</h2>
                )}
                {donateText && (
                  <p className="mt-3 max-w-xl whitespace-pre-line leading-relaxed text-[#667078]">
                    {donateText}
                  </p>
                )}
              </div>
              {(donateButton || donateButton2) && (
                <div className="relative flex flex-wrap gap-3">
                  {donateButton && (
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-gradient-to-r from-[#FF6178] to-[#FF826F] px-8 font-bold text-white shadow-[0_10px_28px_rgba(255,97,127,0.22)] transition-transform duration-300 hover:-translate-y-0.5 hover:from-[#ff7388] hover:to-[#ff967f]"
                    >
                      <Link href={`/${locale}/donate`}>
                        <Heart className="h-4 w-4 fill-white text-white" /> {donateButton}
                      </Link>
                    </Button>
                  )}
                  {donateButton2 && (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-full border-[#2D9F84]/30 bg-white/65 px-8 font-semibold text-[#237E6A] hover:bg-white hover:text-[#1F6E5D]"
                    >
                      <Link href={`/${locale}/contact`}>{donateButton2}</Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
