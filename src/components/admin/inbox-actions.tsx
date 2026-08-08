"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, MailOpen } from "lucide-react";
import { setRecordRead, setRecordStatus } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "./toast";

/**
 * Read / unread toggle for an enquiry. The dashboard counts unread items, so
 * without this the "New Messages" figure could never come back down.
 */
export function ReadToggle({
  slug,
  id,
  read,
}: {
  slug: string;
  id: number;
  read: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const { toast, update } = useToast();
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={busy}
      title={read ? "Mark as unread" : "Mark as read"}
      aria-label={read ? "Mark as unread" : "Mark as read"}
      onClick={async () => {
        setBusy(true);
        const toastId = toast({ title: "Updating…", variant: "loading" });
        try {
          const result = await setRecordRead(slug, id, !read);
          if (result.ok) {
            update(toastId, {
              title: read ? "Marked as unread" : "Marked as read",
              variant: "success",
            });
            router.refresh();
          } else {
            update(toastId, {
              title: "Not updated",
              description: result.error,
              variant: "error",
            });
          }
        } catch {
          update(toastId, {
            title: "Not updated",
            description: "Could not reach the server. Check your connection and try again.",
            variant: "error",
          });
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : read ? (
        <MailOpen className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Mail className="h-4 w-4 text-primary" />
      )}
    </Button>
  );
}

/** Status dropdown for an enquiry, saved as soon as it changes. */
export function StatusSelect({
  slug,
  id,
  value,
  options,
}: {
  slug: string;
  id: number;
  value: string;
  options: { value: string; label: string }[];
}) {
  const [current, setCurrent] = useState(value);
  const [busy, setBusy] = useState(false);
  const { toast, update } = useToast();
  const router = useRouter();

  return (
    <select
      value={current}
      disabled={busy}
      aria-label="Status"
      className="h-8 rounded-md border border-input bg-background px-2 text-xs shadow-sm disabled:opacity-60"
      onChange={async (e) => {
        const next = e.target.value;
        const previous = current;
        setCurrent(next);
        setBusy(true);
        const toastId = toast({ title: "Updating…", variant: "loading" });
        try {
          const result = await setRecordStatus(slug, id, next);
          if (result.ok) {
            update(toastId, { title: "Status updated", variant: "success" });
            router.refresh();
          } else {
            // Put the dropdown back so it never shows a value that was not saved.
            setCurrent(previous);
            update(toastId, {
              title: "Not updated",
              description: result.error,
              variant: "error",
            });
          }
        } catch {
          setCurrent(previous);
          update(toastId, {
            title: "Not updated",
            description: "Could not reach the server. Check your connection and try again.",
            variant: "error",
          });
        } finally {
          setBusy(false);
        }
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
