"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Counts up to the numeric part of `value` when scrolled into view, e.g.
 * "2,500+" animates 0 → 2500 and keeps the "+" suffix. Drop-in replacement
 * for the previous IntersectionObserver-based StatCounter, sharing the same
 * viewport logic via Framer Motion's useInView.
 */
export function CountUp({ value, duration = 1.8 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const match = value.match(/^(\D*)([\d,]*\d)(.*)$/);
    if (!match) return;
    const [, prefix, num, suffix] = match;
    const target = parseInt(num.replace(/,/g, ""), 10);
    if (Number.isNaN(target)) return;

    if (!inView) {
      setDisplay(`${prefix}0${suffix}`);
      return;
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(`${prefix}${Math.round(target * eased).toLocaleString()}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduceMotion]);

  return <span ref={ref}>{display}</span>;
}
