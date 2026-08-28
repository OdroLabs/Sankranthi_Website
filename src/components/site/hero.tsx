"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Curve } from "@/components/site/curve";

export interface HeroNewsItem {
  id: string;
  href: string;
  title: string;
  date: string;
  image?: string;
}

export interface HeroProps {
  locale: string;
  heroImage?: string;
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCta1?: string;
  heroCta1Href?: string;
  news: HeroNewsItem[];
  facebookUrl?: string;
  donateHref: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const heroLine = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/**
 * Cinematic full-bleed hero: Ken Burns background, layered gradients, a
 * line-by-line headline reveal on load, and a very subtle mouse-follow
 * parallax across the background / glow orbs / content. Everything here is
 * presentation only — all copy and links come from the CMS via props.
 */
export function Hero({
  locale,
  heroImage,
  heroBadge,
  heroTitle,
  heroSubtitle,
  heroCta1,
  heroCta1Href,
  news,
  facebookUrl,
  donateHref,
}: HeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 50, damping: 20, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 50, damping: 20, mass: 0.6 });

  const bgX = useTransform(springX, (v) => v * 10);
  const bgY = useTransform(springY, (v) => v * 8);
  const orbX = useTransform(springX, (v) => v * -22);
  const orbY = useTransform(springY, (v) => v * -16);
  const contentX = useTransform(springX, (v) => v * 4);
  const contentY = useTransform(springY, (v) => v * 3);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const titleLines = (heroTitle ?? "").split("\n").filter(Boolean);

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      id="sec-hero"
      className="hero2 relative isolate flex min-h-[90vh] items-center overflow-hidden bg-navy-950 text-white md:min-h-[94vh]"
    >
      {heroImage && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Outer layer: Framer-driven mouse parallax (translate only). */}
          <motion.div className="absolute -inset-y-[12%] inset-x-0" style={{ x: bgX, y: bgY }}>
            {/* Inner layer: CSS Ken Burns keyframe owns `transform` here, so
                the two animation systems never fight over the same property. */}
            <div
              className="hero2__bg h-full w-full scale-110 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
          </motion.div>
        </div>
      )}

      {/* Cinematic scrim, deepest bottom-left */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/55 to-navy-950/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-navy-950/10 to-transparent" />
      {/* Atmospheric purple wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-transparent to-transparent mix-blend-overlay" />

      {/* Ambient glows, drifting a little further with the cursor than the background */}
      <motion.div
        style={{ x: orbX, y: orbY }}
        className="pointer-events-none absolute -left-16 top-16 h-72 w-72"
      >
        <span className="hero2__orb hero2__orb--1 block h-full w-full rounded-full bg-accent/25 blur-3xl" />
      </motion.div>
      <motion.div
        style={{ x: orbX, y: orbY }}
        className="pointer-events-none absolute bottom-0 right-1/3 h-80 w-80"
      >
        <span className="hero2__orb hero2__orb--2 block h-full w-full rounded-full bg-brand-500/25 blur-3xl" />
      </motion.div>

      <motion.div
        style={{ x: contentX, y: contentY }}
        className="mx-auto w-full max-w-[1400px] px-4 md:px-6 relative grid gap-10 py-24 md:py-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-40"
      >
        <motion.div
          variants={reduceMotion ? undefined : heroContainer}
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "visible"}
        >
          {heroBadge && (
            <motion.span
              variants={heroLine}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5" /> {heroBadge}
            </motion.span>
          )}

          {titleLines.length > 0 && (
            <h1 className="text-display-hero max-w-2xl font-extrabold text-white drop-shadow-sm">
              {(titleLines.length > 0 ? titleLines : [heroTitle]).map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span variants={heroLine} className="block">
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
          )}

          {heroSubtitle && (
            <motion.p variants={heroLine} className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              {heroSubtitle}
            </motion.p>
          )}

          {heroCta1 && (
            <motion.div variants={heroLine} className="mt-9">
              <Button
                asChild
                size="lg"
                className="group rounded-full bg-accent px-8 font-bold text-navy-950 shadow-glow transition-transform duration-300 hover:-translate-y-0.5 hover:bg-accent/90"
              >
                <Link href={heroCta1Href ?? `/${locale}`}>
                  {heroCta1}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </Button>
            </motion.div>
          )}
        </motion.div>

        {news.length > 0 && (
          <motion.aside
            initial={reduceMotion ? undefined : { opacity: 0, y: 28 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            aria-label="Latest news and updates"
            className="hero2__news relative w-full max-w-sm justify-self-start rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl lg:justify-self-end"
          >
            <h2 className="mb-4 text-lg font-bold text-white">Latest News &amp; Updates</h2>
            <ul className="space-y-4">
              {news.slice(0, 3).map((item) => (
                <li key={item.id} className="border-t border-white/15 pt-4 first:border-0 first:pt-0">
                  <Link href={item.href} className="group flex gap-3">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="h-14 w-14 shrink-0 rounded-xl object-cover shadow-md"
                        src={item.image}
                        alt={item.title}
                      />
                    )}
                    <span className="min-w-0">
                      <span className="block line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors group-hover:text-accent">
                        {item.title}
                      </span>
                      <time className="mt-1 block text-[11px] font-bold uppercase tracking-wide text-accent">
                        {item.date}
                      </time>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block border-t border-white/15 pt-4 text-center text-xs font-bold text-white/80 transition-colors hover:text-accent"
              >
                Follow us on Facebook
              </a>
            )}
          </motion.aside>
        )}
      </motion.div>

      {/* Floating Support Us tab */}
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, x: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 md:block"
      >
        <Link
          href={donateHref}
          aria-label="Support us"
          className="hero2__donate group flex items-center gap-2 rounded-l-full bg-destructive py-4 pl-4 pr-3 text-xs font-bold text-white shadow-lg shadow-destructive/30 transition hover:bg-destructive/90"
        >
          <Heart className="h-4 w-4 fill-white" />
          <span className="[writing-mode:vertical-rl]">Support Us</span>
        </Link>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={reduceMotion ? undefined : { opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="absolute inset-x-0 bottom-8 hidden flex-col items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 md:flex"
      >
        <span>Scroll to explore</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/20">
          <span className="hero-scrollline absolute inset-x-0 top-0 h-1/2 bg-accent" />
        </span>
      </motion.div>

      <Curve className="absolute inset-x-0 -bottom-px text-background" />
    </section>
  );
}
