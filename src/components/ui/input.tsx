import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-lg border border-line bg-white px-3 text-ink placeholder:text-muted focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
