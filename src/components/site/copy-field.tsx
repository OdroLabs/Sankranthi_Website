"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * One row of a bank detail: label, value, and a copy button. Donors are
 * about to retype this into their own bank's transfer screen — a copy
 * button removes the single most error-prone step in the whole flow
 * (mistyping an account number by hand).
 */
export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable (very old browser, insecure context) —
      // the value is still visible and selectable, so this fails quietly.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <dt className="text-xs font-medium text-[#202B33]/55">{label}</dt>
        <dd className="mt-0.5 truncate text-sm font-bold text-[#202B33]">{value}</dd>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors",
          copied
            ? "border-teal-300 bg-teal-50 text-teal-700"
            : "border-[rgba(32,43,51,0.12)] bg-white text-[#202B33]/70 hover:border-[#FF6F91]/40 hover:text-[#C94F72]"
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
