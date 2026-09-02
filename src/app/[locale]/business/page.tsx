import Link from "next/link";
import {
  Flower2,
  Quote,
  Scissors,
  Sparkles,
  HeartHandshake,
  GraduationCap,
  Users2,
  TrendingUp,
  Gem,
  Coins,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getSettings, s, sPairs } from "@/lib/settings";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";
import { NelumeHero } from "@/components/site/nelume-hero";

/**
 * NELUME's luxury editorial palette — warm ivory, champagne, muted rose,
 * dusty mauve, deep plum and a subtle gold accent. Scoped entirely to this
 * page; the rest of the site keeps the foundation's navy/brand theme, and
 * the navbar, top bar and footer are untouched.
 */
const NELUME = {
  ivory: "#FAF7F1",
  champagne: "#EFE1C6",
  beige: "#E8DCC7",
  rose: "#D9A9A0",
  mauve: "#A97C82",
  plum: "#3B2233",
  plumDeep: "#28151F",
  gold: "#C7A15A",
  ink: "#2B1B22",
};

const PILLARS = [
  {
    icon: Sparkles,
    title: "Beautiful Care",
    text: "Professional nail care in a warm, welcoming space.",
  },
  {
    icon: HeartHandshake,
    title: "Inclusive by Design",
    text: "Built for every body and every soul, without exception.",
  },
  {
    icon: Users2,
    title: "Community Impact",
    text: "Every visit supports skills and livelihoods for people excluded from the formal economy.",
  },
];

const OBJECTIVE_ICONS = [Users2, TrendingUp];

const GALLERY_META = [
  { icon: Scissors, caption: null, tint: NELUME.rose },
  { icon: Sparkles, caption: "Care creates confidence.", tint: NELUME.gold },
  { icon: Flower2, caption: null, tint: NELUME.mauve },
  { icon: HeartHandshake, caption: "Skills create independence.", tint: NELUME.beige },
  { icon: GraduationCap, caption: null, tint: NELUME.rose },
  { icon: Users2, caption: "Business creates opportunity.", tint: NELUME.mauve },
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
      <section id="sec-story" className="relative overflow-hidden py-24 md:py-36">
        <div className="mx-auto grid max-w-[1300px] items-center gap-16 px-6 md:grid-cols-2 md:gap-20 md:px-12">
          <Reveal direction="right">
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: NELUME.gold }}>
              Our Story
            </p>
            <h2
              className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-5xl"
              style={{ color: NELUME.plum }}
            >
              {aboutTitle}
            </h2>
            <div className="mt-8 space-y-5">
              {aboutParagraphs.map((p, i) => (
                <p key={i} className="text-base leading-loose md:text-[17px]" style={{ color: NELUME.ink + "BF" }}>
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
              {["Beauty", "Inclusion", "Opportunity", "Independence"].map((word, i) => (
                <span key={word} className="flex items-center gap-x-5">
                  <span
                    className="text-xs font-bold uppercase tracking-[0.2em]"
                    style={{ color: NELUME.gold }}
                  >
                    {word}
                  </span>
                  {i < 3 && <span className="h-1 w-1 rounded-full" style={{ backgroundColor: NELUME.mauve }} />}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal direction="left" className="relative">
            <div
              className="absolute -bottom-5 -right-5 h-full w-full rounded-[2rem] border"
              style={{ borderColor: NELUME.gold + "55" }}
              aria-hidden
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-25px_rgba(43,27,34,0.35)]">
              {aboutImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={aboutImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div
                  className="bg-grain flex h-full w-full items-center justify-center"
                  style={{ background: `linear-gradient(150deg, ${NELUME.champagne}, ${NELUME.rose}77)` }}
                >
                  <Flower2 className="h-16 w-16 opacity-40" style={{ color: NELUME.plum }} />
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- PILLARS */}
      <section className="py-24 md:py-32" style={{ backgroundColor: NELUME.champagne + "60" }}>
        <div className="mx-auto max-w-[1000px] divide-y px-6 md:px-12" style={{ borderColor: NELUME.gold + "30" }}>
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} direction={i % 2 === 0 ? "right" : "left"}>
                <div
                  className={`flex flex-col items-start gap-6 py-12 md:flex-row md:items-center md:gap-14 ${
                    i % 2 === 1 ? "md:pl-16" : ""
                  } ${i > 0 ? "border-t" : ""}`}
                  style={{ borderColor: NELUME.gold + "30" }}
                >
                  <span
                    className="shrink-0 font-serif text-7xl leading-none md:text-8xl"
                    style={{ color: NELUME.gold, opacity: 0.28 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span
                      className="mb-4 inline-grid h-11 w-11 place-items-center rounded-full"
                      style={{ backgroundColor: NELUME.plum, color: NELUME.champagne }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-serif text-2xl md:text-3xl" style={{ color: NELUME.plum }}>
                      {pillar.title}
                    </h3>
                    <p className="mt-2 max-w-md text-[15px] leading-relaxed" style={{ color: NELUME.ink + "AA" }}>
                      {pillar.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------ SOCIAL IMPACT MODEL */}
      {impactBody && (
        <section
          className="bg-grain relative overflow-hidden py-24 md:py-36"
          style={{ backgroundColor: NELUME.plum }}
        >
          <div
            className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full blur-3xl"
            style={{ backgroundColor: NELUME.gold + "22" }}
          />
          <div
            className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full blur-3xl"
            style={{ backgroundColor: NELUME.rose + "26" }}
          />
          <div className="relative mx-auto max-w-[1100px] px-6 md:px-12">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: NELUME.gold }}>
                The Model
              </p>
              <h2
                className="mt-4 max-w-2xl font-serif text-4xl leading-tight md:text-6xl"
                style={{ color: NELUME.ivory }}
              >
                Beauty that creates opportunity.
              </h2>
              <p className="mt-7 max-w-2xl whitespace-pre-line text-base leading-loose md:text-lg" style={{ color: NELUME.ivory + "BF" }}>
                {impactBody}
              </p>
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-20 flex flex-col items-center justify-center gap-3 md:flex-row md:gap-6">
                {[
                  { label: "Beauty", icon: Gem },
                  { label: "Income", icon: Coins },
                  { label: "Impact", icon: HeartHandshake },
                ].map((node, i) => {
                  const Icon = node.icon;
                  return (
                    <div key={node.label} className="flex items-center gap-3 md:gap-6">
                      <div className="flex flex-col items-center gap-3">
                        <span
                          className="grid h-20 w-20 place-items-center rounded-full border md:h-24 md:w-24"
                          style={{ borderColor: NELUME.gold + "80", color: NELUME.gold }}
                        >
                          <Icon className="h-7 w-7" />
                        </span>
                        <span
                          className="text-xs font-bold uppercase tracking-[0.24em]"
                          style={{ color: NELUME.champagne }}
                        >
                          {node.label}
                        </span>
                      </div>
                      {i < 2 && (
                        <>
                          <ArrowRight
                            className="hidden h-5 w-5 md:block"
                            style={{ color: NELUME.gold + "99" }}
                          />
                          <ArrowDown
                            className="h-5 w-5 md:hidden"
                            style={{ color: NELUME.gold + "99" }}
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* -------------------------------------------------------------- MISSION */}
      {missionQuote && (
        <section className="bg-grain relative overflow-hidden py-28 md:py-44">
          <div className="relative mx-auto max-w-[900px] px-6 text-center md:px-12">
            <Reveal direction="scale">
              <Quote
                className="mx-auto h-16 w-16 md:h-20 md:w-20"
                style={{ color: NELUME.gold, opacity: 0.35 }}
              />
              <p
                className="mt-6 font-serif text-2xl italic leading-snug md:text-4xl md:leading-snug"
                style={{ color: NELUME.plum }}
              >
                &ldquo;{missionQuote}&rdquo;
              </p>
              {missionSupport && (
                <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed" style={{ color: NELUME.ink + "99" }}>
                  {missionSupport}
                </p>
              )}
              <span
                className="mx-auto mt-9 block h-px w-20"
                style={{ backgroundColor: NELUME.gold + "80" }}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- OBJECTIVES */}
      {objectives.length > 0 && (
        <section className="py-24 md:py-36" style={{ backgroundColor: NELUME.beige + "50" }}>
          <div className="mx-auto max-w-[1200px] px-6 md:px-12">
            {objectivesTitle && (
              <Reveal className="mb-16 text-center md:mb-24">
                <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: NELUME.gold }}>
                  What We're Working Toward
                </p>
                <h2 className="mt-4 font-serif text-4xl md:text-5xl" style={{ color: NELUME.plum }}>
                  {objectivesTitle}
                </h2>
              </Reveal>
            )}

            <div className="space-y-16 md:space-y-24">
              {objectives.map((obj, i) => {
                const Icon = OBJECTIVE_ICONS[i % OBJECTIVE_ICONS.length];
                const reversed = i % 2 === 1;
                return (
                  <Reveal key={i} direction={reversed ? "left" : "right"}>
                    <div
                      className={`grid items-center gap-8 md:gap-16 ${
                        reversed ? "md:grid-cols-[1fr_minmax(0,240px)]" : "md:grid-cols-[minmax(0,240px)_1fr]"
                      }`}
                    >
                      <div className={reversed ? "order-2 md:justify-self-end" : "order-1"}>
                        <span
                          className="block font-serif text-8xl leading-none md:text-9xl"
                          style={{ WebkitTextStroke: `1.5px ${NELUME.gold}`, color: "transparent" } as React.CSSProperties}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className={reversed ? "order-1" : "order-2"}>
                        <span
                          className="mb-4 inline-grid h-11 w-11 place-items-center rounded-full"
                          style={{ backgroundColor: NELUME.plum, color: NELUME.champagne }}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <h3 className="font-serif text-2xl md:text-3xl" style={{ color: NELUME.plum }}>
                          {obj.left}
                        </h3>
                        {obj.right && (
                          <p className="mt-3 max-w-xl text-[15px] leading-relaxed" style={{ color: NELUME.ink + "AA" }}>
                            {obj.right}
                          </p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ GALLERY */}
      {hasGallery && (
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1300px] px-6 md:px-12">
          <Reveal className="mb-12 text-center md:mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: NELUME.gold }}>
              In Every Visit
            </p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl" style={{ color: NELUME.plum }}>
              Moments at NELUME
            </h2>
          </Reveal>

          <StaggerContainer className="grid auto-rows-[160px] grid-cols-2 gap-4 md:auto-rows-[200px] md:grid-cols-3 md:gap-5">
            {GALLERY_META.map((tile, i) => {
              const Icon = tile.icon;
              const image = galleryImages[i];
              return (
                <StaggerItem key={i} className={GALLERY_SPANS[i]}>
                  <div className="group relative h-full w-full overflow-hidden rounded-2xl">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{ background: `linear-gradient(155deg, ${tile.tint}55, ${NELUME.ivory})` }}
                      >
                        <Icon className="h-8 w-8 opacity-40" style={{ color: NELUME.plum }} />
                      </div>
                    )}
                    {tile.caption && (
                      <>
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                          style={{ background: `linear-gradient(0deg, ${NELUME.plumDeep}CC, transparent)` }}
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
      <section
        className="bg-grain relative overflow-hidden py-24 text-center md:py-32"
        style={{ backgroundColor: NELUME.plumDeep }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: NELUME.gold + "1F" }}
        />
        <div className="relative mx-auto max-w-[900px] px-6 md:px-12">
          <Reveal>
            <h2 className="font-serif text-3xl leading-tight md:text-5xl" style={{ color: NELUME.ivory }}>
              Every rupee spent at NELUME contributes to a bigger purpose.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed md:text-base" style={{ color: NELUME.ivory + "AA" }}>
              Experience professional beauty and wellness while contributing to inclusive employment,
              sustainable livelihoods, and meaningful community impact.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/${locale}/contact`}
                className="rounded-full px-8 py-3 text-sm font-bold uppercase tracking-[0.14em] transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: NELUME.gold, color: NELUME.plumDeep }}
              >
                Visit NELUME
              </Link>
              <Link
                href={`/${locale}/about`}
                className="rounded-full border px-8 py-3 text-sm font-bold uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-white/5"
                style={{ borderColor: NELUME.ivory + "55", color: NELUME.ivory }}
              >
                Discover Our Impact
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
