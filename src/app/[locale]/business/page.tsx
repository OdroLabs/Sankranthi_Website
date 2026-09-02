import Link from "next/link";
import {
  Flower2,
  Quote,
  Scissors,
  Sparkles,
  HeartHandshake,
  GraduationCap,
  Users2,
  ArrowRight,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getSettings, s, sPairs } from "@/lib/settings";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";
import { NelumeHero } from "@/components/site/nelume-hero";
import { NelumeIcon, NelumeWatermark, type NelumeMotif } from "@/components/site/nelume-watermark";
import { NelumeFlowPath } from "@/components/site/nelume-flow-path";

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

const PILLARS: { icon: NelumeMotif; title: string; text: string }[] = [
  {
    icon: "lotusPetal",
    title: "Beautiful Care",
    text: "Professional nail care in a warm, welcoming space.",
  },
  {
    icon: "leaf",
    title: "Inclusive by Design",
    text: "Built for every body and every soul, without exception.",
  },
  {
    icon: "waterRipple",
    title: "Community Impact",
    text: "Every visit supports skills and livelihoods for people excluded from the formal economy.",
  },
];

/** Corner motif + accent color per objective card — cycles if there are more than two. */
const OBJECTIVE_ACCENTS: { icon: NelumeMotif; color: string }[] = [
  { icon: "lotusPetal", color: NELUME.lotus },
  { icon: "leaf", color: NELUME.sage },
];

const GALLERY_META = [
  { icon: Scissors, caption: null, tint: NELUME.pink },
  { icon: Sparkles, caption: "Care creates confidence.", tint: NELUME.wood },
  { icon: Flower2, caption: null, tint: NELUME.lotus },
  { icon: HeartHandshake, caption: "Skills create independence.", tint: NELUME.beige },
  { icon: GraduationCap, caption: null, tint: NELUME.pink },
  { icon: Users2, caption: "Business creates opportunity.", tint: NELUME.lotus },
];
/** Asymmetric masonry rhythm — some tiles run tall, others stay square. */
const GALLERY_SPANS = ["row-span-2", "row-span-1", "row-span-1", "row-span-2", "row-span-1", "row-span-1"];

export default async function BusinessPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const settings = await getSettings();

  const heroTitle = s(settings, "business_hero_title", locale) || "NELUME";
  const heroIntro = s(settings, "business_hero_intro", locale);
  const heroImage = s(settings, "business_hero_image");
  // Reuses already-uploaded gallery photos for the hero's collage — no new content fields.
  const heroSecondaryImage = s(settings, "business_gallery_image_1");
  const heroDetailImage = s(settings, "business_gallery_image_2");

  const aboutTitle = s(settings, "business_about_title", locale) || "Beauty with purpose.";
  const aboutBody = s(settings, "business_about_body", locale);
  const aboutParagraphs = aboutBody.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const aboutImage = s(settings, "business_about_image");

  const impactBody = s(settings, "business_impact_body", locale);

  const missionBody = s(settings, "business_mission_body", locale);
  const missionParagraphs = missionBody.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const missionQuote = missionParagraphs[0] ?? "";
  const missionSupport = missionParagraphs.slice(1).join(" ");

  const objectivesTitle = s(settings, "business_objectives_title", locale);
  const objectives = sPairs(settings, "business_objectives", locale);

  const galleryImages = [1, 2, 3, 4, 5, 6].map((n) => s(settings, `business_gallery_image_${n}`));
  const hasGallery = galleryImages.some(Boolean);
  // Reuses already-uploaded gallery photos as secondary accents elsewhere on the
  // page (Story's second photo, Opportunity's middle photo, final CTA photo) —
  // the same "no new content fields" pattern the hero already uses above.
  const storySecondaryImage = galleryImages[2] || galleryImages[0];
  const opportunityImage = galleryImages[3] || galleryImages[1];
  const ctaImage = galleryImages[4] || aboutImage || galleryImages[0];

  return (
    <div style={{ backgroundColor: NELUME.ivory }}>
      {/* ---------------------------------------------------------------- HERO */}
      <NelumeHero
        heroTitle={heroTitle}
        heroIntro={heroIntro}
        heroImage={heroImage}
        secondaryImage={heroSecondaryImage}
        detailImage={heroDetailImage}
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
                  <Flower2 className="h-16 w-16 opacity-40" style={{ color: NELUME.inkSoft }} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-10 -left-8 h-[46%] w-[56%] overflow-hidden rounded-[22px] border-4 shadow-[0_20px_45px_-20px_rgba(52,69,87,0.25)] md:-bottom-12 md:-left-10" style={{ borderColor: NELUME.cream }}>
              {storySecondaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={storySecondaryImage} alt="" className="h-full w-full object-cover" />
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

      {/* --------------------------------------------------------- VALUES STRIP */}
      <section className="py-16 md:py-20" style={{ backgroundColor: NELUME.ivory }}>
        <div className="mx-auto grid max-w-[1100px] gap-10 divide-y px-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-y-0 md:px-12" style={{ borderColor: "rgba(52,69,87,0.10)" }}>
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 80} className="flex flex-col items-center gap-3 px-6 pt-10 text-center first:pt-0 sm:pt-0">
              <span className="grid h-14 w-14 place-items-center rounded-full" style={{ backgroundColor: NELUME.cream }}>
                <NelumeIcon variant={pillar.icon} size={26} color={NELUME.inkSoft} />
              </span>
              <h3 className="font-serif text-xl" style={{ color: NELUME.ink }}>
                {pillar.title}
              </h3>
              <p className="max-w-[220px] text-sm leading-relaxed" style={{ color: NELUME.body }}>
                {pillar.text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ SOCIAL IMPACT MODEL */}
      {impactBody && (
        <section className="relative overflow-hidden py-24 md:py-36" style={{ backgroundColor: "#DCE7EF" }}>
          <div className="relative mx-auto grid max-w-[1200px] items-center gap-16 px-6 md:grid-cols-2 md:gap-20 md:px-12">
            <Reveal direction="right">
              <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: NELUME.inkSoft }}>
                The Model
              </p>
              <h2
                className="mt-4 max-w-lg font-serif text-4xl leading-tight md:text-5xl"
                style={{ color: NELUME.ink }}
              >
                Beauty that creates opportunity.
              </h2>
              <p className="mt-7 max-w-lg whitespace-pre-line text-base leading-[1.7] md:text-lg" style={{ color: NELUME.body }}>
                {impactBody}
              </p>
            </Reveal>

            <Reveal direction="left" delay={100}>
              <div className="relative flex flex-col items-center gap-4 md:flex-row md:justify-between">
                <NelumeFlowPath className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-[60px] w-full -translate-y-1/2 md:block" />
                {[
                  { label: "Beauty", icon: "lotusPetal" as NelumeMotif },
                  { label: "Income", icon: "leaf" as NelumeMotif },
                  { label: "Impact", icon: "waterRipple" as NelumeMotif },
                ].map((node) => (
                  <div key={node.label} className="relative flex flex-col items-center gap-3">
                    <NelumeWatermark
                      variant="waterRipple"
                      size={130}
                      opacity={0.14}
                      color="#6E93B6"
                      className="left-[calc(50%-65px)] top-[calc(50%-65px)]"
                    />
                    <span
                      className="relative grid h-20 w-20 place-items-center rounded-full border bg-white/70 md:h-24 md:w-24"
                      style={{ borderColor: "rgba(101,125,166,0.35)" }}
                    >
                      <NelumeIcon variant={node.icon} size={30} color={NELUME.inkSoft} />
                    </span>
                    <span className="relative text-xs font-bold uppercase tracking-[0.24em]" style={{ color: NELUME.ink }}>
                      {node.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------- MISSION */}
      {missionQuote && (
        <section
          className="relative overflow-hidden py-28 md:py-44"
          style={{ background: `linear-gradient(180deg, ${NELUME.ivory}, #E9F0F5)` }}
        >
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

      {/* --------------------------------------------------------- OBJECTIVES */}
      {objectives.length > 0 && (
        <section className="py-24 md:py-36" style={{ backgroundColor: NELUME.ivory }}>
          <div className="mx-auto max-w-[1300px] px-6 md:px-12">
            <div className="grid gap-16 lg:grid-cols-[minmax(0,340px)_minmax(0,320px)_minmax(0,1fr)] lg:items-center lg:gap-14">
              {objectivesTitle && (
                <Reveal direction="right">
                  <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: NELUME.inkSoft }}>
                    What We&rsquo;re Working Toward
                  </p>
                  <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl" style={{ color: NELUME.ink }}>
                    {objectivesTitle}
                  </h2>
                </Reveal>
              )}

              <Reveal direction="scale" className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-[26px] shadow-[0_30px_60px_-25px_rgba(52,69,87,0.18)]">
                {opportunityImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={opportunityImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: NELUME.cream }}>
                    <NelumeIcon variant="lotus" size={56} color={NELUME.lotus} />
                  </div>
                )}
              </Reveal>

              <div className="grid gap-6 sm:grid-cols-2">
                {objectives.map((obj, i) => {
                  const accent = OBJECTIVE_ACCENTS[i % OBJECTIVE_ACCENTS.length];
                  return (
                    <Reveal key={i} delay={i * 80}>
                      <div
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
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ GALLERY */}
      {hasGallery && (
      <section className="py-24 md:py-32" style={{ backgroundColor: NELUME.cream }}>
        <div className="mx-auto max-w-[1300px] px-6 md:px-12">
          <Reveal className="mb-12 text-center md:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: NELUME.inkSoft }}>
              In Every Visit
            </p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl" style={{ color: NELUME.ink }}>
              Moments at NELUME
            </h2>
          </Reveal>

          <StaggerContainer className="grid auto-rows-[160px] grid-cols-2 gap-4 md:auto-rows-[200px] md:grid-cols-3 md:gap-5">
            {GALLERY_META.map((tile, i) => {
              const Icon = tile.icon;
              const image = galleryImages[i];
              return (
                <StaggerItem key={i} className={GALLERY_SPANS[i]}>
                  <div className="group relative h-full w-full overflow-hidden rounded-t-[56px] rounded-b-2xl">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                        style={{ background: `linear-gradient(155deg, ${tile.tint}55, ${NELUME.ivory})` }}
                      >
                        <Icon className="h-8 w-8 opacity-40" style={{ color: NELUME.inkSoft }} />
                      </div>
                    )}
                    {tile.caption && (
                      <>
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                          style={{ background: `linear-gradient(0deg, ${NELUME.ink}CC, transparent)` }}
                        />
                        <p
                          className="absolute bottom-4 left-4 right-4 font-serif text-sm italic md:text-base"
                          style={{ color: NELUME.ivory }}
                        >
                          {tile.caption}
                        </p>
                      </>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>
      )}

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
                Every rupee spent at NELUME contributes to a bigger purpose.
              </h2>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed md:text-base" style={{ color: NELUME.body }}>
                Experience professional beauty and wellness while contributing to inclusive employment,
                sustainable livelihoods, and meaningful community impact.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href={`/${locale}/contact`} className={BTN_PRIMARY}>
                  Visit NELUME
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link href={`/${locale}/about`} className={BTN_SECONDARY}>
                  Discover Our Impact
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
