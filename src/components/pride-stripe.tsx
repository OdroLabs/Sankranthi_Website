import { cn } from "@/lib/utils";

/**
 * A thin Pride flag band, used as a rule at the top of the page, above the
 * footer and across the admin sidebar.
 *
 * The identity is carried by these rules rather than by colouring large
 * surfaces: people reach a mental health service when they are unwell, so the
 * pages themselves stay calm and high-contrast while the flag stays visible.
 */
export function PrideStripe({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-1 w-full shrink-0 bg-pride-flag", className)} />;
}
