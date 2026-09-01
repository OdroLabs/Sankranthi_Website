"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { submitSuggestion } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";

const fieldClass =
  "h-12 rounded-xl border-border/70 bg-muted/30 px-4 text-sm shadow-none transition-colors focus-visible:border-primary focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-primary/10";

const labelClass = "text-xs font-bold uppercase tracking-wide text-navy-900/70";

export function SuggestionForm({
  dict,
  /** Set in Site Settings → Other Pages. Falls back to a generic thank-you. */
  successMessage,
}: {
  dict: Dictionary;
  successMessage?: string;
}) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-3xl border border-teal-500/30 bg-teal-50 p-8 text-center">
        <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-teal-600 text-white shadow-glow">
          ✓
        </span>
        <p className="font-semibold text-teal-800">{successMessage || dict.common.thankYou}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-7 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#FF617F] to-[#FF846F] text-white shadow-[0_10px_24px_rgba(255,97,127,0.22)]">
          <MessageSquare className="h-5 w-5" />
        </span>
        <h2 className="text-display-lg font-extrabold tracking-tight text-navy-900">
          {dict.common.submit}
        </h2>
      </div>

      <form
        action={async (fd) => {
          const res = await submitSuggestion(fd);
          if (res.ok) setDone(true);
        }}
        className="space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="s-name" className={labelClass}>
              {dict.common.name}{" "}
              <span className="font-medium normal-case text-muted-foreground">({dict.common.optional})</span>
            </Label>
            <Input id="s-name" name="name" className={fieldClass} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-email" className={labelClass}>
              {dict.common.email}{" "}
              <span className="font-medium normal-case text-muted-foreground">({dict.common.optional})</span>
            </Label>
            <Input id="s-email" name="email" type="email" className={fieldClass} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="s-message" className={labelClass}>
            {dict.common.message} *
          </Label>
          <Textarea
            id="s-message"
            name="message"
            required
            rows={6}
            className="rounded-xl border-border/70 bg-muted/30 px-4 py-3 text-sm shadow-none transition-colors focus-visible:border-primary focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-primary/10"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="rounded-full bg-gradient-to-br from-[#FF617F] to-[#FF846F] px-8 font-bold text-white shadow-[0_10px_28px_rgba(255,97,127,0.22)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          {dict.common.submit}
        </Button>
      </form>
    </>
  );
}
