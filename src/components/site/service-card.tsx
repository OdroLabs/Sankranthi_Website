"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/** One or two spectrum accents per card, with a contextual warm tint — never a rainbow wash. */
const ACCENTS = [
  { from: "#FF6F91", to: "#FF716D", tint: "#FFF0F4", hoverBorder: "rgba(255,111,145,0.25)" },
  { from: "#83D8B6", to: "#83CDED", tint: "#EFF9F4", hoverBorder: "rgba(131,216,182,0.35)" },
  { from: "#FF9B69", to: "#FFD66B", tint: "#FFF8DD", hoverBorder: "rgba(255,155,105,0.28)" },
  { from: "#A995E8", to: "#83CDED", tint: "#F5F1FF", hoverBorder: "rgba(169,149,232,0.28)" },
  { from: "#FF716D", to: "#FF9B69", tint: "#FFF3ED", hoverBorder: "rgba(255,113,109,0.25)" },
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
        className="relative flex h-full flex-col overflow-hidden rounded-[28px] p-7 transition-all duration-300 hover:-translate-y-[5px]"
        style={{
          backgroundColor: accent.tint,
          border: "1px solid rgba(32,43,51,0.07)",
          boxShadow: "0 15px 45px rgba(31,41,51,0.06)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = accent.hoverBorder;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(32,43,51,0.07)";
        }}
      >
        <motion.span
          variants={{ rest: { y: 0 }, hover: { y: -8 } }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="flex h-full flex-col"
        >
          <span
            className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-50 opacity-70 transition-transform duration-300 group-hover:scale-x-100 group-hover:opacity-100"
            style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
          />
          <div className="relative">
            {icon && (
              <motion.span
                variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.08, rotate: -6 } }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-2xl text-2xl ring-1 ring-[rgba(32,43,51,0.06)]"
                style={{
                  background: `linear-gradient(135deg, ${accent.from}22, ${accent.to}18)`,
                  color: accent.from,
                }}
              >
                {icon}
              </motion.span>
            )}
            <h3 className="mb-2 text-lg font-bold text-[#202B33] transition-colors group-hover:text-[#C94F72]">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-[#667078]">{description}</p>
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
