"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function ServiceCard({
  href,
  icon,
  title,
  description,
  readMoreLabel,
}: {
  href: string;
  icon?: string | null;
  title: string;
  description: string;
  readMoreLabel: string;
}) {
  return (
    <motion.div whileHover="hover" initial="rest" className="group relative h-full">
      <Link
        href={href}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-white p-7 shadow-card transition-all duration-300 hover:border-brand-200 hover:shadow-card-hover"
      >
        <motion.span
          variants={{ rest: { y: 0 }, hover: { y: -8 } }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="flex h-full flex-col"
        >
          {/* Top accent that grows on hover */}
          <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition-transform duration-300 group-hover:scale-x-100" />
          {/* Soft gradient wash that fades in behind the content */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            {icon && (
              <motion.span
                variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.1, rotate: -6 } }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="mb-5 grid h-[52px] w-[52px] place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-2xl ring-1 ring-brand-100"
              >
                {icon}
              </motion.span>
            )}
            <h3 className="mb-2 text-lg font-bold text-navy-900 transition-colors group-hover:text-primary">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
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
