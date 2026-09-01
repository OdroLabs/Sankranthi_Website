import { Curve } from "./curve";

export function PageHero({
  title,
  intro,
  eyebrow,
  image,
  theme = "default",
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  /** Optional background photo set in Site Settings. */
  image?: string;
  /**
   * "default" is the foundation's navy/brand look used on every page.
   * "nelume" is the soft blue/pink/sand palette used only on the
   * NELUME social-enterprise page — see NELUME_PALETTE in business/page.tsx.
   */
  theme?: "default" | "nelume";
}) {
  // Nothing set in the admin for this page header — render nothing at all.
  if (!title && !intro && !eyebrow) return null;

  const isNelume = theme === "nelume";

  return (
    <section
      id="sec-page-header"
      className={`bg-grain relative overflow-hidden ${isNelume ? "bg-[#EFEAE6] text-[#2C2A28]" : "bg-lavender-50 text-charcoal-900"}`}
    >
      {/* Optional photo, sitting under the gradient */}
      {image && (
        <div
          data-parallax="6"
          className={`absolute -inset-y-[10%] inset-x-0 scale-110 bg-cover bg-center ${
            isNelume ? "opacity-25" : "opacity-35"
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      {/* Background gradient — deep navy through violet with a hint of the
          full pride spectrum for NELUME's soft mist-blue → sandy-beige */}
      <div
        className={
          isNelume
            ? `absolute inset-0 bg-gradient-to-br from-[#A4B3CA]/35 via-[#EFEAE6] to-[#D7ADAF]/30 ${image ? "opacity-90" : ""}`
            : `absolute inset-0 bg-gradient-to-br from-blush-100 via-lavender-50 to-sky-100 ${image ? "opacity-90" : ""}`
        }
      />
      {/* Rainbow glow accents — three soft blooms instead of one, so the full
          identity (violet/magenta, blue, gold) reads without going flat or
          cartoonish */}
      <div
        className={`pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl ${
          isNelume ? "bg-[#98A1C0]/25" : "bg-blush-300/35"
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full blur-3xl ${
          isNelume ? "bg-[#D7ADAF]/25" : "bg-lavender-300/35"
        }`}
      />
      {!isNelume && (
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-peach-200/35 blur-3xl" />
      )}
      {/* Thin abstract rule, top-right — a quiet decorative flourish rather
          than a repeated block shape */}
      {!isNelume && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-6 top-8 hidden h-24 w-24 rounded-full border border-charcoal-900/10 md:block lg:right-16"
        />
      )}

      <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-20 pt-16 md:px-6 md:pb-28 md:pt-20">
        {eyebrow && (
          <p
            data-hero
            className={`mb-3 text-xs font-bold uppercase tracking-[0.22em] ${
              isNelume ? "text-[#95632E]" : "bg-spectrum bg-clip-text text-transparent"
            }`}
          >
            {eyebrow}
          </p>
        )}
        {title && (
          <h1
            data-hero
            className="text-display-xl max-w-2xl font-serif font-medium tracking-tight"
          >
            {title}
          </h1>
        )}
        {intro && (
          <p
            data-hero
            className={`mt-4 max-w-2xl whitespace-pre-line leading-relaxed md:text-lg ${
              isNelume ? "text-[#2C2A28]/70" : "text-charcoal-700/80"
            }`}
          >
            {intro}
          </p>
        )}
        <span
          data-hero
          className={`mt-7 block h-[3px] w-20 rounded-full ${
            isNelume ? "bg-gradient-to-r from-[#98A1C0] to-[#D7ADAF]" : "bg-pride-flag"
          }`}
        />
      </div>

      <Curve className={`absolute inset-x-0 -bottom-px ${isNelume ? "text-[#EFEAE6]" : "text-background"}`} />
    </section>
  );
}
