"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Vertical scroll parallax for a decorative element (image, blob, orb).
 * `strength` is the max travel in pixels in each direction — keep it small
 * (10–40px) so the effect reads as "elegant drift", not a sliding puzzle.
 */
export function Parallax({
  children,
  strength = 24,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y }} className={cn("will-change-transform", className)}>
      {children}
    </motion.div>
  );
}

/**
 * Subtle mouse-follow drift for hero decoration (background layer, gradient
 * orbs). Movement is intentionally tiny — this should read as atmosphere,
 * never as something the page is doing "to" the cursor.
 */
export function useMouseParallax(strength = 14) {
  const reduceMotion = useReducedMotion();
  return { strength: reduceMotion ? 0 : strength };
}
