import { MessageCircle } from "lucide-react";

/**
 * Global floating "Chat on WhatsApp" button — same right-hand rail as
 * FloatingDonate, stacked just above it so the two never overlap. Rendered
 * directly in the locale layout for the same reason FloatingDonate is:
 * `position: fixed` needs to resolve against the viewport, outside any
 * GSAP-animated or transformed container.
 */
export function FloatingWhatsapp({ number, message }: { number: string; message?: string }) {
  const digits = number.replace(/[^\d]/g, "");
  const href = `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <div
      className="pointer-events-none fixed right-4 z-[80] md:right-6"
      style={{ bottom: "max(4.75rem, calc(4.5rem + env(safe-area-inset-bottom)))" }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group pointer-events-auto relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.35)] ring-1 ring-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#20bd5a] hover:shadow-[0_14px_32px_rgba(37,211,102,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-safe:active:scale-95"
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366]/40 motion-safe:animate-ping [animation-duration:2.2s]" />
        <MessageCircle className="relative h-6 w-6 fill-white text-white" />
      </a>
    </div>
  );
}
