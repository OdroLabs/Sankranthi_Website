"use client";

import { useState } from "react";
import { submitContact } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/animations";
import type { Dictionary } from "@/lib/dictionaries";

const fieldClass =
  "h-12 rounded-xl border-border/70 bg-muted/30 px-4 text-sm shadow-none transition-colors focus-visible:border-primary focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-primary/10";

const labelClass = "text-xs font-bold uppercase tracking-wide text-navy-900/70";

export function ContactForm({
  dict,
  /** Set in Site Settings → Contact Page. Falls back to a generic thank-you. */
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
    <form
      action={async (fd) => {
        const res = await submitContact(fd);
        if (res.ok) setDone(true);
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="c-name" className={labelClass}>
            {dict.common.name} *
          </Label>
          <Input id="c-name" name="name" required className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-email" className={labelClass}>
            {dict.common.email} *
          </Label>
          <Input id="c-email" name="email" type="email" required className={fieldClass} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="c-phone" className={labelClass}>
            {dict.common.phone} <span className="font-medium normal-case text-muted-foreground">({dict.common.optional})</span>
          </Label>
          <Input id="c-phone" name="phone" className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-subject" className={labelClass}>
            {dict.common.subject} <span className="font-medium normal-case text-muted-foreground">({dict.common.optional})</span>
          </Label>
          <Input id="c-subject" name="subject" className={fieldClass} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-message" className={labelClass}>
          {dict.common.message} *
        </Label>
        <Textarea
          id="c-message"
          name="message"
          required
          rows={6}
          className="rounded-xl border-border/70 bg-muted/30 px-4 py-3 text-sm shadow-none transition-colors focus-visible:border-primary focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-primary/10"
        />
      </div>
      <MagneticButton>
        <Button
          type="submit"
          size="lg"
          className="rounded-full bg-primary px-8 font-bold shadow-lg shadow-primary/25 transition-transform duration-300 hover:-translate-y-0.5"
        >
          {dict.common.send}
        </Button>
      </MagneticButton>
    </form>
  );
}
