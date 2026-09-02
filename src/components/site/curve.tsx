import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Organic section-divider paths, rendered in currentColor — set the text
 * color to the color of the band the curve belongs to (e.g. `text-navy-950`
 * above a navy band). Three gentle variants keep back-to-back dividers from
 * reading as the same wave repeated down the page; "wave" is the original
 * default so every existing call site is unaffected.
 *
 * Kept at full opacity on purpose: this is a structural colour bridge. Fading
 * it in exposes the mismatched band underneath and reads as a white flash.
 */
const PATHS = {
  wave: "M0,72 L0,40 C240,4 480,0 720,14 C960,28 1200,64 1440,30 L1440,72 Z",
  arc: "M0,72 L0,50 C480,6 960,6 1440,50 L1440,72 Z",
  tilt: "M0,72 L0,60 C480,50 960,10 1440,20 L1440,72 Z",
} as const;

export function Curve({
  flip,
  className,
  variant = "wave",
  style,
}: {
  flip?: boolean;
  className?: string;
  variant?: keyof typeof PATHS;
  style?: CSSProperties;
}) {
  const d = PATHS[variant];

  return (
    <svg
      viewBox="0 0 1440 72"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("block h-10 w-full fill-current md:h-[72px]", flip && "rotate-180", className)}
      style={style}
    >
      <path d={d} />
    </svg>
  );
}
