import { notFound } from "next/navigation";
import { getSpaServiceById, updateSpaService } from "@/lib/actions/spa";
import { CrudForm } from "@/components/admin/crud-form";
import { spaServiceFields } from "@/config/fields";

export const metadata = { title: "Edit SPA service" };

export default async function EditSpaServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getSpaServiceById(id);
  if (!s) notFound();
  const action = updateSpaService.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">Edit SPA service</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm
          fields={spaServiceFields}
          action={action}
          redirectTo="/dashboard/spa-services"
          submitLabel="Save changes"
          defaultValues={{
            name: s.name,
            description: s.description ?? "",
            price: s.priceCents / 100,
            durationMin: s.durationMin,
            active: s.active,
          }}
        />
      </div>
    </div>
  );
}
