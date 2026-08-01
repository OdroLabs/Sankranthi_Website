"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";
import type { ActionResult } from "@/lib/action-result";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "checkbox";
  placeholder?: string;
  help?: string;
};

export function CrudForm<T extends Record<string, unknown>>({
  fields,
  defaultValues,
  action,
  redirectTo,
  submitLabel = "Save",
}: {
  fields: FieldDef[];
  defaultValues?: Partial<T>;
  action: (data: Record<string, unknown>) => Promise<ActionResult>;
  redirectTo: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({
    ...Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? false : ""])),
    ...defaultValues,
  });

  const hasSlug = fields.some((f) => f.name === "slug");

  function set(name: string, value: unknown) {
    setValues((v) => {
      const next = { ...v, [name]: value };
      // auto-fill slug from the title while the slug hasn't been hand-edited
      if (name === "title" && hasSlug && !v.__slugTouched) {
        next.slug = slugify(String(value));
      }
      if (name === "slug") next.__slugTouched = true;
      return next;
    });
  }

  function submit() {
    setError(null);

    // clean the payload so tiny formatting slips never block a save
    const payload: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(values)) {
      if (k === "__slugTouched") continue;
      payload[k] = typeof val === "string" ? val.trim() : val;
    }
    // a slug can never be invalid: derive it from itself or the title
    if (hasSlug) {
      const raw = String(payload.slug || payload.title || "");
      payload.slug = slugify(raw);
    }

    startTransition(async () => {
      const res = await action(payload);
      if (res.ok) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {fields.map((f) => (
        <div key={f.name}>
          {f.type !== "checkbox" && <Label htmlFor={f.name}>{f.label}</Label>}

          {f.type === "textarea" ? (
            <Textarea
              id={f.name}
              rows={6}
              placeholder={f.placeholder}
              value={String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)}
            />
          ) : f.type === "checkbox" ? (
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                id={f.name}
                type="checkbox"
                className="h-4 w-4 rounded border-line"
                checked={Boolean(values[f.name])}
                onChange={(e) => set(f.name, e.target.checked)}
              />
              {f.label}
            </label>
          ) : (
            <Input
              id={f.name}
              type={f.type === "url" ? "url" : "text"}
              placeholder={f.placeholder}
              value={String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)}
            />
          )}

          {f.help && <p className="mt-1 text-xs text-muted">{f.help}</p>}
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <Button onClick={submit} disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
        <Button variant="ghost" onClick={() => router.push(redirectTo)} disabled={pending}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
