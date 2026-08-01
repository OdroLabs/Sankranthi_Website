import { notFound } from "next/navigation";
import { getServiceById, updateService } from "@/lib/actions/service";
import { CrudForm } from "@/components/admin/crud-form";
import { serviceFields } from "@/config/fields";
import { toFormValues } from "@/lib/form-values";

export const metadata = { title: "Edit · Services" };

export default async function EditServicesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getServiceById(id);
  if (!record) notFound();
  const action = updateService.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">Edit entry</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm
          fields={serviceFields}
          action={action}
          redirectTo="/dashboard/services"
          submitLabel="Save changes"
          defaultValues={toFormValues(record as unknown as Record<string, unknown>, serviceFields)}
        />
      </div>
    </div>
  );
}
