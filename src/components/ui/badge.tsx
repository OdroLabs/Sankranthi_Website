import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-sage/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-sage",
        className
      )}
    >
      {children}
    </span>
  );
}
