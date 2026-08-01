import Link from "next/link";
import { getServices, deleteService } from "@/lib/actions/service";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Services · Admin" };

type Row = Awaited<ReturnType<typeof getServices>>[number];

export default async function AdminServicesPage() {
  const rows = await getServices();
  const columns: Column[] = [
    { key: "title", header: "Title" },
    { key: "order", header: "Order" },
    { key: "published", header: "Status", format: "badge-published" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Services</h1>
        <Link href="/dashboard/services/new"><Button size="sm">New</Button></Link>
      </div>
      <div className="mt-6">
        <DataTable<Row>
          rows={rows}
          columns={columns}
          editBasePath="/dashboard/services"
          onDelete={deleteService}
        />
      </div>
    </div>
  );
}
