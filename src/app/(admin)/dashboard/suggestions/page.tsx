import { getSuggestions, setSuggestionReviewed, deleteSuggestion } from "@/lib/actions/suggestion";
import { AsyncActionButton } from "@/components/admin/async-action-button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Suggestions · Admin" };

export default async function AdminSuggestionsPage() {
  const suggestions = await getSuggestions();
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Suggestions</h1>
      {suggestions.length === 0 ? (
        <p className="mt-6 text-muted">No suggestions yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {suggestions.map((s: (typeof suggestions)[number]) => (
            <div key={s.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted">
                    {s.category ?? "General"}
                    {s.name ? ` · ${s.name}` : ""}
                    {s.contact ? ` · ${s.contact}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-ink/80">{s.message}</p>
                  <p className="mt-2 text-xs text-muted">{formatDate(s.createdAt)}</p>
                </div>
                {s.reviewed ? <Badge>Reviewed</Badge> : <span className="text-xs text-coral">New</span>}
              </div>
              <div className="mt-3 flex gap-2">
                <AsyncActionButton action={setSuggestionReviewed.bind(null, s.id, !s.reviewed)}>
                  {s.reviewed ? "Mark as new" : "Mark reviewed"}
                </AsyncActionButton>
                <AsyncActionButton action={deleteSuggestion.bind(null, s.id)} variant="danger" confirmText="Delete this suggestion?">
                  Delete
                </AsyncActionButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
