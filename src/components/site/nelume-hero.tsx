"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NelumeIcon, NelumeWatermark } from "./nelume-watermark";

const EASE = [0.22, 1, 0.36, 1] as const;

export interface NelumeHeroProps {
  locale: string;
  heroTitle: string;
  heroTagline?: string;
  heroEyebrow?: string;
  heroIntro?: string;
  heroImage?: string;
  breadcrumbSection?: string;
  breadcrumbBrand?: string;
  primaryLabel?: string;
  impactLabel?: string;
}

/**
 * Reference-matched hero: ivory copy | organic wave-edge lifestyle photo.
 */
export function NelumeHero({
  locale,
  heroTitle,
  heroTagline,
  heroEyebrow,
  heroIntro,
  heroImage,
  breadcrumbSection,
  breadcrumbBrand,
  primaryLabel,
  impactLabel,
}: NelumeHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => setReady(true), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [-10, 24]
  );

  const animateIn = ready && !reduceMotion;

  const stagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: animateIn ? 0.09 : 0,
        delayChildren: animateIn ? 0.06 : 0,
      },
    },
  };
  const item = {
    hidden: animateIn ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: EASE },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="sec-page-header"
      className="relative isolate overflow-hidden bg-[#F8F5EF] md:min-h-[620px] lg:min-h-[680px] xl:min-h-[720px]"
      style={{ fontFamily: '"Cormorant Garamond", "DM Serif Display", Georgia, serif' }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="nelume-hero-wave" clipPathUnits="objectBoundingBox">
            <path d="M0.27,0 C0.27,0.08 0.20,0.15 0.12,0.22 C0.03,0.31 0.04,0.41 0.12,0.49 C0.20,0.57 0.20,0.66 0.13,0.74 C0.04,0.84 0.03,0.93 0.10,1 L1,1 L1,0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="absolute inset-y-0 right-0 z-0 hidden w-[58%] overflow-hidden md:block md:[clip-path:url(#nelume-hero-wave)]">
        {heroImage ? (
          <motion.img
            src={heroImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-[106%] w-full object-cover object-center"
            style={animateIn ? { y: imageY, scale: 1.025 } : { scale: 1.025 }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#E9F2F6]">
            <NelumeIcon variant="lotus" size={56} color="#708DA4" />
          </div>
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#F8F5EF]/5 via-transparent to-black/[0.04]"
        />
      </div>

      <NelumeWatermark
        variant="lotus"
        size={430}
        opacity={0.035}
        color="#708DA4"
        className="-bottom-28 -left-24 z-[1] hidden md:block"
        drift
      />

      <nav
        aria-label="Breadcrumb"
        className="absolute left-[clamp(2rem,3.5vw,4rem)] top-5 z-20 flex items-center gap-2 font-sans text-[11px] font-medium tracking-wide text-[#536F84]"
        style={{ fontFamily: "Manrope, Inter, sans-serif" }}
      >
        <Link href={`/${locale}`} className="transition-colors hover:text-[#2F6590]">
          Home
        </Link>
        {(breadcrumbSection || breadcrumbBrand) && <span aria-hidden>/</span>}
        {breadcrumbSection && <span>{breadcrumbSection}</span>}
        {breadcrumbSection && breadcrumbBrand && <span aria-hidden>/</span>}
        {breadcrumbBrand && <span aria-current="page" className="text-[#708DA4]">{breadcrumbBrand}</span>}
      </nav>

      <div className="relative z-10 flex items-center px-6 pb-14 pt-24 md:min-h-[620px] md:px-[7vw] md:pb-16 lg:min-h-[680px] xl:min-h-[720px]">
        <motion.div
          className="relative z-20 w-full max-w-[520px]"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {heroEyebrow && (
            <motion.p
              variants={item}
              className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-[#2F6590]"
              style={{ fontFamily: "Manrope, Inter, sans-serif" }}
            >
              {heroEyebrow}
            </motion.p>
          )}

          {heroTitle && (
            <motion.h1
              variants={item}
              className="text-[3.5rem] font-normal leading-[0.88] tracking-[0.1em] text-[#2F5F84] sm:text-[4.2rem] md:text-[4.8rem] lg:text-[5.3rem] xl:text-[5.8rem]"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
            >
              {heroTitle}
            </motion.h1>
          )}

          {heroTagline && (
            <motion.p variants={item} className="mt-3 text-[1.45rem] leading-[1.1] text-[#2F5F84] lg:text-[1.75rem]">
              {heroTagline}
            </motion.p>
          )}

          {heroIntro && (
            <motion.p
              variants={item}
              className="mt-7 max-w-[31rem] font-sans text-[15px] leading-[1.75] text-[#33434D]"
              style={{ fontFamily: "Manrope, Inter, sans-serif" }}
            >
              {heroIntro}
            </motion.p>
          )}

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-5"
            style={{ fontFamily: "Manrope, Inter, sans-serif" }}
          >
            {primaryLabel && (
              <a
                href="#sec-story"
                className="group inline-flex min-w-[180px] items-center justify-between rounded-[8px] bg-[#2F6590] px-6 py-3 text-[12px] font-semibold text-white shadow-[0_10px_25px_rgba(47,101,144,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#275879]"
              >
                {primaryLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
            {impactLabel && (
              <a
                href="#sec-services"
                className="inline-flex min-w-[170px] items-center justify-center rounded-[8px] border border-[#2F5F84]/40 bg-[#F8F5EF]/70 px-6 py-3 text-[12px] font-semibold text-[#2F5F84] backdrop-blur-sm transition-all duration-300 hover:bg-white"
              >
                {impactLabel}
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 h-[420px] overflow-hidden md:hidden">
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImage} alt="" className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#E9F2F6]">
            <NelumeIcon variant="lotus" size={52} color="#708DA4" />
          </div>
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#F8F5EF] to-transparent"
        />
      </div>
    </section>
  );
}
