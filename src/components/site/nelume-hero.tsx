"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Curve } from "./curve";
import { NelumeIcon, NelumeWatermark } from "./nelume-watermark";

const LOTUS_BLUE = "#899CC7";
const MIST_BLUE = "#AFC4D8";
const SAGE = "#80936D";

export interface NelumeHeroProps {
  heroTitle: string;
  heroIntro?: string;
  heroImage?: string;
  secondaryImage?: string;
  detailImage?: string;
}

/**
 * NELUME's editorial "Lotus Sanctuary" hero — a light, split-composition
 * hero replacing the previous dark full-bleed treatment. Content (title,
 * intro, CTA wording/links) is untouched; only the presentation changes.
 */
export function NelumeHero({ heroTitle, heroIntro, heroImage, secondaryImage, detailImage }: NelumeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  // Approximates the brief's 0-20 / 20-45 / 45-70 / 70-100% scroll bands.
  const leftY = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [0, 0, 0, -15]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.92]);
  const mainImageY = useTransform(scrollYProgress, [0, 0.2, 0.45, 1], [0, 0, -18, -32]);
  const secondaryImageY = useTransform(scrollYProgress, [0, 0.2, 1], [0, 0, 10]);
  const rippleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.45, 1], [0.06, 0.06, 0.1, 0.1]);
  const bg = useTransform(scrollYProgress, [0.45, 0.7], ["#F8F4EE", "#F4EFE7"]);

  // Reuses whatever NELUME imagery is already uploaded — no new content —
  // padding to 3 slots so the main visual can gently cross-fade on scroll.
  const uniqueImages = Array.from(new Set([heroImage, secondaryImage, detailImage].filter(Boolean))) as string[];
  const mainImages = [uniqueImages[0], uniqueImages[1] ?? uniqueImages[0], uniqueImages[2] ?? uniqueImages[0]];

  const bound1 = 1 / 3;
  const bound2 = 2 / 3;
  const mainOp0 = useTransform(scrollYProgress, [0, bound1 - 0.06, bound1], [1, 1, 0]);
  const mainOp1 = useTransform(scrollYProgress, [bound1 - 0.06, bound1, bound2 - 0.06, bound2], [0, 1, 1, 0]);
  const mainOp2 = useTransform(scrollYProgress, [bound2 - 0.06, bound2, 1], [0, 1, 1]);
  const mainOpacities = [mainOp0, mainOp1, mainOp2];

  const [activeSlide, setActiveSlide] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveSlide(v < bound1 ? 0 : v < bound2 ? 1 : 2);
  });

  // Desktop-only cursor drift — a few px of parallax, never a tilt.
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 120, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 120, damping: 20 });
  const mainCursorX = useTransform(springX, [-0.5, 0.5], [-5, 5]);
  const secondaryCursorX = useTransform(springX, [-0.5, 0.5], [3, -3]);
  const secondaryCursorY = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const secondaryY = useTransform([secondaryImageY, secondaryCursorY], (values: number[]) => values[0] + values[1]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set((e.clientX - rect.left) / rect.width - 0.5);
    cursorY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handlePointerLeave = () => {
    cursorX.set(0);
    cursorY.set(0);
  };

  return (
    <motion.section
      ref={sectionRef}
      id="sec-page-header"
      className="relative isolate overflow-hidden"
      style={{ backgroundColor: reduceMotion ? "#F8F4EE" : bg }}
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
      <div
        className="pointer-events-none absolute -bottom-28 left-1/3 h-[360px] w-[360px] rounded-full blur-[130px]"
        style={{ backgroundColor: "rgba(217,201,182,0.14)" }}
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

      <div className="relative z-10 mx-auto grid min-h-[88svh] w-full max-w-[1360px] items-center gap-12 px-6 py-24 md:min-h-[92svh] md:grid-cols-[46%_54%] md:gap-10 md:px-[clamp(1.5rem,5vw,5rem)] md:py-28">
        {/* -------------------------------------------------------------- LEFT */}
        <motion.div style={reduceMotion ? undefined : { y: leftY, opacity: leftOpacity }}>
          <p className="mb-5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-[#657DA6]">
            <NelumeIcon variant="lotusPetal" size={14} color={LOTUS_BLUE} />
            A Social Enterprise by Sankranthi Foundation
          </p>
          <h1
            className="font-serif font-medium leading-[0.95] tracking-tight text-[#344557]"
            style={{ fontSize: "clamp(2.75rem, 6vw, 6rem)" }}
          >
            {heroTitle}
          </h1>
          <span className="my-5 block h-px w-12 bg-[#AFC4D8]" aria-hidden />
          <p className="text-xl font-light text-[#657DA6] md:text-2xl">Beauty &amp; Wellness Center</p>
          {heroIntro && (
            <p className="mt-6 max-w-[560px] text-[17px] leading-[1.7] text-[#687682] md:text-lg">{heroIntro}</p>
          )}
          <div className="mt-9 flex items-center gap-3">
            <a
              href="#sec-story"
              className="group inline-flex items-center gap-3 rounded-[10px] bg-[#657DA6] px-6 py-[14px] text-sm font-semibold text-white shadow-[0_10px_30px_rgba(101,125,166,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#596F99]"
            >
              Discover NELUME
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-[3px]" />
            </a>
            <NelumeIcon variant="waterRipple" size={26} color={MIST_BLUE} className="opacity-40" />
          </div>
        </motion.div>

        {/* ------------------------------------------------------------- RIGHT */}
        <div
          className="relative mx-auto w-full max-w-[420px] md:mx-0 md:ml-auto md:max-w-none"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <NelumeWatermark
            variant="lotus"
            size={560}
            opacity={0.06}
            color={LOTUS_BLUE}
            className="left-[calc(50%-280px)] top-[calc(50%-280px)]"
            drift
          />

          <div className="relative aspect-[4/5] w-full md:aspect-auto md:h-[590px] md:w-[500px]">
            {/* MAIN image — arch mask, gentle scroll cross-fade */}
            <motion.div
              style={reduceMotion ? undefined : { y: mainImageY, x: mainCursorX }}
              className="absolute inset-0 overflow-hidden rounded-[180px_180px_36px_36px] shadow-[0_24px_70px_rgba(70,62,50,0.12)]"
            >
              {mainImages[0] ? (
                mainImages.map((src, i) =>
                  src ? (
                    <motion.img
                      key={`${src}-${i}`}
                      src={src}
                      alt=""
                      style={{ opacity: mainOpacities[i] }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F2EEE7] to-[#DDB6BD]/40">
                  <NelumeIcon variant="lotus" size={64} color={LOTUS_BLUE} />
                </div>
              )}
            </motion.div>

            {/* SECONDARY image — small, overlapping top-right */}
            <motion.div
              style={reduceMotion ? undefined : { y: secondaryY, x: secondaryCursorX }}
              className="absolute -right-4 -top-8 h-[140px] w-[110px] overflow-hidden rounded-[24px] border-4 border-[#F8F4EE] shadow-[0_18px_45px_rgba(70,62,50,0.12)] md:-right-6 md:h-[240px] md:w-[190px]"
            >
              {secondaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={secondaryImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#F2EEE7]">
                  <NelumeIcon variant="lotusPetal" size={26} color={LOTUS_BLUE} />
                </div>
              )}
            </motion.div>

            {/* DETAIL image — small, overlapping bottom-left, desktop only */}
            <div className="absolute -bottom-10 left-[-2.25rem] hidden h-[160px] w-[230px] overflow-hidden rounded-[24px] border-4 border-[#F8F4EE] shadow-[0_18px_45px_rgba(70,62,50,0.1)] md:block">
              {detailImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={detailImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#FAF4F2]">
                  <NelumeIcon variant="leaf" size={28} color={SAGE} />
                </div>
              )}
            </div>

            {/* water ripple detail, lower-right */}
            <motion.div
              style={{ opacity: rippleOpacity }}
              className="pointer-events-none absolute -bottom-6 -right-10 hidden md:block"
              aria-hidden
            >
              <NelumeIcon variant="waterRipple" size={140} color={LOTUS_BLUE} />
            </motion.div>
          </div>

          {/* scroll progress indicator — only meaningful once images differ */}
          {uniqueImages.length > 1 && (
            <div className="absolute -left-9 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex">
              {[0, 1, 2].map((i) => (
                <span key={i} className="flex flex-col items-center">
                  {i > 0 && <span className="mb-2 h-6 w-px bg-[rgba(52,69,87,0.16)]" aria-hidden />}
                  <span
                    className="text-[11px] font-bold tabular-nums transition-colors duration-300"
                    style={{ color: activeSlide === i ? LOTUS_BLUE : "rgba(52,69,87,0.2)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <Curve variant="arc" className="absolute inset-x-0 -bottom-px text-[#FAF7F1]" />
    </motion.section>
  );
}
