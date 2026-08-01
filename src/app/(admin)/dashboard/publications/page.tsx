import Link from "next/link";
import { getPublications, deletePublication } from "@/lib/actions/publication";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Publications · Admin" };

type Row = Awaited<ReturnType<typeof getPublications>>[number];

export default async function AdminPublicationsPage() {
  const rows = await getPublications();
  const columns: Column[] = [
    { key: "title", header: "Title" },
    { key: "kind", header: "Kind" },
    { key: "published", header: "Status", format: "badge-published" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Publications</h1>
        <Link href="/dashboard/publications/new"><Button size="sm">New</Button></Link>
      </div>
      <div className="mt-6">
        <DataTable<Row>
          rows={rows}
          columns={columns}
          editBasePath="/dashboard/publications"
          onDelete={deletePublication}
        />
      </div>
    </div>
  );
}
