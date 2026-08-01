import { ZodError } from "zod";

export type ActionResult = { ok: true } | { ok: false; error: string };

export function toMessage(e: unknown) {
  if (e instanceof ZodError) {
    return e.issues
      .map((i) => {
        const field = i.path.join(".") || "Field";
        const label = field.charAt(0).toUpperCase() + field.slice(1);
        return `${label}: ${i.message}`;
      })
      .join("  •  ");
  }
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}
