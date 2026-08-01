import { createService } from "@/lib/actions/service";
import { CrudForm } from "@/components/admin/crud-form";
import { serviceFields } from "@/config/fields";

export const metadata = { title: "New · Services" };

export default function NewServicesPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">New entry</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm fields={serviceFields} action={createService} redirectTo="/dashboard/services" submitLabel="Create" />
      </div>
    </div>
  );
}
