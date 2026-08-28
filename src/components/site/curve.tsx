"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Organic section-divider paths, rendered in currentColor — set the text
 * color to the color of the band the curve belongs to (e.g. `text-navy-950`
 * above a navy band). Three gentle variants keep back-to-back dividers from
 * reading as the same wave repeated down the page; "wave" is the original
 * default so every existing call site is unaffected.
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
}: {
  flip?: boolean;
  className?: string;
  variant?: keyof typeof PATHS;
}) {
  const reduceMotion = useReducedMotion();
  const d = PATHS[variant];

  return (
    <motion.svg
      viewBox="0 0 1440 72"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("block h-10 w-full fill-current md:h-[72px]", flip && "rotate-180", className)}
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0, margin: "200px 0px 200px 0px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <path d={d} />
    </motion.svg>
  );
}
