"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/** A rotating set of two-stop pastel accents so cards read as one family without repeating the same gradient. */
const ACCENTS = [
  { from: "#ff6b81", to: "#f6a55c", tint: "from-blush-100/70" },
  { from: "#8f7bff", to: "#5bcefa", tint: "from-lavender-100/70" },
  { from: "#4fbfa8", to: "#aeb7ff", tint: "from-mint-100/70" },
  { from: "#f6a55c", to: "#f2749e", tint: "from-peach-100/70" },
  { from: "#5bcefa", to: "#8f7bff", tint: "from-sky-100/70" },
  { from: "#f2749e", to: "#ff6b81", tint: "from-blush-200/60" },
];

export function ServiceCard({
  href,
  icon,
  title,
  description,
  readMoreLabel,
  index = 0,
}: {
  href: string;
  icon?: string | null;
  title: string;
  description: string;
  readMoreLabel: string;
  /** Which position this card is in the list — picks a unique rainbow accent per card. Purely visual. */
  index?: number;
}) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <motion.div whileHover="hover" initial="rest" className="group relative h-full">
      <Link
        href={href}
        className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-border bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      >
        <motion.span
          variants={{ rest: { y: 0 }, hover: { y: -8 } }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="flex h-full flex-col"
        >
          {/* Top accent, unique per card, that grows on hover */}
          <span
            className="absolute inset-x-0 top-0 h-1 origin-left scale-x-50 transition-transform duration-300 group-hover:scale-x-100"
            style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
          />
          {/* Soft gradient wash that fades in behind the content */}
          <span
            className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent.tint} via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
          />
          <div className="relative">
            {icon && (
              <motion.span
                variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.08, rotate: -6 } }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-2xl text-2xl ring-1 ring-black/5"
                style={{
                  background: `linear-gradient(135deg, ${accent.from}1a, ${accent.to}22)`,
                }}
              >
                {icon}
              </motion.span>
            )}
            <h3 className="mb-2 text-lg font-bold text-charcoal-900 transition-colors group-hover:text-primary">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            <span
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold"
              style={{ color: accent.from }}
            >
              {readMoreLabel}
              <motion.span
                variants={{ rest: { x: 0 }, hover: { x: 6 } }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="inline-flex"
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </span>
          </div>
        </motion.span>
      </Link>
    </motion.div>
  );
}
