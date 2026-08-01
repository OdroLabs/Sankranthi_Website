import { notFound } from "next/navigation";
import { getEventById, updateEvent } from "@/lib/actions/event";
import { CrudForm } from "@/components/admin/crud-form";
import { eventFields } from "@/config/fields";
import { toFormValues } from "@/lib/form-values";

export const metadata = { title: "Edit · Events" };

export default async function EditEventsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getEventById(id);
  if (!record) notFound();
  const action = updateEvent.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">Edit entry</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm
          fields={eventFields}
          action={action}
          redirectTo="/dashboard/events"
          submitLabel="Save changes"
          defaultValues={toFormValues(record as unknown as Record<string, unknown>, eventFields)}
        />
      </div>
    </div>
  );
}
