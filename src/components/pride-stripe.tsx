import { cn } from "@/lib/utils";

/**
 * A thin living-spectrum rule used at the top of the public site and above
 * the footer. Softened on purpose: identity as a brand accent, not a flag
 * pasted across the page.
 */
export function PrideStripe({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("h-[2px] w-full shrink-0 bg-living-spectrum opacity-70", className)}
    />
  );
}
