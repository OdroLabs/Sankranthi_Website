import type { FieldDef } from "@/components/admin/crud-form";

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Maps a Prisma record onto the shape CrudForm expects, per the field config. */
export function toFormValues(record: Record<string, unknown>, fields: FieldDef[]) {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const val = record[f.name];
    if (f.type === "checkbox") out[f.name] = Boolean(val);
    else if (val instanceof Date) out[f.name] = toLocalInput(val);
    else if (val === null || val === undefined) out[f.name] = "";
    else out[f.name] = val;
  }
  return out;
}
