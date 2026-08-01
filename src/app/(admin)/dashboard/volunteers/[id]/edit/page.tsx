import { notFound } from "next/navigation";
import { getVolunteerById, updateVolunteer } from "@/lib/actions/volunteer";
import { CrudForm } from "@/components/admin/crud-form";
import { volunteerFields } from "@/config/fields";
import { toFormValues } from "@/lib/form-values";

export const metadata = { title: "Edit · Volunteers" };

export default async function EditVolunteersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getVolunteerById(id);
  if (!record) notFound();
  const action = updateVolunteer.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">Edit entry</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm
          fields={volunteerFields}
          action={action}
          redirectTo="/dashboard/volunteers"
          submitLabel="Save changes"
          defaultValues={toFormValues(record as unknown as Record<string, unknown>, volunteerFields)}
        />
      </div>
    </div>
  );
}
