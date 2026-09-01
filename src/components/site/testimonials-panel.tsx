"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestimonialItem {
  quote: string;
  author: string;
}

const AVATAR_PALETTE = [
  "from-[#ff6b81] to-[#f6a55c]",
  "from-[#8f7bff] to-[#5bcefa]",
  "from-[#4fbfa8] to-[#aeb7ff]",
  "from-[#f2749e] to-[#8f7bff]",
  "from-[#f6a55c] to-[#4fbfa8]",
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

const PAGE_SIZE = 3;

export function TestimonialsPanel({
  eyebrow,
  title,
  items,
}: {
  eyebrow?: string;
  title?: string;
  items: TestimonialItem[];
}) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = useMemo(
    () => items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [items, page]
  );

  if (items.length === 0) return null;

  const go = (delta: number) => {
    setDirection(delta);
    setPage((p) => (p + delta + pageCount) % pageCount);
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-lavender-200 bg-gradient-to-br from-lavender-100 via-white to-blush-100 p-8 shadow-card md:p-12">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lavender-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blush-300/40 blur-3xl" />

      <div className="relative mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          {eyebrow && <p className="mb-2 font-mono text-sm text-primary/70">{eyebrow}</p>}
          {title && (
            <h2 className="text-display-xl font-serif font-medium tracking-tight text-charcoal-900">{title}</h2>
          )}
        </div>
        {pageCount > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonials"
              className="grid h-11 w-11 place-items-center rounded-full border border-lavender-200 bg-white text-charcoal-700 transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonials"
              className="grid h-11 w-11 place-items-center rounded-full border border-lavender-200 bg-white text-charcoal-700 transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={page}
            custom={direction}
            initial={reduceMotion ? undefined : { opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-5 md:grid-cols-3"
          >
            {current.map((item, i) => (
              <div
                key={`${page}-${i}`}
                className="card-glow flex min-h-[15rem] flex-col justify-between rounded-2xl border border-lavender-200 bg-white p-6 shadow-card"
              >
                <Quote className="mb-3 h-5 w-5 text-primary/60" aria-hidden />
                <p className="flex-1 text-base leading-relaxed text-charcoal-800">{item.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white",
                      AVATAR_PALETTE[(page * PAGE_SIZE + i) % AVATAR_PALETTE.length]
                    )}
                  >
                    {initials(item.author)}
                  </span>
                  <p className="text-sm font-bold text-charcoal-900">{item.author}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
