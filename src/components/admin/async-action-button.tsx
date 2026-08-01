"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

export function AsyncActionButton({
  action,
  children,
  confirmText,
  variant = "outline",
  size = "sm",
}: {
  action: () => Promise<ActionResult>;
  children: React.ReactNode;
  confirmText?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <Button
      variant={variant}
      size={size}
      disabled={pending}
      onClick={() => {
        if (confirmText && !confirm(confirmText)) return;
        start(async () => {
          const res = await action();
          if (!res.ok) alert(res.error);
          else router.refresh();
        });
      }}
    >
      {children}
    </Button>
  );
}
