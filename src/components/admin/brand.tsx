import { cn } from "@/lib/utils";

/** Bundled assets — used whenever no logo is uploaded in Site Settings. */
export const LOGO_SRC = "/brand/logo.png";
export const MARK_SRC = "/brand/mark.png";

/**
 * Full wordmark. Pass `src` to honour the logo uploaded under
 * Site Settings → General, so the panel always matches the live site.
 */
export function AdminLogo({ src, className }: { src?: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || LOGO_SRC}
      alt="Sankranthi Foundation"
      className={cn("h-9 w-auto max-w-[170px] object-contain object-left", className)}
    />
  );
}

/** Square swirl only. For tight spots such as the sign-in card. */
export function AdminMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={MARK_SRC} alt="" aria-hidden className={cn("h-10 w-10 object-contain", className)} />
  );
}
