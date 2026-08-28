"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Whether the splash should play this browser session at all — read once at
 * mount. This intentionally does NOT write to sessionStorage: writing here
 * (inside a lazy initializer that React can invoke more than once per mount
 * under StrictMode) previously caused the flag to already read "seen" by the
 * time the hide-timer effect's second StrictMode pass ran, which cancelled
 * the first timer and never scheduled a replacement — leaving the splash
 * stuck on screen forever. The write now happens once, in the effect below.
 */
function readShouldShow() {
  try {
    return !sessionStorage.getItem("sf-loaded");
  } catch {
    return false;
  }
}

/**
 * Brief splash shown once per browser session while the first page paints:
 * mark → thin progress line → reveal. Purely decorative — it never blocks
 * hydration or interaction, and is skipped entirely under reduced motion or
 * on repeat visits within the same session.
 */
export function PageLoader() {
  const reduceMotion = useReducedMotion();
  const [shouldShow] = useState(readShouldShow);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion || !shouldShow) return;
    try {
      sessionStorage.setItem("sf-loaded", "1");
    } catch {
      // ignore storage errors (private browsing etc.)
    }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(t);
  }, [reduceMotion, shouldShow]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-[999] grid place-items-center bg-navy-950"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.img
              src="/brand/mark.png"
              alt=""
              aria-hidden
              className="h-12 w-12 object-contain"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
            <span className="h-0.5 w-24 overflow-hidden rounded-full bg-white/15">
              <motion.span
                className="block h-full bg-gradient-to-r from-brand-400 via-accent to-brand-400"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
