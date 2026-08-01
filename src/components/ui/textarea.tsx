import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-lg border border-line bg-white px-3 py-2 text-ink placeholder:text-muted focus:border-plum focus:outline-none focus:ring-2 focus:ring-plum/20",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
