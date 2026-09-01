"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives smooth, inertial scrolling site-wide and keeps GSAP's
 * ScrollTrigger in sync with it (Lenis owns the scroll position; GSAP just
 * needs to be told when it changes, and to drive its own render loop off
 * the same rAF tick so both stay frame-locked).
 *
 * Skipped entirely under prefers-reduced-motion and inside the admin
 * preview iframe, where instant/native scrolling is the correct behaviour.
 */
export function LenisProvider() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("adminPreview")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.7,
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Named so it can be un-registered on cleanup. Without this, React 18's
    // dev-mode double-invoke of this effect (mount -> cleanup -> mount)
    // leaves a stale ticker callback closed over the *first*, already-
    // destroyed Lenis instance permanently registered on gsap.ticker.
    // Lenis's own destroy() doesn't tear down its internal wheel/touch
    // listeners or null its animate loop, so that dead instance keeps
    // receiving raf() ticks and driving its own scroll physics for the
    // rest of the session -- fighting the live instance for control of
    // the scroll position and producing exactly the kind of stuck/ghosted
    // content mid-scroll this was chasing (GSAP ScrollTrigger's viewport
    // recalculation, and anything timed off real scroll position, sees two
    // disagreeing sources of truth).
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    document.documentElement.classList.add("lenis-active");

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      document.documentElement.classList.remove("lenis-active");
    };
  }, []);

  return null;
}
