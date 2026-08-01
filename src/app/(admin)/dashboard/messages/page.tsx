import { getMessages, setMessageHandled, deleteMessage } from "@/lib/actions/contact";
import { AsyncActionButton } from "@/components/admin/async-action-button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Messages · Admin" };

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Contact messages</h1>
      {messages.length === 0 ? (
        <p className="mt-6 text-muted">No messages yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {messages.map((m: (typeof messages)[number]) => (
            <div key={m.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">
                    {m.name} · <span className="text-muted">{m.contact}</span>
                  </p>
                  {m.subject ? <p className="text-sm font-medium text-plum">{m.subject}</p> : null}
                  <p className="mt-1 text-sm text-ink/80">{m.message}</p>
                  <p className="mt-2 text-xs text-muted">{formatDate(m.createdAt)}</p>
                </div>
                {m.handled ? <Badge>Handled</Badge> : <span className="text-xs text-coral">New</span>}
              </div>
              <div className="mt-3 flex gap-2">
                <AsyncActionButton action={setMessageHandled.bind(null, m.id, !m.handled)}>
                  {m.handled ? "Mark as new" : "Mark handled"}
                </AsyncActionButton>
                <AsyncActionButton action={deleteMessage.bind(null, m.id)} variant="danger" confirmText="Delete this message?">
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
