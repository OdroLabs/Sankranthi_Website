import { createNews } from "@/lib/actions/news";
import { CrudForm } from "@/components/admin/crud-form";
import { newsFields } from "@/config/fields";

export const metadata = { title: "New · News" };

export default function NewNewsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">New entry</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm fields={newsFields} action={createNews} redirectTo="/dashboard/news" submitLabel="Create" />
      </div>
    </div>
  );
}
