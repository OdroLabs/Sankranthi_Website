import Link from "next/link";
import { getEvents, deleteEvent } from "@/lib/actions/event";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Events · Admin" };

type Row = Awaited<ReturnType<typeof getEvents>>[number];

export default async function AdminEventsPage() {
  const rows = await getEvents();
  const columns: Column[] = [
    { key: "title", header: "Title" },
    { key: "startsAt", header: "Starts", format: "date" },
    { key: "published", header: "Status", format: "badge-published" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Events</h1>
        <Link href="/dashboard/events/new"><Button size="sm">New</Button></Link>
      </div>
      <div className="mt-6">
        <DataTable<Row>
          rows={rows}
          columns={columns}
          editBasePath="/dashboard/events"
          onDelete={deleteEvent}
        />
      </div>
    </div>
  );
}
