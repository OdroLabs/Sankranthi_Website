"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Organic connecting line for the Beauty → Income → Impact flow. Draws
 * itself in like a water ripple / plant stem once the section is in view.
 */
export function NelumeFlowPath({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <svg viewBox="0 0 800 120" preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="nelume-flow-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#AFC4D8" />
          <stop offset="50%" stopColor="#C9939F" />
          <stop offset="100%" stopColor="#80936D" />
        </linearGradient>
      </defs>
      <motion.path
        d="M40,60 C220,8 260,112 400,60 C540,8 580,112 760,60"
        fill="none"
        stroke="url(#nelume-flow-gradient)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
