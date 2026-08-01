"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatMoney } from "@/lib/utils";
import type { ActionResult } from "@/lib/action-result";

/**
 * Columns are plain, serializable config (no functions), so this client
 * component can be used from server components. The `format` tag tells the
 * table how to render each cell.
 */
export type Column = {
  key: string;
  header: string;
  format?: "text" | "date" | "money" | "minutes" | "badge-published" | "badge-active";
};

function Cell({ value, format }: { value: unknown; format?: Column["format"] }) {
  switch (format) {
    case "date":
      return <>{value ? formatDate(value as string | Date) : "—"}</>;
    case "money":
      return <>{formatMoney(Number(value))}</>;
    case "minutes":
      return <>{Number(value)} min</>;
    case "badge-published":
      return value ? <Badge>Published</Badge> : <span className="text-xs text-muted">Draft</span>;
    case "badge-active":
      return value ? <Badge>Active</Badge> : <span className="text-xs text-muted">Hidden</span>;
    default:
      return <>{value === null || value === undefined || value === "" ? "—" : String(value)}</>;
  }
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  editBasePath,
  onDelete,
}: {
  columns: Column[];
  rows: T[];
  editBasePath?: string;
  onDelete?: (id: string) => Promise<ActionResult>;
}) {
  const [pending, startTransition] = useTransition();

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line p-10 text-center text-muted">
        Nothing here yet. Use “New” to create your first entry.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-card/50 text-xs uppercase tracking-wide text-muted">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-semibold">{c.header}</th>
            ))}
            {(editBasePath || onDelete) && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line last:border-0 hover:bg-card/40">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-ink">
                  <Cell value={(row as Record<string, unknown>)[c.key]} format={c.format} />
                </td>
              ))}
              {(editBasePath || onDelete) && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {editBasePath && (
                      <Link href={`${editBasePath}/${row.id}/edit`}>
                        <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button>
                      </Link>
                    )}
                    {onDelete && (
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={pending}
                        onClick={() => {
                          if (!confirm("Delete this entry? This cannot be undone.")) return;
                          startTransition(async () => {
                            const res = await onDelete(row.id);
                            if (!res.ok) alert(res.error);
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
