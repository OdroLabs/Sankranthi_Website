import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { EntityDef } from "@/lib/admin-config";
import { formatDate, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteButton } from "./delete-button";
import { ReadToggle, StatusSelect } from "./inbox-actions";

/** "preferredDate" -> "Preferred date" */
function humanise(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Columns that are shown by the surrounding chrome rather than in the table. */
const HIDDEN = new Set(["id", "read", "status"]);

function looksLikeDate(value: unknown): boolean {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value);
}

/**
 * The full record behind one inbox row.
 *
 * The list clamps long text to two lines, so this is the only place a contact
 * message or a booking's notes can be read in full.
 */
export function RecordView({
  entity,
  record,
}: {
  entity: EntityDef;
  record: Record<string, any>;
}) {
  const labels = new Map(entity.listFields.map((c) => [c.name, c.label]));
  const money = new Set(
    entity.listFields.filter((c) => c.type === "money").map((c) => c.name)
  );

  const rows = Object.entries(record).filter(([key]) => !HIDDEN.has(key));

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{entity.titleSingular}</h1>
          <p className="text-sm text-muted-foreground">{entity.description}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/admin/content/${entity.slug}`}>
            <ArrowLeft className="h-4 w-4" /> Back to {entity.title}
          </Link>
        </Button>
      </div>

      {(entity.inbox?.readFlag || entity.inbox?.statuses) && (
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4 py-4">
            {entity.inbox.readFlag && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {record.read ? "Read" : "Unread"}
                </span>
                <ReadToggle
                  slug={entity.slug}
                  id={record.id}
                  read={Boolean(record.read)}
                />
              </div>
            )}
            {entity.inbox.statuses && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status</span>
                <StatusSelect
                  slug={entity.slug}
                  id={record.id}
                  value={String(record.status ?? entity.inbox.statuses[0].value)}
                  options={entity.inbox.statuses}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="divide-y pt-2">
          {rows.map(([key, value]) => {
            let shown: string;
            if (value == null || value === "") shown = "—";
            else if (money.has(key)) shown = formatMoney(String(value));
            else if (looksLikeDate(value)) shown = formatDate(value);
            else shown = String(value);

            return (
              <div key={key} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
                <p className="text-sm font-medium text-muted-foreground">
                  {labels.get(key) || humanise(key)}
                </p>
                <p className="whitespace-pre-wrap break-words text-sm">{shown}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Finished with this one?</span>
        <DeleteButton
          slug={entity.slug}
          id={record.id}
          redirectTo={`/admin/content/${entity.slug}`}
        />
      </div>
    </div>
  );
}
