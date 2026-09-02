"use client";

import { motion, useReducedMotion } from "framer-motion";
import { NelumeIcon, NelumeWatermark } from "./nelume-watermark";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reference layout: lotus photo LEFT + quote RIGHT on soft ivory — not a
 * full-bleed cinematic overlay.
 */
export function NelumeMission({
  quote,
  support,
  image,
}: {
  quote: string;
  support?: string;
  image?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#F8F5EF] py-16 md:py-24">
      <NelumeWatermark
        variant="leaf"
        size={260}
        opacity={0.05}
        color="#7D8C74"
        className="-right-8 bottom-0"
        rotation={-12}
      />
      <div className="relative mx-auto grid max-w-[1100px] items-center gap-10 px-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-14 md:px-12">
        <motion.div
          className="relative aspect-[5/4] overflow-hidden rounded-[22px] md:aspect-[4/3]"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#E9F2F6]">
              <NelumeIcon variant="lotus" size={48} color="#708DA4" />
            </div>
          )}
        </motion.div>

        <motion.div
          className="text-center md:text-left"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, delay: 0.08, ease: EASE }}
        >
          <NelumeIcon
            variant="lotus"
            size={24}
            color="#708DA4"
            className="mx-auto mb-5 opacity-70 md:mx-0"
          />
          {quote && (
            <p
              className="whitespace-pre-line text-[1.65rem] leading-[1.35] text-[#415A6B] md:text-[2.15rem]"
              style={{ fontFamily: '"Cormorant Garamond", "DM Serif Display", Georgia, serif' }}
            >
              {quote}
            </p>
          )}
          {support && (
            <p
              className="mx-auto mt-4 max-w-md font-sans text-[14.5px] leading-relaxed text-[#5F7380] md:mx-0"
              style={{ fontFamily: "Manrope, Inter, sans-serif" }}
            >
              {support}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
