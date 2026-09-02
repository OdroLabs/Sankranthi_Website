"use client";

import {
  Users,
  Sparkles,
  Coins,
  Briefcase,
  HeartHandshake,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { NelumeIcon } from "./nelume-watermark";

const EASE = [0.22, 1, 0.36, 1] as const;

const STAGE_ICONS = ["users", "lotus", "coins", "briefcase", "heart"] as const;
type StageIconName = (typeof STAGE_ICONS)[number];
type ImpactStage = { label: string; icon: StageIconName };

function StageIcon({ icon }: { icon: StageIconName }) {
  const className = "h-[18px] w-[18px] text-[#708DA4]";
  if (icon === "users") return <Users className={className} strokeWidth={1.5} />;
  if (icon === "coins") return <Coins className={className} strokeWidth={1.5} />;
  if (icon === "briefcase") return <Briefcase className={className} strokeWidth={1.5} />;
  if (icon === "heart") return <HeartHandshake className={className} strokeWidth={1.5} />;
  if (icon === "lotus") return <NelumeIcon variant="lotus" size={20} color="#708DA4" />;
  return <Sparkles className={className} strokeWidth={1.5} />;
}

/**
 * Horizontal social-impact journey — thin outlined circles, connecting lines,
 * and soft water-ripple ellipses. Stacks vertically on small screens.
 */
export function NelumeImpactFlow({ labels }: { labels: string[] }) {
  const reduceMotion = useReducedMotion();
  const stages: ImpactStage[] = STAGE_ICONS.map((icon, i) => ({
    icon,
    label: labels[i] ?? "",
  }));

  return (
    <div className="w-full">
      {/* Desktop / tablet horizontal */}
      <div className="relative hidden sm:block">
        {/* Baseline connector behind the circles */}
        <motion.div
          className="absolute left-[8%] right-[8%] top-[2.05rem] h-px bg-[#708DA4]/35 md:top-[2.3rem]"
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1, ease: EASE }}
          style={{ transformOrigin: "left center" }}
          aria-hidden
        />

        <div className="relative z-[1] flex items-start justify-between">
          {stages.map((stage, i) => (
            <motion.div
              key={stage.label}
              className="flex w-[5.5rem] flex-col items-center md:w-[6.25rem]"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
            >
              <div className="relative grid h-[4.25rem] w-[4.25rem] place-items-center md:h-[4.75rem] md:w-[4.75rem]">
                <span
                  className="pointer-events-none absolute left-1/2 top-[72%] h-5 w-14 -translate-x-1/2 rounded-[100%] bg-[#708DA4]/12 blur-[0.5px] md:w-16"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute left-1/2 top-[78%] h-3 w-10 -translate-x-1/2 rounded-[100%] bg-[#708DA4]/10 md:w-12"
                  aria-hidden
                />
                <span className="relative grid h-[3.6rem] w-[3.6rem] place-items-center rounded-full border border-[#708DA4]/50 bg-[#F8F5EF]/80 md:h-16 md:w-16">
                  <StageIcon icon={stage.icon} />
                </span>
              </div>
              <span className="mt-3 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.14em] text-[#415A6B] md:text-[11px]">
                {stage.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile vertical journey */}
      <div className="flex flex-col gap-0 sm:hidden">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.label}
            className="relative flex items-center gap-4 py-3"
            initial={reduceMotion ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
          >
            <div className="relative grid h-14 w-14 shrink-0 place-items-center">
              <span className="absolute left-1/2 top-[70%] h-3 w-10 -translate-x-1/2 rounded-[100%] bg-[#708DA4]/12" aria-hidden />
              <span className="relative grid h-12 w-12 place-items-center rounded-full border border-[#708DA4]/45 bg-white/60">
                <StageIcon icon={stage.icon} />
              </span>
              {i < stages.length - 1 && (
                <span className="absolute left-1/2 top-14 h-6 w-px -translate-x-1/2 bg-[#708DA4]/35" aria-hidden />
              )}
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#415A6B]">
              {stage.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
