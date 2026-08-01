import { createVolunteer } from "@/lib/actions/volunteer";
import { CrudForm } from "@/components/admin/crud-form";
import { volunteerFields } from "@/config/fields";

export const metadata = { title: "New · Volunteers" };

export default function NewVolunteersPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">New entry</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm fields={volunteerFields} action={createVolunteer} redirectTo="/dashboard/volunteers" submitLabel="Create" />
      </div>
    </div>
  );
}
