import Link from "next/link";
import { getNews, deleteNews } from "@/lib/actions/news";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

export const metadata = { title: "News · Admin" };

type Row = Awaited<ReturnType<typeof getNews>>[number];

export default async function AdminNewsPage() {
  const rows = await getNews();
  const columns: Column[] = [
    { key: "title", header: "Title" },
    { key: "category", header: "Category" },
    { key: "published", header: "Status", format: "badge-published" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">News</h1>
        <Link href="/dashboard/news/new"><Button size="sm">New</Button></Link>
      </div>
      <div className="mt-6">
        <DataTable<Row>
          rows={rows}
          columns={columns}
          editBasePath="/dashboard/news"
          onDelete={deleteNews}
        />
      </div>
    </div>
  );
}
