import { Eye, Target, Users, BookOpen, Sparkles, History } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
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

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  const overviewTitle = s(settings, "about_overview_title", locale);
  const overview = s(settings, "about_overview", locale);
  const overviewImage = s(settings, "about_overview_image");

  const visionTitle = s(settings, "about_vision_title", locale);
  const vision = s(settings, "about_vision", locale);
  const missionTitle = s(settings, "about_mission_title", locale);
  const mission = s(settings, "about_mission", locale);

  const valuesTitle = s(settings, "about_values_title", locale);
  const values = sPairs(settings, "about_values", locale);

  const communityTitle = s(settings, "about_community_title", locale);
  const community = s(settings, "about_community", locale);

  const historyTitle = s(settings, "about_history_title", locale);
  const history = s(settings, "about_history", locale);
  const historyImage = s(settings, "about_history_image");

  const extraTitle = s(settings, "about_extra_title", locale);
  const extraText = s(settings, "about_extra_text", locale);

  // Each card only appears when it has text.
  const blocks = [
    { icon: Eye, title: visionTitle, text: vision, gradient: "from-[#FF617F] to-[#FF846F]" },
    { icon: Target, title: missionTitle, text: mission, gradient: "from-[#83D8B6] to-[#83CDED]" },
  ].filter((b) => b.text);

  /**
   * Heading + prose block, rendered only when there is text. `reverse` swaps
   * which side the photo sits on so the page doesn't feel like the same
   * two-column block repeated three times. When there's no photo the block
   * still reads as an asymmetric composition — a narrow icon/rule column
   * beside the prose — rather than a centered stack.
   *
   * The photo itself intentionally uses the site-wide GSAP `data-animate` /
   * `data-parallax` reveal (the same mechanism PageHero's own background
   * photo uses) rather than the Framer Motion ImageReveal/Parallax pair —
   * that combination turned out to be unreliable for these two-column CMS
   * photos specifically, so plain, proven CSS/GSAP wins here even though
   * the rest of the page uses Framer Motion.
   */
  const TextBlock = ({
    id,
    icon: Icon,
    title,
    text,
    image,
    reverse,
  }: {
    id: string;
    icon: typeof Eye;
    title: string;
    text: string;
    image?: string;
    reverse?: boolean;
  }) => {
    if (!text) return null;

    if (image) {
      return (
        <section id={id} className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
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
            <img src={image} alt={title} className="aspect-[4/3] w-full object-cover" />
            <span className="pointer-events-none absolute inset-x-6 -bottom-3 h-[2px] rounded-full bg-living-spectrum opacity-70" />
          </div>
        </section>
      );
    }

    return (
      <section id={id} className="grid gap-8 lg:grid-cols-[minmax(0,220px)_1fr] lg:gap-16">
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
  };

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
        <TextBlock
          id="sec-overview"
          icon={BookOpen}
          title={overviewTitle}
          text={overview}
          image={overviewImage || undefined}
        />

        {blocks.length > 0 && (
          <div id="sec-visionmission">
            <StaggerContainer className="grid gap-6 lg:grid-cols-2">
              {blocks.map((block, idx) => {
                const dark = idx % 2 === 0;
                return (
                  <StaggerItem key={block.title || block.text}>
                    <TiltCard className="h-full">
                      <div
                        className={`card-glow group relative h-full overflow-hidden rounded-[20px] p-8 shadow-sm transition-shadow duration-300 hover:shadow-card md:p-9 ${
                          dark
                            ? "bg-[#202B33] text-white"
                            : "border border-[rgba(32,43,51,0.07)] bg-[#FFFDF9] text-[#202B33]"
                        }`}
                      >
                        {dark ? (
                          <>
                            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#FF6F91]/[0.16] blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-16 -left-6 h-52 w-52 rounded-full bg-[#83D8B6]/[0.14] blur-3xl" />
                          </>
                        ) : (
                          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFF0F4]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        )}
                        <div className="relative">
                          <span
                            className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${block.gradient} text-white shadow-[0_10px_24px_rgba(255,97,127,0.18)]`}
                          >
                            <block.icon className="h-6 w-6" />
                          </span>
                          {block.title && (
                            <h3
                              className={`text-display-lg font-serif font-medium tracking-tight ${dark ? "text-white" : "text-[#202B33]"}`}
                            >
                              {block.title}
                            </h3>
                          )}
                          <p
                            className={`mt-4 whitespace-pre-line leading-relaxed ${dark ? "text-white/75" : "text-muted-foreground"}`}
                          >
                            {block.text}
                          </p>
                        </div>
                      </div>
                    </TiltCard>
                  </StaggerItem>
                );
              })}
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
                      <div className={`card-glow group relative h-full overflow-hidden rounded-[20px] border border-[rgba(32,43,51,0.09)] p-6 shadow-sm transition-shadow duration-300 hover:shadow-card ${accent.tint}`}>
                        <span
                          className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${accent.bar} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                        />
                        <span
                          className={`bg-gradient-to-br ${accent.bar} bg-clip-text font-serif text-5xl font-medium tracking-tight text-transparent`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="mt-3 font-bold text-[#202B33]">{value.left}</h3>
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

        <TextBlock id="sec-community" icon={Users} title={communityTitle} text={community} />

        <TextBlock
          id="sec-history"
          icon={History}
          title={historyTitle}
          text={history}
          image={historyImage || undefined}
          reverse
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
