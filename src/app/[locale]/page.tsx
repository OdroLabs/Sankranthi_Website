import Link from "next/link";
import {
  Heart,
  ArrowRight,
  CalendarDays,
  Headphones,
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

function DotPattern({ className = "" }: { className?: string }) {
  return (
    <span className={`grid grid-cols-5 gap-2 opacity-70 ${className}`} aria-hidden="true">
      {Array.from({ length: 20 }).map((_, index) => (
        <span key={index} className="h-1 w-1 rounded-full bg-current" />
      ))}
    </span>
  );
}

function SpectrumRule({ className = "" }: { className?: string }) {
  return (
    <span className={`flex h-1 overflow-hidden ${className}`} aria-hidden="true">
      {["#EA4F67", "#FF9F43", "#F5C84B", "#45A66B", "#4B8DCF", "#704B9F"].map((color) => (
        <span key={color} className="h-full flex-1" style={{ backgroundColor: color }} />
      ))}
    </span>
  );
}

function RainbowChevron() {
  return (
    <svg viewBox="0 0 500 600" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
      <polygon points="90,0 500,0 500,600 90,600 350,300" fill="#F6D9D2" />
      <polygon points="145,0 500,0 500,600 145,600 405,300" fill="#EF615D" />
      <polygon points="205,0 500,0 500,600 205,600 465,300" fill="#F09A3E" />
      <polygon points="265,0 500,0 500,600 265,600 525,300" fill="#F8C13C" />
      <polygon points="325,0 500,0 500,600 325,600 585,300" fill="#45A363" />
      <polygon points="385,0 500,0 500,600 385,600 645,300" fill="#5388C9" />
      <polygon points="445,0 500,0 500,600 445,600 705,300" fill="#664899" />
    </svg>
  );
}

function LeafIcon({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- design asset from screenshot
    <img
      src="/illustrations/leaf-icon.png"
      alt=""
      width={80}
      height={64}
      className={`h-[56px] w-auto object-contain ${className}`}
      aria-hidden="true"
    />
  );
}

function HandHeartIllustration() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- design asset
    <img
      src="/illustrations/hand-heart.png"
      alt=""
      width={420}
      height={315}
      className="relative z-10 h-auto w-full max-w-[380px] object-contain"
      aria-hidden="true"
    />
  );
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
        <section id="sec-contact" className="bg-[#FFFDF9] px-4 py-8 text-[#172133] md:px-6 md:py-12">
          <div className="relative mx-auto min-h-[570px] w-full max-w-[1400px] overflow-hidden rounded-[28px] border border-[#EEE8DF] bg-[#FFFAF4] shadow-[0_15px_50px_rgba(34,42,53,0.08)]">
            <div className="pointer-events-none absolute -bottom-32 -left-28 h-[360px] w-[360px] rounded-full bg-[#FFD8D0]/75" />
            <DotPattern className="absolute left-6 top-7 text-[#F29B9E] md:left-8 md:top-8" />
            <DotPattern className="absolute bottom-8 left-[66%] hidden text-[#EFA5A5] lg:grid" />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] lg:block">
              <RainbowChevron />
            </div>

            <div className="relative z-10 grid min-h-[570px] items-center gap-10 p-7 md:p-12 lg:grid-cols-[360px_minmax(0,1fr)_270px] lg:px-14 xl:grid-cols-[390px_minmax(0,1fr)_340px] xl:px-16">
              <Reveal direction="scale">
                <TiltCard className="relative mx-auto w-full max-w-[360px] rounded-[26px] border border-white/90 bg-white px-7 py-8 text-[#172133] shadow-[0_18px_55px_rgba(36,42,48,0.12)] md:px-8 md:py-10">
                  <span className="relative mx-auto mb-6 flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[#FFF1EB]">
                    <Headphones className="h-11 w-11" strokeWidth={1.6} />
                    <Heart className="absolute h-[18px] w-[18px] fill-[#FF5F73] text-[#FF5F73]" />
                  </span>
                  {contactCardTitle && (
                    <h3 className="text-center font-serif text-[2rem] font-medium leading-[1.08]">{contactCardTitle}</h3>
                  )}
                  <SpectrumRule className="mx-auto my-6 w-[145px]" />
                  <p className="mb-8 text-center text-sm leading-7 text-[#5D6470]">Compassionate support<br />when you need it most.</p>
                  <div className="space-y-5 text-sm font-semibold text-[#242C38]">
                    {phone && <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-4 hover:underline"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F1] text-[#E84965]"><PhoneCall className="h-[19px] w-[19px]" /></span>{phone}</a>}
                    {address && <p className="flex items-center gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF5E7] text-[#E99731]"><MapPin className="h-[19px] w-[19px]" /></span><span className="whitespace-pre-line">{address}</span></p>}
                    {email && <a href={`mailto:${email}`} className="flex min-w-0 items-center gap-4 hover:underline"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5EFFC] text-[#70559C]"><Mail className="h-[19px] w-[19px]" /></span><span className="min-w-0 break-words">{email}</span></a>}
                  </div>
                </TiltCard>
              </Reveal>
              <Reveal delay={0.15} className="lg:pl-6">
                {s(settings, "home_contact_eyebrow", locale) && (
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#D94262]">
                    {s(settings, "home_contact_eyebrow", locale)}
                  </p>
                )}
                <span className="mt-5 block h-1 w-10 bg-[#D94262]" />
                {contactTitle && (
                  <h2 className="mt-6 max-w-[650px] font-serif text-[2.65rem] font-medium leading-[1.08] tracking-normal text-[#142035] md:text-[3.5rem]">
                    {contactTitle}
                  </h2>
                )}
                {contactText && (
                  <p className="mt-7 max-w-[570px] whitespace-pre-line text-base leading-8 text-[#626978]">
                    {contactText}
                  </p>
                )}
              </Reveal>
              <div className="hidden lg:block" />
            </div>
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
        <section id="sec-donate" className="bg-[#FFFDF9] px-4 pb-20 md:px-6 md:pb-28">
          <div className="mx-auto w-full max-w-[1400px]">
          <Reveal direction="scale">
            <div className="relative grid min-h-[360px] items-center gap-8 overflow-hidden rounded-[28px] border border-[#EEE9DF] bg-[#FFFAF2] px-8 py-10 text-[#202B33] shadow-[0_15px_45px_rgba(34,42,53,0.07)] md:px-14 lg:grid-cols-[1fr_0.8fr_0.75fr] lg:px-20">
              <span className="pointer-events-none absolute -left-24 top-0 h-full w-[170px] rounded-[50%] bg-[#EEF3DF]" />
              <span className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-[#E7F1FC]" />
              <span className="pointer-events-none absolute -bottom-24 -right-20 h-[230px] w-[270px] rounded-full bg-[#EEE6F5]" />
              <DotPattern className="absolute right-8 top-7 text-[#4C8DD3]" />
              <div className="relative">
                <LeafIcon />
                {donateTitle && (
                  <h2 className="mt-3 max-w-[520px] font-serif text-[2.5rem] font-medium leading-[1.08] tracking-normal text-[#142035] md:text-[3.35rem]">{donateTitle}</h2>
                )}
                <SpectrumRule className="my-6 w-[150px]" />
                {donateText && (
                  <p className="max-w-[480px] whitespace-pre-line text-base leading-8 text-[#606979]">
                    {donateText}
                  </p>
                )}
              </div>
              <div className="relative flex min-h-[250px] items-center justify-center">
                <HandHeartIllustration />
              </div>
              {(donateButton || donateButton2) && (
                <div className="relative flex flex-col items-start gap-4 lg:items-center">
                  {donateButton && (
                    <Button
                      asChild
                      size="lg"
                      className="h-auto min-w-[255px] justify-between rounded-full bg-[#FFC130] px-5 py-3.5 text-base font-bold text-[#192436] shadow-[0_10px_24px_rgba(246,183,35,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-[#FFD05A]"
                    >
                      <Link href={`/${locale}/donate`}>
                        <span className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white"><Heart className="h-[18px] w-[18px] fill-[#E8485E] text-[#E8485E]" /></span>{donateButton}</span>
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  )}
                  {donateButton2 && (
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-auto min-w-[255px] justify-between rounded-full border-[#366942] bg-white/60 px-7 py-4 text-base font-semibold text-[#254F32] hover:bg-white hover:text-[#254F32]"
                    >
                      <Link href={`/${locale}/contact`}>{donateButton2}<ArrowRight className="h-5 w-5" /></Link>
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
