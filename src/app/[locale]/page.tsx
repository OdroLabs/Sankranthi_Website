import Link from "next/link";
import {
  Heart,
  ArrowRight,
  Headphones,
  MapPin,
  PhoneCall,
  Mail,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { type Locale } from "@/lib/i18n";
import { getSettings, s, show } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { HomeEditorialHero } from "@/components/site/home-editorial-hero";
import { TiltCard } from "@/components/site/tilt-card";
import { Reveal } from "@/components/animations";

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

  const [firstService, firstProjects] = await Promise.all([
    prisma.service.findFirst({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 2,
    }),
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

  const contactTitle = s(settings, "home_contact_title", locale);
  const contactText = s(settings, "home_contact_text", locale);
  const contactCardTitle = s(settings, "home_contact_card_title", locale);

  const donateTitle = s(settings, "home_donate_title", locale);
  const donateText = s(settings, "home_donate_text", locale);
  const donateButton = s(settings, "home_donate_button", locale);
  const donateButton2 = s(settings, "home_donate_button2", locale);

  /* ---------------------- Which sections actually render ------------------ */
  const showHero = Boolean(heroTitle || heroSubtitle);
  const showAbout = show(settings, "show_home_about", aboutTitle, aboutText);
  const showContact = show(settings, "show_home_contact", contactTitle, contactText, phone, email);
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
            heroRightsImage || firstProjects[0]?.image,
            heroOpportunityImage || firstService?.image,
            heroCommunityImage || firstProjects[1]?.image,
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
