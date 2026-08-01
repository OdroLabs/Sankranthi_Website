import { createPublication } from "@/lib/actions/publication";
import { CrudForm } from "@/components/admin/crud-form";
import { publicationFields } from "@/config/fields";

export const metadata = { title: "New · Publications" };

export default function NewPublicationsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">New entry</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm fields={publicationFields} action={createPublication} redirectTo="/dashboard/publications" submitLabel="Create" />
      </div>
    </div>
  );
}
