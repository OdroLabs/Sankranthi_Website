"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { NelumeIcon } from "./nelume-watermark";

/**
 * Reference collage: two editorial photos side by side with almost no gap.
 */
export function NelumeStoryCollage({
  image1,
  image2,
  image3,
}: {
  image1?: string;
  image2?: string;
  image3?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const secondaryImage = image2 || image3;
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [14, -14]);

  return (
    <motion.div
      ref={ref}
      className="grid h-full min-h-[360px] grid-cols-[44%_56%] gap-[2px] overflow-hidden"
      style={reduceMotion ? undefined : { y }}
    >
      <div className="relative min-h-0 overflow-hidden">
        {image1 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image1} alt="" className="h-full w-full object-cover" />
        ) : (
          <Placeholder />
        )}
      </div>
      <div className="relative min-h-0 overflow-hidden">
        {secondaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={secondaryImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <Placeholder petal />
        )}
      </div>
    </motion.div>
  );
}

function Placeholder({ petal }: { petal?: boolean }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#F1ECE3]">
      <NelumeIcon
        variant={petal ? "lotusPetal" : "lotus"}
        size={36}
        color="#708DA4"
      />
    </div>
  );
}
