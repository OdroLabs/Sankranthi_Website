import Link from "next/link";
import { getVolunteers, deleteVolunteer } from "@/lib/actions/volunteer";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Volunteers · Admin" };

type Row = Awaited<ReturnType<typeof getVolunteers>>[number];

export default async function AdminVolunteersPage() {
  const rows = await getVolunteers();
  const columns: Column[] = [
    { key: "name", header: "Name" },
    { key: "role", header: "Role" },
    { key: "published", header: "Status", format: "badge-published" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Volunteers</h1>
        <Link href="/dashboard/volunteers/new"><Button size="sm">New</Button></Link>
      </div>
      <div className="mt-6">
        <DataTable<Row>
          rows={rows}
          columns={columns}
          editBasePath="/dashboard/volunteers"
          onDelete={deleteVolunteer}
        />
      </div>
    </div>
  );
}
