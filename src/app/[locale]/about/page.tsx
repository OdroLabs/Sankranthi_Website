import {
  Eye,
  Target,
  Users,
  BookOpen,
  Sparkles,
  Sprout,
  Users2,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getSettings, s, sPairs } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { TiltCard } from "@/components/site/tilt-card";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";

// Cycled across the values grid so the section reads as a quiet spectrum
// (one thin accent per card) rather than a flat, single-colour repeat.
const VALUE_ACCENTS = [
  { bar: "from-[#FF6F91] to-[#FF716D]", tint: "bg-[#FFF0F4]" },
  { bar: "from-[#83D8B6] to-[#83CDED]", tint: "bg-[#EFF9F4]" },
  { bar: "from-[#FF9B69] to-[#FFD66B]", tint: "bg-[#FFF8DD]" },
  { bar: "from-[#A995E8] to-[#83CDED]", tint: "bg-[#F5F1FF]" },
  { bar: "from-[#FF716D] to-[#FF9B69]", tint: "bg-[#FFF3ED]" },
  { bar: "from-[#83CDED] to-[#A995E8]", tint: "bg-[#FFFDF9]" },
];

// Cycled across the "Our story" journey milestones — icon + soft circle tint
// + accent colour, assigned automatically by position so editors only ever
// type a heading and a sentence.
const MILESTONE_ACCENTS = [
  {
    icon: Sprout,
    circle: "bg-[#E4EEE2]",
    fg: "text-[#5B8266]",
    bar: "bg-[#5B8266]",
  },
  {
    icon: Users,
    circle: "bg-[#FBE3E1]",
    fg: "text-[#E0716B]",
    bar: "bg-[#E0716B]",
  },
  {
    icon: HeartHandshake,
    circle: "bg-[#E1EEF3]",
    fg: "text-[#5C93A8]",
    bar: "bg-[#5C93A8]",
  },
  {
    icon: Users2,
    circle: "bg-[#FBEBD3]",
    fg: "text-[#D9A441]",
    bar: "bg-[#D9A441]",
  },
];

function TextBlock({
  id,
  icon: Icon,
  title,
  text,
  image,
  reverse,
}: {
  id: string;
  icon: LucideIcon;
  title: string;
  text: string;
  image?: string;
  reverse?: boolean;
}) {
  if (!text) return null;

  if (image) {
    return (
      <section
        id={id}
        className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]"
      >
        <Reveal
          direction={reverse ? "right" : "left"}
          className={reverse ? "lg:order-2" : undefined}
        >
          <div className="max-w-xl">
            {title && (
              <div className="mb-5 flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#FF617F] to-[#FF846F] text-white shadow-[0_10px_24px_rgba(255,97,127,0.22)]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              </div>
            )}
            {title && (
              <h2 className="text-display-xl font-serif font-medium tracking-tight text-[#202B33]">
                {title}
              </h2>
            )}
            <p className="mt-5 whitespace-pre-line leading-relaxed text-muted-foreground md:text-lg">
              {text}
            </p>
          </div>
        </Reveal>
        <div
          data-animate
          data-delay="0.12"
          className={`relative overflow-hidden rounded-3xl shadow-card-hover ${reverse ? "lg:order-1" : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="aspect-[4/3] w-full object-cover"
          />
          <span className="pointer-events-none absolute inset-x-6 -bottom-3 h-[2px] rounded-full bg-living-spectrum opacity-70" />
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className="grid gap-8 lg:grid-cols-[minmax(0,220px)_1fr] lg:gap-16"
    >
      <Reveal direction="up">
        <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-6">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#FF617F] to-[#FF846F] text-white shadow-[0_10px_24px_rgba(255,97,127,0.22)]">
            <Icon className="h-6 w-6" />
          </span>
          <span className="hidden h-28 w-px bg-gradient-to-b from-border to-transparent lg:block" />
        </div>
      </Reveal>
      <Reveal direction="up" delay={0.08}>
        <div className="max-w-2xl">
          {title && (
            <h2 className="text-display-xl font-serif font-medium tracking-tight text-[#202B33]">
              {title}
            </h2>
          )}
          <p className="mt-5 whitespace-pre-line leading-relaxed text-muted-foreground md:text-lg">
            {text}
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const settings = await getSettings();

  const overviewEyebrow = s(settings, "about_overview_eyebrow", locale);
  const overviewTitle = s(settings, "about_overview_title", locale);
  const overview = s(settings, "about_overview", locale);
  const overviewTagline = s(settings, "about_overview_tagline", locale);
  const overviewImage = s(settings, "about_overview_image");

  const visionTitle = s(settings, "about_vision_title", locale);
  const vision = s(settings, "about_vision", locale);
  const missionTitle = s(settings, "about_mission_title", locale);
  const mission = s(settings, "about_mission", locale);

  const valuesTitle = s(settings, "about_values_title", locale);
  const values = sPairs(settings, "about_values", locale);

  const communityTitle = s(settings, "about_community_title", locale);
  const community = s(settings, "about_community", locale);

  const historyMilestones = sPairs(
    settings,
    "about_history_milestones",
    locale,
  );
  const historyMilestonesTagline = s(
    settings,
    "about_history_milestones_tagline",
    locale,
  );

  const extraTitle = s(settings, "about_extra_title", locale);
  const extraText = s(settings, "about_extra_text", locale);

  // Each card only appears when it has text.
  const blocks = [
    {
      icon: Eye,
      title: visionTitle,
      text: vision,
      gradient: "from-[#FF617F] to-[#FF846F]",
    },
    {
      icon: Target,
      title: missionTitle,
      text: mission,
      gradient: "from-[#83D8B6] to-[#83CDED]",
    },
  ].filter((b) => b.text);

  return (
    <>
      <PageHero
        title={s(settings, "about_hero_title", locale)}
        intro={s(settings, "about_hero_intro", locale)}
        image={s(settings, "about_hero_image") || undefined}
        nextSurface="ivory"
      />

      <div className="surface-ivory relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] space-y-14 px-4 py-14 md:space-y-20 md:px-6 md:py-20">

          {overview &&
            (() => {
              const overviewParagraphs = overview
                .split(/\n+/)
                .map((p) => p.trim())
                .filter(Boolean);

              return (
                <Reveal>
                  <section
                    id="sec-overview"
                    className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16"
                  >
                    <div>
                      {overviewEyebrow && (
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF6F91]">
                          {overviewEyebrow}
                        </p>
                      )}
                      {overviewTitle && (
                        <h2 className="text-display-xl mt-3 font-serif font-semibold leading-[1.15] tracking-tight text-[#202B33]">
                          {overviewTitle}
                        </h2>
                      )}
                      <div className="mt-6 space-y-4">
                        {overviewParagraphs.map((paragraph, idx) => (
                          <p
                            key={idx}
                            className="leading-relaxed text-muted-foreground md:text-lg"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      {overviewTagline && (
                        <div className="mt-8">
                          <p className="font-script text-[18px] text-[#E0716B]">
                            {overviewTagline}
                          </p>
                          <span className="mt-3 block h-px w-16 bg-[#202B33]/25" />
                        </div>
                      )}
                    </div>

                    <div
                      data-animate
                      data-delay="0.12"
                      className="relative mx-auto w-full max-w-[820px]"
                    >
                      {/* Soft ambient glow lifting the whole composition off the page */}
                      <span
                        className="
      pointer-events-none absolute z-0
      inset-[6%]
      rounded-[45%]
      bg-[radial-gradient(closest-side,rgba(233,95,103,0.14),transparent_72%)]
      blur-2xl
    "
                      />

                      {/* Top-right peach decoration */}
                      <span
                        className="
      pointer-events-none absolute z-0
      -right-2 -top-7
      h-24 w-24
      rounded-full
      bg-gradient-to-br from-[#FCD9BC] to-[#F3A67C]
      shadow-[0_14px_28px_rgba(243,166,124,0.35)]
      md:-right-8 md:-top-8
    "
                      />

                      {/* Small top red/pink pill visible at the edge */}
                      <span
                        className="
      pointer-events-none absolute z-0
      left-[74%] -top-12
      h-12 w-28
      rounded-full
      bg-gradient-to-br from-[#F0767D] to-[#D94850]
      shadow-[0_14px_26px_rgba(217,72,80,0.35)]
    "
                      />

                      {/* Large pale green organic shape behind image */}
                      <span
                        className="
      pointer-events-none absolute z-0
      -left-14 top-[28%]
      h-[210px] w-[190px]
      -rotate-[25deg]
      rounded-[55%_45%_60%_40%]
      bg-gradient-to-br from-[#E7F1EA] to-[#C9E1D2]
      shadow-[0_16px_32px_rgba(131,180,153,0.2)]
    "
                      />

                      {/* Bottom-right peach organic shape */}
                      <span
                        className="
      pointer-events-none absolute z-0
      -bottom-1 right-[5%]
      h-[125px] w-[170px]
      rotate-[10deg]
      rounded-[45%_55%_50%_50%]
      bg-gradient-to-br from-[#FCE7D2] to-[#F3C79A]
      shadow-[0_14px_28px_rgba(243,199,154,0.25)]
    "
                      />

                      {/* Main image */}
                      {overviewImage ? (
                        <div
                          className="
        relative z-10
        mx-auto
        aspect-[1.35/1]
        w-[88%]
        overflow-hidden
        ring-1 ring-inset ring-white/70
        shadow-[0_35px_60px_-15px_rgba(32,43,51,0.35),0_10px_25px_-8px_rgba(32,43,51,0.18)]
      "
                          style={{
                            borderRadius: "20% 30% 34% 38% / 16% 28% 34% 40%",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={overviewImage}
                            alt={overviewTitle}
                            className="h-full w-full object-cover"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />
                          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
                        </div>
                      ) : (
                        <div
                          className="
        relative z-10
        mx-auto
        aspect-[1.35/1]
        w-[88%]
        overflow-hidden
        ring-1 ring-inset ring-white/70
        border border-[rgba(32,43,51,0.06)]
        bg-[#FFFDF9]
        shadow-[0_35px_60px_-15px_rgba(32,43,51,0.35),0_10px_25px_-8px_rgba(32,43,51,0.18)]
      "
                          style={{
                            borderRadius: "20% 30% 34% 38% / 16% 28% 34% 40%",
                          }}
                        >
                          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-[#83D8B6]/[0.16] blur-3xl" />

                          <div className="pointer-events-none absolute -bottom-14 -right-8 h-48 w-48 rounded-full bg-[#83CDED]/[0.14] blur-3xl" />

                          <div className="absolute inset-0 grid place-items-center">
                            <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#83D8B6] to-[#83CDED] text-white shadow-[0_16px_32px_rgba(131,216,182,0.3)]">
                              <BookOpen className="h-9 w-9" />
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Hand-drawn leaf decoration */}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 120 120"
                        fill="none"
                        className="
      pointer-events-none absolute z-20
      bottom-0 right-[3%]
      h-[110px] w-[110px]
      text-[#285C59]
    "
                      >
                        <path
                          d="
        M20 104
        C38 86 52 69 64 48
        C71 36 76 24 79 12

        M64 48
        C74 42 84 34 88 23
        C91 16 91 10 90 5

        M53 66
        C43 57 34 48 32 39
        C31 34 32 29 34 25

        M45 77
        C57 75 70 77 80 72
        C87 69 93 64 97 58

        M35 88
        C45 88 56 91 64 88
        C72 85 79 81 84 76
      "
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      {/* Optional subtle bottom-left shadow/accent */}
                      <span
                        className="
      pointer-events-none absolute
      bottom-[3%] left-[15%]
      h-16 w-28
      rounded-full
      bg-[#DCE9E1]/40
      blur-2xl
    "
                      />
                    </div>
                  </section>
                </Reveal>
              );
            })()}

                  {historyMilestones.length > 0 && (
                    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
                      <div className="relative overflow-hidden bg-[#EDF2E9] py-16 md:py-20">
                        <svg
                          aria-hidden
                          viewBox="0 0 1440 100"
                          preserveAspectRatio="none"
                          className="pointer-events-none absolute inset-x-0 -top-1 h-12 w-full text-[#EDF2E9] md:h-20"
                        >
                          <path
                            fill="currentColor"
                            d="M0,64 C240,0 480,0 720,32 C960,64 1200,64 1440,16 L1440,100 L0,100 Z"
                          />
                        </svg>
                        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#DCE6DA]/70 blur-2xl" />
                        <svg
                          aria-hidden
                          viewBox="0 0 120 120"
                          className="pointer-events-none absolute bottom-6 right-6 h-28 w-28 text-[#8FAE93]/50 md:h-36 md:w-36"
                          fill="none"
                        >
                          <path
                            d="M15 105 C 40 80, 40 45, 70 15 M70 15 C 58 24, 44 24, 40 15 M70 15 C 76 27, 76 42, 64 50 M70 15 C 82 20, 92 20, 100 12"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>

                        <div
                          id="sec-history-milestones"
                          className="relative mx-auto w-full max-w-[1400px] px-4 md:px-6"
                        >
                          <Reveal>
                            <div
                              className={`grid gap-x-8 gap-y-12 ${
                                historyMilestones.length === 1
                                  ? "grid-cols-1"
                                  : historyMilestones.length === 2
                                    ? "sm:grid-cols-2"
                                    : historyMilestones.length === 3
                                      ? "sm:grid-cols-2 lg:grid-cols-3"
                                      : "sm:grid-cols-2 lg:grid-cols-4"
                              }`}
                            >
                              {historyMilestones.map((item, idx) => {
                                const accent =
                                  MILESTONE_ACCENTS[
                                    idx % MILESTONE_ACCENTS.length
                                  ];
                                const Icon = accent.icon;
                                return (
                                  <div key={idx}>
                                    <div className="flex items-center gap-4">
                                      <span
                                        className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${accent.circle}`}
                                      >
                                        <Icon
                                          className={`h-6 w-6 ${accent.fg}`}
                                        />
                                      </span>
                                      <span
                                        className={`font-serif text-2xl ${accent.fg} opacity-50`}
                                      >
                                        {String(idx + 1).padStart(2, "0")}
                                      </span>
                                    </div>
                                    {item.left && (
                                      <h3 className="mt-5 font-serif text-xl font-semibold leading-snug text-[#202B33]">
                                        {item.left}
                                      </h3>
                                    )}
                                    <span
                                      className={`mt-3 block h-[3px] w-10 rounded-full ${accent.bar}`}
                                    />
                                    {item.right && (
                                      <p className="mt-4 text-[15px] leading-7 text-charcoal-600">
                                        {item.right}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </Reveal>

                          {historyMilestonesTagline && (
                            <div className="mt-14 flex items-center gap-4">
                              <p className="whitespace-nowrap font-script text-[18px] text-[#E0716B]">
                                {historyMilestonesTagline}
                              </p>
                              <span className="h-px w-full max-w-[140px] bg-[#202B33]/25" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

          {blocks.length > 0 && (
            <div id="sec-visionmission">
              <StaggerContainer className="grid gap-6 lg:grid-cols-2">
                {blocks.map((block) => (
                  <StaggerItem key={block.title || block.text}>
                    <TiltCard className="h-full">
                      <div className="card-glow group relative h-full overflow-hidden rounded-[20px] border border-[rgba(32,43,51,0.07)] bg-[#FFFDF9] p-8 text-[#202B33] shadow-sm transition-shadow duration-300 hover:shadow-card md:p-9">
                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFF0F4]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative">
                          <span
                            className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${block.gradient} text-white shadow-[0_10px_24px_rgba(255,97,127,0.18)]`}
                          >
                            <block.icon className="h-6 w-6" />
                          </span>
                          {block.title && (
                            <h3 className="text-display-lg font-serif font-medium tracking-tight text-[#202B33]">
                              {block.title}
                            </h3>
                          )}
                          <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
                            {block.text}
                          </p>
                        </div>
                      </div>
                    </TiltCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}

          {values.length > 0 && (
            <section id="sec-values">
              {valuesTitle && (
                <Reveal className="mb-9 flex flex-col items-center gap-4 text-center">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#FF617F] to-[#FF846F] text-white shadow-[0_10px_24px_rgba(255,97,127,0.22)]">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <h2 className="text-display-xl font-serif font-medium tracking-tight text-[#202B33]">
                      {valuesTitle}
                    </h2>
                  </div>
                  <span className="living-spectrum-line" />
                </Reveal>
              )}
              <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {values.map((value, i) => {
                  const accent = VALUE_ACCENTS[i % VALUE_ACCENTS.length];
                  return (
                    <StaggerItem key={i}>
                      <TiltCard className="h-full">
                        <div
                          className={`card-glow group relative h-full overflow-hidden rounded-[20px] border border-[rgba(32,43,51,0.09)] p-6 shadow-sm transition-shadow duration-300 hover:shadow-card ${accent.tint}`}
                        >
                          <span
                            className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${accent.bar} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                          />
                          <span
                            className={`bg-gradient-to-br ${accent.bar} bg-clip-text font-serif text-5xl font-medium tracking-tight text-transparent`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h3 className="mt-3 font-bold text-[#202B33]">
                            {value.left}
                          </h3>
                          {value.right && (
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                              {value.right}
                            </p>
                          )}
                        </div>
                      </TiltCard>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </section>
          )}

          <TextBlock
            id="sec-community"
            icon={Users}
            title={communityTitle}
            text={community}
          />

          {extraText && (
            <Reveal>
              <section
                id="sec-extra"
                className="donate-spectrum-wash bg-grain relative overflow-hidden rounded-[24px] border border-[rgba(32,43,51,0.09)] p-8 text-[#202B33] shadow-sm md:p-10"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FF6F91]/[0.12] blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-[#83D8B6]/[0.12] blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-56 w-56 rounded-full bg-[#FFD66B]/[0.10] blur-3xl" />
                <div className="relative">
                  {extraTitle && (
                    <h2 className="text-display-xl font-serif font-medium tracking-tight">
                      {extraTitle}
                    </h2>
                  )}
                  <p className="mt-4 max-w-3xl whitespace-pre-line leading-relaxed text-[#667078] md:text-lg">
                    {extraText}
                  </p>
                </div>
              </section>
            </Reveal>
          )}
        </div>
      </div>
    </>
  );
}
