"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const AUTO_ADVANCE_MS = 7000;

export function TestimonialCarousel({
  items,
}: {
  items: { quote: string; author: string }[];
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  const go = (next: number) => {
    setDirection(next > index || (next === 0 && index === items.length - 1) ? 1 : -1);
    setIndex(((next % items.length) + items.length) % items.length);
  };

  useEffect(() => {
    if (items.length < 2 || reduceMotion) return;
    const t = setInterval(() => go(index + 1), AUTO_ADVANCE_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length, reduceMotion]);

  if (items.length === 0) return null;
  const item = items[index];

  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent shadow-lg shadow-accent/20">
        <Quote className="h-6 w-6 text-white" />
      </span>

      <motion.div layout className="relative">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            initial={reduceMotion ? undefined : { opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <blockquote className="mb-4 text-lg leading-relaxed text-foreground/90 md:text-xl">
              “{item.quote}”
            </blockquote>
            <p className="mb-6 text-sm font-bold text-primary">{item.author}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white shadow-sm transition-all hover:border-primary/40 hover:text-primary hover:shadow-md motion-safe:active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5" aria-hidden>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="group/dot p-1"
              >
                <span
                  className={cn(
                    "block h-1.5 overflow-hidden rounded-full bg-border transition-all duration-300",
                    i === index ? "w-8 bg-border" : "w-1.5 group-hover/dot:bg-primary/40"
                  )}
                >
                  {i === index && (
                    <motion.span
                      key={index}
                      className="block h-full rounded-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: reduceMotion ? 0 : AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-white shadow-sm transition-all hover:border-primary/40 hover:text-primary hover:shadow-md motion-safe:active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
