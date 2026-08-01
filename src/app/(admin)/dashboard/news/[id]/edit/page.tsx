import { notFound } from "next/navigation";
import { getNewsById, updateNews } from "@/lib/actions/news";
import { CrudForm } from "@/components/admin/crud-form";
import { newsFields } from "@/config/fields";
import { toFormValues } from "@/lib/form-values";

export const metadata = { title: "Edit · News" };

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await getNewsById(id);
  if (!record) notFound();
  const action = updateNews.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">Edit entry</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm
          fields={newsFields}
          action={action}
          redirectTo="/dashboard/news"
          submitLabel="Save changes"
          defaultValues={toFormValues(record as unknown as Record<string, unknown>, newsFields)}
        />
      </div>
    </div>
  );
}
