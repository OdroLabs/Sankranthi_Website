import Link from "next/link";
import {
  Quote,
  Heart,
  Hand,
  Users2,
  ArrowRight,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getSettings, s, sPairs } from "@/lib/settings";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";
import { NelumeHero } from "@/components/site/nelume-hero";
import { NelumeIcon, NelumeWatermark, type NelumeMotif } from "@/components/site/nelume-watermark";

/**
 * NELUME's "Lotus Sanctuary" editorial palette — warm white, mist blue,
 * lotus blue, soft pink, sandy beige and natural wood, matching the hero
 * (nelume-hero.tsx). Scoped entirely to this page; the rest of the site
 * keeps the foundation's navy/brand theme, and the navbar, top bar and
 * footer are untouched.
 */
const NELUME = {
  ivory: "#F8F4EE",
  cream: "#F2ECE3",
  beige: "#D9C9B6",
  pink: "#DDB6BD",
  mist: "#AFC4D8",
  lotus: "#899CC7",
  sage: "#86937A",
  wood: "#A97845",
  ink: "#344557",
  inkSoft: "#657DA6",
  body: "#687682",
};

/** Shared button treatment for this page — rectangular, not pill, per NELUME's editorial spec. */
const BTN_PRIMARY =
  "group inline-flex items-center gap-2.5 rounded-[10px] bg-[#657DA6] px-6 py-[14px] text-sm font-semibold text-white shadow-[0_10px_30px_rgba(101,125,166,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#596F99]";
const BTN_SECONDARY =
  "inline-flex items-center gap-2.5 rounded-[10px] border border-[#344557]/20 bg-[#FCFAF6] px-6 py-[14px] text-sm font-semibold text-[#344557] transition-colors duration-300 hover:border-[#657DA6]/40 hover:bg-white";

/** Corner motif + accent color per objective card — cycles if there are more than two. */
const OBJECTIVE_ACCENTS: { icon: NelumeMotif; color: string }[] = [
  { icon: "lotusPetal", color: NELUME.lotus },
  { icon: "leaf", color: NELUME.sage },
];

/** Fixed "Business for Social Impact" flow — decorative UI, not admin content. */
const IMPACT_FLOW: { label: string; icon: NelumeMotif | typeof Users2 }[] = [
  { label: "Customer", icon: Users2 },
  { label: "NELUME", icon: "lotus" },
  { label: "Revenue", icon: Hand },
  { label: "Employment + Skills", icon: Users2 },
  { label: "Community Impact", icon: Heart },
];

export default async function BusinessPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const settings = await getSettings();

  const heroTitle = s(settings, "business_hero_title", locale) || "NELUME";
  const heroIntro = s(settings, "business_hero_intro", locale);
  const heroImage = s(settings, "business_hero_image");
  const heroSideImage = s(settings, "business_hero_side_image");

  const aboutTitle = s(settings, "business_about_title", locale) || "Beauty with purpose.";
  const aboutBody = s(settings, "business_about_body", locale);
  const aboutParagraphs = aboutBody.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const aboutImage = s(settings, "business_about_image");
  const aboutImage2 = s(settings, "business_about_image_2");

  const impactBody = s(settings, "business_impact_body", locale);

  const opportunityTitle = s(settings, "business_opportunity_title", locale) || "Creating space where opportunity can grow.";
  const opportunityBody = s(settings, "business_opportunity_body", locale);
  const opportunityImage = s(settings, "business_opportunity_image");

  const objectivesTitle = s(settings, "business_objectives_title", locale);
  const objectives = sPairs(settings, "business_objectives", locale);

  const missionBody = s(settings, "business_mission_body", locale);
  const missionParagraphs = missionBody.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const missionQuote = missionParagraphs[0] ?? "";
  const missionSupport = missionParagraphs.slice(1).join(" ");
  const missionImage = s(settings, "business_mission_image");

  const servicesTitle = s(settings, "business_services_title", locale) || "Care for every body.";
  const services = [1, 2, 3, 4]
    .map((n) => ({
      image: s(settings, `business_service_${n}_image`),
      label: s(settings, `business_service_${n}_label`, locale),
    }))
    .filter((service) => service.image || service.label);

  const ctaTitle = s(settings, "business_cta_title", locale) || "Step into NELUME.";
  const ctaBody = s(settings, "business_cta_body", locale);
  const ctaImage = s(settings, "business_cta_image");

  return (
    <div style={{ backgroundColor: NELUME.ivory }}>
      {/* ---------------------------------------------------------------- HERO */}
      <NelumeHero
        locale={locale}
        heroTitle={heroTitle}
        heroIntro={heroIntro}
        heroImage={heroImage}
        sideImage={heroSideImage}
      />

      {/* -------------------------------------------------------- OUR STORY */}
      <section id="sec-story" className="relative overflow-hidden py-24 md:py-36" style={{ backgroundColor: NELUME.cream }}>
        <NelumeWatermark variant="lotus" size={420} opacity={0.05} color={NELUME.lotus} className="-bottom-16 -right-16" drift />
        <div className="relative mx-auto grid max-w-[1300px] items-center gap-16 px-6 md:grid-cols-2 md:gap-20 md:px-12">
          <Reveal direction="right" className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-25px_rgba(52,69,87,0.18)]">
              {aboutImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={aboutImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ background: `linear-gradient(150deg, ${NELUME.mist}55, ${NELUME.pink}44)` }}
                >
                  <NelumeIcon variant="lotus" size={48} color={NELUME.lotus} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-10 -left-8 h-[46%] w-[56%] overflow-hidden rounded-[22px] border-4 shadow-[0_20px_45px_-20px_rgba(52,69,87,0.25)] md:-bottom-12 md:-left-10" style={{ borderColor: NELUME.cream }}>
              {aboutImage2 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={aboutImage2} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: NELUME.ivory }}>
                  <NelumeIcon variant="lotusPetal" size={36} color={NELUME.lotus} />
                </div>
              )}
            </div>
          </Reveal>

          <Reveal direction="left" className="md:pl-6">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: NELUME.inkSoft }}>
              <NelumeIcon variant="lotusPetal" size={13} color={NELUME.lotus} />
              Our Story
            </p>
            <h2
              className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-5xl"
              style={{ color: NELUME.ink }}
            >
              {aboutTitle}
            </h2>
            <div className="mt-8 space-y-5">
              {aboutParagraphs.map((p, i) => (
                <p key={i} className="max-w-[600px] text-base leading-[1.7] md:text-[17px]" style={{ color: NELUME.body }}>
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
              {["Beauty", "Inclusion", "Opportunity", "Independence"].map((word, i) => (
                <span key={word} className="flex items-center gap-x-5">
                  <span
                    className="text-xs font-bold uppercase tracking-[0.2em]"
                    style={{ color: NELUME.inkSoft }}
                  >
                    {word}
                  </span>
                  {i < 3 && <span className="h-1 w-1 rounded-full" style={{ backgroundColor: NELUME.lotus }} />}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ SOCIAL IMPACT MODEL */}
      {impactBody && (
        <section id="sec-impact" className="relative overflow-hidden py-24 md:py-36" style={{ backgroundColor: "#DCE7EF" }}>
          <div className="relative mx-auto grid max-w-[1250px] items-center gap-16 px-6 md:grid-cols-[minmax(0,380px)_1fr] md:gap-14 md:px-12">
            <Reveal direction="right">
              <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: NELUME.inkSoft }}>
                The Model
              </p>
              <h2
                className="mt-4 font-serif text-3xl leading-tight md:text-4xl"
                style={{ color: NELUME.ink }}
              >
                Business for <span className="italic">Social Impact</span>
              </h2>
              <p className="mt-6 whitespace-pre-line text-base leading-[1.7] md:text-lg" style={{ color: NELUME.body }}>
                {impactBody}
              </p>
            </Reveal>

            <Reveal direction="left" delay={100}>
              <div className="flex flex-wrap items-start justify-center gap-x-2 gap-y-8 md:flex-nowrap md:justify-between">
                {IMPACT_FLOW.map((node, i) => (
                  <div key={node.label} className="flex items-start gap-2 md:gap-3">
                    <div className="relative flex w-20 flex-col items-center gap-3 md:w-24">
                      <NelumeWatermark
                        variant="waterRipple"
                        size={110}
                        opacity={0.16}
                        color="#6E93B6"
                        className="left-[calc(50%-55px)] top-[calc(50%-40px)]"
                      />
                      <span
                        className="relative grid h-16 w-16 place-items-center rounded-full border bg-white/70 md:h-20 md:w-20"
                        style={{ borderColor: "rgba(101,125,166,0.35)" }}
                      >
                        {typeof node.icon === "string" ? (
                          <NelumeIcon variant={node.icon} size={26} color={NELUME.inkSoft} />
                        ) : (
                          <node.icon className="h-6 w-6" style={{ color: NELUME.inkSoft }} />
                        )}
                      </span>
                      <span className="relative text-center text-[11px] font-bold uppercase leading-tight tracking-[0.18em]" style={{ color: NELUME.ink }}>
                        {node.label}
                      </span>
                    </div>
                    {i < IMPACT_FLOW.length - 1 && (
                      <ArrowRight className="mt-7 h-4 w-4 shrink-0" style={{ color: NELUME.inkSoft }} />
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- OBJECTIVES */}
      {(opportunityTitle || objectives.length > 0) && (
        <section className="py-24 md:py-36" style={{ backgroundColor: NELUME.ivory }}>
          <div className="mx-auto max-w-[1300px] px-6 md:px-12">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
              <Reveal direction="right" className="flex flex-col gap-8 sm:flex-row sm:items-center">
                <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[26px] shadow-[0_30px_60px_-25px_rgba(52,69,87,0.18)] sm:w-[220px]">
                  {opportunityImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={opportunityImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: NELUME.cream }}>
                      <NelumeIcon variant="lotus" size={48} color={NELUME.lotus} />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="font-serif text-3xl leading-tight md:text-4xl" style={{ color: NELUME.ink }}>
                    {opportunityTitle}
                  </h2>
                  {opportunityBody && (
                    <p className="mt-5 text-[15px] leading-relaxed" style={{ color: NELUME.body }}>
                      {opportunityBody}
                    </p>
                  )}
                </div>
              </Reveal>

              <Reveal direction="left" delay={100}>
                {objectivesTitle && (
                  <h2 className="mb-8 font-serif text-3xl leading-tight md:text-4xl" style={{ color: NELUME.ink }}>
                    {objectivesTitle}
                  </h2>
                )}
                <div className="grid gap-6 sm:grid-cols-2">
                  {objectives.map((obj, i) => {
                    const accent = OBJECTIVE_ACCENTS[i % OBJECTIVE_ACCENTS.length];
                    return (
                      <div
                        key={i}
                        className="relative flex h-full flex-col rounded-2xl p-7"
                        style={{ backgroundColor: "#FBF7F2", border: "1px solid rgba(60,75,85,0.10)" }}
                      >
                        <NelumeIcon variant={accent.icon} size={20} color={accent.color} className="absolute right-6 top-6" />
                        <span
                          className="block font-serif text-6xl leading-none"
                          style={{ WebkitTextStroke: `1.5px ${accent.color}`, color: "transparent" } as React.CSSProperties}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="mt-5 font-serif text-xl md:text-2xl" style={{ color: NELUME.ink }}>
                          {obj.left}
                        </h3>
                        {obj.right && (
                          <p className="mt-3 text-[15px] leading-relaxed" style={{ color: NELUME.body }}>
                            {obj.right}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------- MISSION */}
      {missionQuote && (
        <section className="relative overflow-hidden py-28 md:py-44">
          {missionImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={missionImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ backgroundColor: "rgba(248,244,238,0.72)" }} />
            </>
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(180deg, ${NELUME.ivory}, #E9F0F5)` }}
            />
          )}
          <NelumeWatermark variant="lotus" size={340} opacity={0.06} color={NELUME.lotus} className="-bottom-10 -left-12" drift />
          <NelumeWatermark variant="leaf" size={280} opacity={0.05} color={NELUME.sage} className="-right-10 -top-6" rotation={-8} drift />
          <div className="relative mx-auto max-w-[900px] px-6 text-center md:px-12">
            <Reveal direction="scale">
              <Quote
                className="mx-auto h-12 w-12 md:h-14 md:w-14"
                style={{ color: NELUME.inkSoft, opacity: 0.4 }}
              />
              <p
                className="mt-6 font-serif text-2xl italic leading-snug md:text-4xl md:leading-snug"
                style={{ color: NELUME.ink }}
              >
                &ldquo;{missionQuote}&rdquo;
              </p>
              {missionSupport && (
                <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed" style={{ color: NELUME.body }}>
                  {missionSupport}
                </p>
              )}
              <span
                className="mx-auto mt-9 block h-px w-20"
                style={{ backgroundColor: NELUME.mist }}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------- SERVICES */}
      {services.length > 0 && (
        <section className="py-24 md:py-32" style={{ backgroundColor: NELUME.cream }}>
          <div className="mx-auto max-w-[1100px] px-6 text-center md:px-12">
            <Reveal className="mb-16">
              <h2 className="font-serif text-3xl leading-tight md:text-4xl" style={{ color: NELUME.ink }}>
                {servicesTitle}
              </h2>
            </Reveal>

            <StaggerContainer className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
              {services.map((service, i) => (
                <StaggerItem key={i} className="flex flex-col items-center gap-4">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full shadow-[0_20px_45px_-20px_rgba(52,69,87,0.3)] md:h-32 md:w-32">
                    {service.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={service.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: NELUME.ivory }}>
                        <NelumeIcon variant="lotus" size={32} color={NELUME.lotus} />
                      </div>
                    )}
                  </div>
                  <NelumeIcon variant="lotusPetal" size={16} color={NELUME.lotus} />
                  {service.label && (
                    <p className="font-serif text-sm" style={{ color: NELUME.ink }}>
                      {service.label}
                    </p>
                  )}
                </StaggerItem>
              ))}
            </StaggerContainer>

            <Reveal delay={150} className="mt-14">
              <Link href={`/${locale}/services`} className={BTN_SECONDARY}>
                Discover the NELUME Experience
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- VALUES STRIP */}
      <section className="py-16 md:py-20" style={{ backgroundColor: NELUME.ivory }}>
        <div className="mx-auto grid max-w-[1100px] gap-10 divide-y px-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-y-0 md:px-12" style={{ borderColor: "rgba(52,69,87,0.10)" }}>
          {[
            { label: "Inclusive", icon: <NelumeIcon variant="lotusPetal" size={26} color={NELUME.inkSoft} /> },
            { label: "Respect", icon: <Heart className="h-6 w-6" style={{ color: NELUME.inkSoft }} /> },
            { label: "Care", icon: <Hand className="h-6 w-6" style={{ color: NELUME.inkSoft }} /> },
          ].map((value, i) => (
            <Reveal key={value.label} delay={i * 80} className="flex flex-col items-center gap-2 px-6 pt-10 text-center first:pt-0 sm:pt-0">
              <span className="grid h-14 w-14 place-items-center rounded-full" style={{ backgroundColor: NELUME.cream }}>
                {value.icon}
              </span>
              <h3 className="font-serif text-xl" style={{ color: NELUME.ink }}>
                {value.label}
              </h3>
              <p className="font-serif text-sm italic" style={{ color: NELUME.body }}>
                Always
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ CTA */}
      <section className="relative overflow-hidden py-24 md:py-32" style={{ backgroundColor: "#FBF7F1" }}>
        <div className="relative mx-auto grid max-w-[1300px] items-center gap-14 px-6 md:grid-cols-2 md:gap-20 md:px-12">
          <Reveal direction="right" className="order-2 md:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-25px_rgba(52,69,87,0.18)]">
              {ctaImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ctaImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: NELUME.cream }}>
                  <NelumeIcon variant="lotus" size={56} color={NELUME.lotus} />
                </div>
              )}
            </div>
          </Reveal>

          <Reveal direction="left" className="relative order-1 md:order-2">
            <NelumeWatermark variant="lotus" size={380} opacity={0.06} color={NELUME.lotus} className="-right-16 -top-10" drift />
            <div className="relative">
              <h2 className="font-serif text-3xl leading-tight md:text-5xl" style={{ color: NELUME.ink }}>
                {ctaTitle}
              </h2>
              {ctaBody && (
                <p className="mt-6 max-w-xl text-[15px] leading-relaxed md:text-base" style={{ color: NELUME.body }}>
                  {ctaBody}
                </p>
              )}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href={`/${locale}/contact`} className={BTN_PRIMARY}>
                  Visit NELUME
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href={`/${locale}/about`} className={BTN_SECONDARY}>
                  Learn About Sankranthi Foundation
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
