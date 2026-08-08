"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteEntity } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "./toast";

export function DeleteButton({
  slug,
  id,
  /** Where to go afterwards. Omitted on lists, which just refresh in place. */
  redirectTo,
}: {
  slug: string;
  id: number;
  redirectTo?: string;
}) {
  const [deleting, setDeleting] = useState(false);
  const { toast, update } = useToast();
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-destructive hover:text-destructive"
      disabled={deleting}
      onClick={async () => {
        if (!confirm("Delete this item? This cannot be undone.")) return;
        setDeleting(true);
        const toastId = toast({ title: "Deleting…", variant: "loading" });
        try {
          const result = await deleteEntity(slug, id);
          if (result.ok) {
            update(toastId, { title: "Deleted", variant: "success" });
            if (redirectTo) router.push(redirectTo);
            else router.refresh();
          } else {
            update(toastId, {
              title: "Not deleted",
              description: result.error,
              variant: "error",
            });
          }
        } catch {
          update(toastId, {
            title: "Not deleted",
            description: "Could not reach the server. Check your connection and try again.",
            variant: "error",
          });
        } finally {
          setDeleting(false);
        }
      }}
      aria-label="Delete"
    >
      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}
