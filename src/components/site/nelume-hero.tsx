"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Curve } from "./curve";
import { NelumeIcon, NelumeWatermark } from "./nelume-watermark";

const LOTUS_BLUE = "#899CC7";

export interface NelumeHeroProps {
  locale: string;
  heroTitle: string;
  heroIntro?: string;
  /** Large arched photo on the right — the dominant hero visual. */
  heroImage?: string;
  /** Narrow photo beside the main one (e.g. a nail-treatment close-up). */
  sideImage?: string;
}

/**
 * NELUME's editorial "Lotus Sanctuary" hero — a light, split-composition
 * hero with a breadcrumb, a two-photo collage (main + side), and two CTAs.
 * Content (title, intro, CTA destinations) is untouched; only presentation.
 */
export function NelumeHero({ locale, heroTitle, heroIntro, heroImage, sideImage }: NelumeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  const leftY = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0, -15]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.92]);
  const mainImageY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const sideImageY = useTransform(scrollYProgress, [0, 1], [0, -14]);

  // Desktop-only cursor drift — a few px of parallax, never a tilt.
  const cursorX = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 120, damping: 20 });
  const mainCursorX = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const sideCursorX = useTransform(springX, [-0.5, 0.5], [4, -4]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set((e.clientX - rect.left) / rect.width - 0.5);
  };
  const handlePointerLeave = () => cursorX.set(0);

  return (
    <motion.section
      ref={sectionRef}
      id="sec-page-header"
      className="relative isolate overflow-hidden bg-[#F8F4EE]"
    >
      {/* soft ambient glows — never a full gradient wash */}
      <div
        className="pointer-events-none absolute -left-20 -top-24 h-[380px] w-[380px] rounded-full blur-[130px]"
        style={{ backgroundColor: "rgba(221,182,189,0.14)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-1/3 h-[420px] w-[420px] rounded-full blur-[140px]"
        style={{ backgroundColor: "rgba(175,196,216,0.18)" }}
        aria-hidden
      />
      <div className="bg-grain absolute inset-0 opacity-[0.35]" aria-hidden />

      {/* large watermark behind the copy — only a fragment of the flower is visible */}
      <NelumeWatermark
        variant="lotus"
        size={560}
        opacity={0.05}
        color={LOTUS_BLUE}
        className="-left-20 -bottom-24"
        drift
        driftRotate={3}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-6 pb-16 pt-8 md:px-[clamp(1.5rem,5vw,5rem)] md:pt-10">
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-medium text-[#657DA6]/70 md:mb-10">
          <Link href={`/${locale}`} className="transition-colors hover:text-[#657DA6]">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span>Social Enterprise</span>
          <span aria-hidden>/</span>
          <span aria-current="page" className="text-[#657DA6]">
            NELUME
          </span>
        </nav>

        <div className="grid items-center gap-12 md:min-h-[76svh] md:grid-cols-[44%_56%] md:gap-10">
          {/* -------------------------------------------------------------- LEFT */}
          <motion.div style={reduceMotion ? undefined : { y: leftY, opacity: leftOpacity }}>
            <p className="mb-5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-[#657DA6]">
              <NelumeIcon variant="lotusPetal" size={14} color={LOTUS_BLUE} />
              Sankranthi Foundation &bull; Social Enterprise
            </p>
            <h1
              className="font-serif font-medium leading-[0.95] tracking-tight text-[#344557]"
              style={{ fontSize: "clamp(2.75rem, 6vw, 6rem)" }}
            >
              {heroTitle}
            </h1>
            <span className="my-5 block h-px w-12 bg-[#AFC4D8]" aria-hidden />
            <p className="font-serif text-xl italic text-[#657DA6] md:text-2xl">Beauty, Wellness &amp; Opportunity</p>
            {heroIntro && (
              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.7] text-[#687682] md:text-lg">{heroIntro}</p>
            )}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#sec-story"
                className="group inline-flex items-center gap-2.5 rounded-[10px] bg-[#657DA6] px-6 py-[14px] text-sm font-semibold text-white shadow-[0_10px_30px_rgba(101,125,166,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#596F99]"
              >
                Discover NELUME
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-[3px]" />
              </a>
              <a
                href="#sec-impact"
                className="inline-flex items-center gap-2.5 rounded-[10px] border border-[#344557]/20 bg-[#FCFAF6] px-6 py-[14px] text-sm font-semibold text-[#344557] transition-colors duration-300 hover:border-[#657DA6]/40 hover:bg-white"
              >
                Explore Our Impact
              </a>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------- RIGHT */}
          <div
            className="relative mx-auto flex h-[360px] w-full max-w-[560px] gap-4 sm:h-[440px] md:mx-0 md:ml-auto md:h-[560px] md:max-w-none"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            {/* MAIN image — arch mask */}
            <motion.div
              style={reduceMotion ? undefined : { y: mainImageY, x: mainCursorX }}
              className="relative h-full w-[65%] overflow-hidden rounded-[140px_140px_28px_28px] shadow-[0_24px_70px_rgba(70,62,50,0.12)]"
            >
              {heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F2EEE7] to-[#DDB6BD]/40">
                  <NelumeIcon variant="lotus" size={64} color={LOTUS_BLUE} />
                </div>
              )}
            </motion.div>

            {/* SIDE image */}
            <motion.div
              style={reduceMotion ? undefined : { y: sideImageY, x: sideCursorX }}
              className="relative h-full w-[35%] overflow-hidden rounded-[28px] shadow-[0_24px_70px_rgba(70,62,50,0.12)]"
            >
              {sideImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sideImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#F2EEE7]">
                  <NelumeIcon variant="lotusPetal" size={30} color={LOTUS_BLUE} />
                </div>
              )}
            </motion.div>

            {/* water ripple detail, lower-right */}
            <div className="pointer-events-none absolute -bottom-6 -right-10 hidden opacity-[0.08] md:block" aria-hidden>
              <NelumeIcon variant="waterRipple" size={140} color={LOTUS_BLUE} />
            </div>
          </div>
        </div>
      </div>

      <Curve variant="arc" className="absolute inset-x-0 -bottom-px text-[#FAF7F1]" />
    </motion.section>
  );
}

