import { createEvent } from "@/lib/actions/event";
import { CrudForm } from "@/components/admin/crud-form";
import { eventFields } from "@/config/fields";

export const metadata = { title: "New · Events" };

export default function NewEventsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">New entry</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm fields={eventFields} action={createEvent} redirectTo="/dashboard/events" submitLabel="Create" />
      </div>
    </div>
  );
}
