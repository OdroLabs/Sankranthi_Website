"use client";

import { useEffect, useRef } from "react";

const STOPS: Array<[number, number, number]> = [
  [255, 113, 109], // coral
  [255, 214, 107], // sunlight
  [131, 216, 182], // mint
  [131, 205, 237], // sky
  [169, 149, 232], // lavender
];

function mix(a: [number, number, number], b: [number, number, number], t: number) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

function colorAt(progress: number) {
  const clamped = Math.min(Math.max(progress, 0), 0.999);
  const scaled = clamped * (STOPS.length - 1);
  const index = Math.floor(scaled);
  return mix(STOPS[index], STOPS[index + 1], scaled - index);
}

/**
 * A single blurred light that slowly walks the page on scroll, shifting
 * through the LGBTQIA+ spectrum at ~10% opacity. Decorative only.
 */
export function LivingSpectrum() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const t = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      orb.style.backgroundColor = colorAt(t);
      orb.style.transform = `translate3d(${t * 42}vw, ${t * 36}vh, 0)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return <div ref={orbRef} aria-hidden className="living-spectrum-orb" />;
}
