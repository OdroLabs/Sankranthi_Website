"use client";

import { motion, useReducedMotion } from "framer-motion";
import { NelumeIcon } from "./nelume-watermark";

const EASE = [0.22, 1, 0.36, 1] as const;

export type NelumeService = {
  image?: string;
  label?: string;
};

/**
 * Editorial photo medallions — circular crops, no card chrome, soft hover.
 */
export function NelumeServices({
  services,
  exploreLabel,
}: {
  services: NelumeService[];
  exploreLabel?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto grid max-w-[920px] grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4 sm:gap-x-10">
      {services.map((service, i) => (
        <motion.a
          key={i}
          href="#sec-booking"
          className="group flex flex-col items-center"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
        >
          <div className="relative h-[9rem] w-[7.5rem] overflow-hidden rounded-b-[26px] rounded-t-[60px] ring-1 ring-[#D9CBBB]/55 transition-all duration-500 group-hover:ring-[#708DA4]/45 md:h-[10rem] md:w-[8.5rem] md:rounded-b-[28px] md:rounded-t-[68px]">
            {service.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={service.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#F1ECE3]">
                <NelumeIcon variant="lotus" size={28} color="#708DA4" />
              </div>
            )}
          </div>
          {service.label && (
            <p className="mt-4 font-serif text-[15px] text-[#415A6B] transition-transform duration-300 group-hover:-translate-y-0.5 md:text-base">
              {service.label}
            </p>
          )}
          {exploreLabel && (
            <span className="mt-1 text-[11px] font-medium tracking-wide text-[#708DA4] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {exploreLabel}
            </span>
          )}
        </motion.a>
      ))}
    </div>
  );
}
