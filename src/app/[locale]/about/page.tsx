import { Eye, Target, Users, BookOpen, Sparkles, History } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sPairs } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { TiltCard } from "@/components/site/tilt-card";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";

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
    { icon: Eye, title: visionTitle, text: vision, gradient: "from-brand-600 to-accent" },
    { icon: Target, title: missionTitle, text: mission, gradient: "from-teal-600 to-brand-500" },
  ].filter((b) => b.text);

  /**
   * Heading + prose block, rendered only when there is text. `reverse` swaps
   * which side the photo sits on so the page doesn't feel like the same
   * two-column block repeated three times.
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
    return (
      <section
        id={id}
        className={`grid items-center gap-12 ${image ? "lg:grid-cols-[1fr_1fr]" : ""}`}
      >
        <Reveal
          direction={image && reverse ? "right" : "left"}
          className={image && reverse ? "lg:order-2" : undefined}
        >
          <div className={image ? "max-w-xl" : "mx-auto max-w-3xl text-center"}>
            {title && (
              <div className={`mb-4 flex items-center gap-3 ${image ? "" : "justify-center"}`}>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent text-white shadow-glow">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="text-display-lg font-extrabold tracking-tight text-navy-900">
                  {title}
                </h2>
              </div>
            )}
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{text}</p>
          </div>
        </Reveal>
        {image && (
          <div
            data-animate
            data-delay="0.12"
            className={`overflow-hidden rounded-3xl shadow-card-hover ${reverse ? "lg:order-1" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={title} className="aspect-[4/3] w-full object-cover" />
          </div>
        )}
      </section>
    );
  };

  return (
    <>
      <PageHero
        title={s(settings, "about_hero_title", locale)}
        intro={s(settings, "about_hero_intro", locale)}
        image={s(settings, "about_hero_image") || undefined}
      />

      <div className="mx-auto w-full max-w-[1400px] space-y-20 px-4 py-20 md:space-y-28 md:px-6 md:py-28">
        <TextBlock
          id="sec-overview"
          icon={BookOpen}
          title={overviewTitle}
          text={overview}
          image={overviewImage || undefined}
        />

        {blocks.length > 0 && (
          <div id="sec-visionmission">
            <StaggerContainer className="grid gap-6 md:grid-cols-2">
              {blocks.map((block) => (
                <StaggerItem key={block.title || block.text}>
                  <TiltCard className="h-full">
                    <div className="card-glow group relative h-full overflow-hidden rounded-3xl border border-border bg-white p-8 shadow-card transition-shadow duration-300">
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative">
                        <span
                          className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${block.gradient} text-white shadow-glow`}
                        >
                          <block.icon className="h-6 w-6" />
                        </span>
                        {block.title && (
                          <h3 className="mb-2 text-lg font-bold text-navy-900">{block.title}</h3>
                        )}
                        <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
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
              <Reveal className="mb-10 flex items-center justify-center gap-3 text-center">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent text-white shadow-glow">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h2 className="text-display-lg font-extrabold tracking-tight text-navy-900">
                  {valuesTitle}
                </h2>
              </Reveal>
            )}
            <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value, i) => (
                <StaggerItem key={i}>
                  <TiltCard className="h-full">
                    <div className="card-glow h-full rounded-3xl border border-border bg-white p-7 shadow-card transition-shadow duration-300">
                      <span className="font-number text-sm font-bold text-primary/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-2 font-bold text-navy-900">{value.left}</h3>
                      {value.right && (
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {value.right}
                        </p>
                      )}
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
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
              className="cta-gradient-shift bg-grain relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 via-brand-800 to-brand-600 p-10 text-white shadow-glow md:p-14"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
              <div className="relative">
                {extraTitle && (
                  <h2 className="text-display-lg font-extrabold tracking-tight">{extraTitle}</h2>
                )}
                <p className="mt-3 max-w-3xl whitespace-pre-line leading-relaxed text-white/80">
                  {extraText}
                </p>
              </div>
            </section>
          </Reveal>
        )}
      </div>
    </>
  );
}
