"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * NELUME brand motifs — lotus, petal, ripple, incense and leaf line art.
 * Shared between the large low-opacity background watermarks and the small
 * foreground line icons so the whole page draws from one consistent set.
 */
export type NelumeMotif = "lotus" | "lotusPetal" | "waterRipple" | "incense" | "leaf";

const VIEWBOX: Record<NelumeMotif, string> = {
  lotus: "0 0 200 200",
  lotusPetal: "0 0 120 200",
  waterRipple: "0 0 200 200",
  incense: "0 0 100 200",
  leaf: "0 0 200 200",
};

function MotifPaths({ variant, strokeWidth }: { variant: NelumeMotif; strokeWidth: number }) {
  switch (variant) {
    case "lotus":
      return (
        <g fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          {[-60, -30, 0, 30, 60].map((angle) => (
            <path
              key={angle}
              d="M100,150 C78,108 78,55 100,20 C122,55 122,108 100,150 Z"
              transform={`rotate(${angle} 100 150)`}
            />
          ))}
          <circle cx="100" cy="150" r="9" />
        </g>
      );
    case "lotusPetal":
      return (
        <g fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M60,190 C28,138 28,62 60,10 C92,62 92,138 60,190 Z" />
          <path d="M60,178 L60,22" opacity={0.6} />
        </g>
      );
    case "waterRipple":
      return (
        <g fill="none" strokeWidth={strokeWidth}>
          <circle cx="100" cy="100" r="28" />
          <circle cx="100" cy="100" r="58" opacity={0.75} />
          <circle cx="100" cy="100" r="90" opacity={0.5} />
        </g>
      );
    case "incense":
      return (
        <g fill="none" strokeWidth={strokeWidth} strokeLinecap="round">
          <line x1="50" y1="120" x2="50" y2="188" />
          <ellipse cx="50" cy="190" rx="22" ry="6" />
          <path d="M50,120 C38,102 62,90 50,72 C38,54 62,42 52,26" opacity={0.85} />
        </g>
      );
    case "leaf":
      return (
        <g fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M100,190 C38,150 26,66 100,10 C174,66 162,150 100,190 Z" />
          <path d="M100,178 L100,22" opacity={0.6} />
          <path d="M100,90 L70,60" opacity={0.45} />
          <path d="M100,120 L138,96" opacity={0.45} />
        </g>
      );
    default:
      return null;
  }
}

export interface NelumeWatermarkProps {
  variant: NelumeMotif;
  /** Rendered width/height in px. */
  size?: number;
  /** Final resting opacity once revealed — keep between 0.03 and 0.09. */
  opacity?: number;
  /** Static rotation in degrees. */
  rotation?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
  /** Adds a very subtle scroll-linked drift — small translateY + a few degrees of rotate. */
  drift?: boolean;
  driftY?: number;
  driftRotate?: number;
}

/**
 * Large, low-opacity decorative brand motif for section backgrounds.
 * Fades + scales in once on first view, then optionally drifts on scroll.
 * Always `aria-hidden` — purely atmospheric, never load-bearing for meaning.
 */
export function NelumeWatermark({
  variant,
  size = 320,
  opacity = 0.05,
  rotation = 0,
  color = "#657DA6",
  className,
  strokeWidth = 1.2,
  drift = false,
  driftY = 18,
  driftRotate = 5,
}: NelumeWatermarkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, drift ? driftY : 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [rotation, drift ? rotation + driftRotate : rotation]);

  const svg = (
    <svg width={size} height={size} viewBox={VIEWBOX[variant]} style={{ color }} stroke="currentColor">
      <MotifPaths variant={variant} strokeWidth={strokeWidth} />
    </svg>
  );

  if (reduceMotion) {
    return (
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute select-none", className)}
        style={{ opacity, transform: `rotate(${rotation}deg)` }}
      >
        {svg}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none will-change-transform", className)}
      style={{ y, rotate }}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {svg}
    </motion.div>
  );
}

/** Small static foreground line icon sharing the watermark's motif set. */
export function NelumeIcon({
  variant,
  size = 24,
  color = "currentColor",
  strokeWidth = 1.4,
  className,
}: {
  variant: NelumeMotif;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={VIEWBOX[variant]}
      stroke={color}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <MotifPaths variant={variant} strokeWidth={strokeWidth} />
    </svg>
  );
}
