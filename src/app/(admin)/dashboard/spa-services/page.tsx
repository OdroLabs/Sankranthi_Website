import Link from "next/link";
import { getSpaServices, deleteSpaService } from "@/lib/actions/spa";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

export const metadata = { title: "SPA services · Admin" };

type Row = Awaited<ReturnType<typeof getSpaServices>>[number];

export default async function AdminSpaServicesPage() {
  const rows = await getSpaServices();
  const columns: Column[] = [
    { key: "name", header: "Service" },
    { key: "priceCents", header: "Price", format: "money" },
    { key: "durationMin", header: "Duration", format: "minutes" },
    { key: "active", header: "Status", format: "badge-active" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">SPA services</h1>
        <Link href="/dashboard/spa-services/new"><Button size="sm">New</Button></Link>
      </div>
      <div className="mt-6">
        <DataTable<Row>
          rows={rows}
          columns={columns}
          editBasePath="/dashboard/spa-services"
          onDelete={deleteSpaService}
        />
      </div>
    </div>
  );
}
