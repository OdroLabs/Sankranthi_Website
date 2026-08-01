import { createSpaService } from "@/lib/actions/spa";
import { CrudForm } from "@/components/admin/crud-form";
import { spaServiceFields } from "@/config/fields";

export const metadata = { title: "New SPA service" };

export default function NewSpaServicePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">New SPA service</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm fields={spaServiceFields} action={createSpaService} redirectTo="/dashboard/spa-services" submitLabel="Create" />
      </div>
    </div>
  );
}
