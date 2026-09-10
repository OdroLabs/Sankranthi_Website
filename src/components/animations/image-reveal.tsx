"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "./variants";

/**
 * Reveals an image/card by animating its clip-path open, bottom-to-top, the
 * first time it scrolls into view. Wrap a single block-level child (usually
 * a div with a background image or a Next.js <Image>).
 *
 * Driven by `useInView` (a ref + IntersectionObserver) rather than the
 * declarative `whileInView` prop, PLUS a short timed fallback that reveals
 * the content regardless if the observer hasn't fired yet. `whileInView` was
 * observed getting permanently stuck at its initial (fully clipped/hidden)
 * state for some images in production — likely an IntersectionObserver edge
 * case (nested transformed ancestors, layout shift as the image loads, or a
 * hydration timing quirk) that's hard to pin down and easy to hit again.
 * Since the content underneath is real, meaningful content (not decoration),
 * it must never be left permanently invisible just because a scroll
 * animation failed to trigger — the fallback timer guarantees that.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (inView) setRevealed(true);
  }, [inView]);

  useEffect(() => {
    // Safety net: if the viewport observer never fires (for whatever
    // reason), don't leave the image hidden forever.
    const timer = setTimeout(() => setRevealed(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={{ clipPath: revealed ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}
