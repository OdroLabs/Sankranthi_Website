"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { fadeUp, fadeLeft, fadeRight, scaleIn } from "./variants";

type RevealDirection = "up" | "left" | "right" | "scale";

const VARIANT_MAP: Record<RevealDirection, Variants> = {
  up: fadeUp,
  left: fadeLeft,
  right: fadeRight,
  scale: scaleIn,
};

/**
 * Fades + slides a section into view once, the first time it scrolls into
 * the viewport. This is the Framer Motion counterpart to the site-wide GSAP
 * `data-animate` marker — use it inside client components where a plain
 * data attribute isn't available (e.g. new interactive homepage blocks).
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as = "div",
  amount = 0.2,
}: {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  className?: string;
  as?: "div" | "span";
  amount?: number;
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  if (reduceMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={VARIANT_MAP[direction]}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}
