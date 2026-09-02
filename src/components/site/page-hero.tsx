import { Curve } from "./curve";

/**
 * Full-bleed surface colours used under the hero wave. The wave fill must
 * match the band that follows — otherwise the ivory curve reads as a white
 * stripe on cream / blush / peach.
 */
export const PAGE_SURFACES = {
  cream: "#FFF9F5",
  ivory: "#FFFDF9",
  peach: "#FFF3ED",
  blush: "#FFF0F4",
  mint: "#EFF9F4",
  sun: "#FFF8DD",
  lavender: "#F5F1FF",
} as const;

export type PageSurface = keyof typeof PAGE_SURFACES;

export function PageHero({
  title,
  intro,
  eyebrow,
  image,
  theme = "default",
  nextSurface = "ivory",
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
  /**
   * Colour of the section immediately under this hero. Drives the bottom
   * wave fill so the seam stays seamless.
   */
  nextSurface?: PageSurface;
}) {
  // Nothing set in the admin for this page header — render nothing at all.
  if (!title && !intro && !eyebrow) return null;

  const isNelume = theme === "nelume";
  const waveColor = isNelume ? "#EFEAE6" : PAGE_SURFACES[nextSurface];

  return (
    <section
      id="sec-page-header"
      className={`bg-grain relative overflow-hidden ${
        isNelume ? "bg-[#EFEAE6] text-[#2C2A28]" : "hero-organic-light text-charcoal-900"
      }`}
    >
      {image && (
        <div
          data-parallax="6"
          className={`absolute -inset-y-[10%] inset-x-0 scale-110 bg-cover bg-center ${
            isNelume ? "opacity-25" : "opacity-20"
          }`}
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div
        className={
          isNelume
            ? `absolute inset-0 bg-gradient-to-br from-[#A4B3CA]/35 via-[#EFEAE6] to-[#D7ADAF]/30 ${image ? "opacity-90" : ""}`
            : "pointer-events-none absolute inset-0"
        }
        style={
          isNelume
            ? undefined
            : {
                backgroundImage: [
                  "radial-gradient(circle at 18% 18%, rgba(255,111,145,0.09), transparent 30%)",
                  "radial-gradient(circle at 52% 28%, rgba(255,214,107,0.09), transparent 28%)",
                  "radial-gradient(circle at 88% 16%, rgba(131,216,182,0.09), transparent 30%)",
                ].join(", "),
              }
        }
      />
      {!isNelume && (
        <>
          {/* Keep glows in the upper hero — bottom-edge orbs tint the wave scallops */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-[#FF6F91]/[0.07] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-[#FFD66B]/[0.07] blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-4 h-52 w-52 rounded-full bg-[#83D8B6]/[0.07] blur-3xl"
          />
        </>
      )}
      {isNelume && (
        <>
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#98A1C0]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-[#D7ADAF]/25 blur-3xl" />
        </>
      )}

      <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-14 pt-12 md:px-6 md:pb-16 md:pt-14">
        {eyebrow && (
          <p
            data-hero
            className={`mb-3 text-xs font-bold uppercase tracking-[0.22em] ${
              isNelume ? "text-[#95632E]" : "text-[#C94F72]"
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
              isNelume ? "text-[#2C2A28]/70" : "text-[#667078]"
            }`}
          >
            {intro}
          </p>
        )}
        <span
          data-hero
          className={`mt-7 ${isNelume ? "block h-[3px] w-20 rounded-full bg-gradient-to-r from-[#98A1C0] to-[#D7ADAF]" : "living-spectrum-line"}`}
        />
      </div>

      {/* Soften organic lighting inside the wave scallops so left/right corners
          don't read as a pink/mint patch against the next surface. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 md:h-28"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${waveColor} 88%)`,
        }}
      />

      {/* Structural colour bridge — always painted, never faded in */}
      <Curve className="absolute inset-x-0 -bottom-px z-[2]" style={{ color: waveColor }} />
    </section>
  );
}
