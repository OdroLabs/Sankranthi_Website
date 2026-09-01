import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-safe:active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[#FF617F] to-[#FF846F] text-white shadow-[0_10px_28px_rgba(255,97,127,0.22)] hover:from-[#ff738e] hover:to-[#ff967f] hover:shadow-[0_12px_32px_rgba(255,97,127,0.28)]",
        secondary:
          "bg-[rgba(255,255,255,0.65)] text-[#202B33] shadow-sm ring-1 ring-[rgba(32,43,51,0.12)] hover:bg-[#FFF0F4]",
        destructive:
          "bg-gradient-to-br from-[#FF6178] to-[#FF826F] text-white shadow-[0_10px_28px_rgba(255,97,127,0.22)] hover:from-[#ff7388] hover:to-[#ff967f]",
        outline:
          "border border-[rgba(32,43,51,0.12)] bg-[rgba(255,255,255,0.65)] text-[#202B33] shadow-sm hover:border-[rgba(255,111,145,0.25)] hover:bg-[#FFF0F4]",
        ghost: "hover:bg-[#FFF0F4] hover:text-[#C94F72]",
        link: "text-[#C94F72] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
