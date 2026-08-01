import { getBookings, setBookingStatus } from "@/lib/actions/spa";
import { AsyncActionButton } from "@/components/admin/async-action-button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "SPA bookings · Admin" };

const statusColor: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-sage/15 text-sage",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-plum/10 text-plum",
};

export default async function AdminBookingsPage() {
  const bookings = await getBookings();
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">SPA bookings</h1>
      {bookings.length === 0 ? (
        <p className="mt-6 text-muted">No bookings yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {bookings.map((b: (typeof bookings)[number]) => (
            <div key={b.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">
                    {b.customerName} · <span className="text-muted">{b.spaService.name}</span>
                  </p>
                  <p className="text-sm text-muted">
                    {formatDate(b.scheduledAt)} · {b.phone}
                    {b.email ? ` · ${b.email}` : ""}
                  </p>
                  {b.notes ? <p className="mt-1 text-sm text-ink/70">{b.notes}</p> : null}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[b.status]}`}>
                  {b.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <AsyncActionButton action={setBookingStatus.bind(null, b.id, "CONFIRMED")}>Confirm</AsyncActionButton>
                <AsyncActionButton action={setBookingStatus.bind(null, b.id, "COMPLETED")}>Completed</AsyncActionButton>
                <AsyncActionButton action={setBookingStatus.bind(null, b.id, "CANCELLED")} variant="danger">Cancel</AsyncActionButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
