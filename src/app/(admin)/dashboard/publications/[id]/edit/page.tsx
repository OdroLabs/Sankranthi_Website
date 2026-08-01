import { notFound } from "next/navigation";
import { getPublicationById, updatePublication } from "@/lib/actions/publication";
import { CrudForm } from "@/components/admin/crud-form";
import { publicationFields } from "@/config/fields";
import { toFormValues } from "@/lib/form-values";

export const metadata = { title: "Edit · Publications" };

export default async function EditPublicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getPublicationById(id);
  if (!record) notFound();
  const action = updatePublication.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">Edit entry</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm
          fields={publicationFields}
          action={action}
          redirectTo="/dashboard/publications"
          submitLabel="Save changes"
          defaultValues={toFormValues(record as unknown as Record<string, unknown>, publicationFields)}
        />
      </div>
    </div>
  );
}
