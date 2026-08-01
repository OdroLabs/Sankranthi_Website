import Link from "next/link";
import { getProjects, deleteProject } from "@/lib/actions/project";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Projects · Admin" };

type Row = Awaited<ReturnType<typeof getProjects>>[number];

export default async function AdminProjectsPage() {
  const rows = await getProjects();
  const columns: Column[] = [
    { key: "title", header: "Title" },
    { key: "location", header: "Location" },
    { key: "published", header: "Status", format: "badge-published" },
    { key: "createdAt", header: "Created", format: "date" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Projects</h1>
        <Link href="/dashboard/projects/new"><Button size="sm">New</Button></Link>
      </div>
      <div className="mt-6">
        <DataTable<Row>
          rows={rows}
          columns={columns}
          editBasePath="/dashboard/projects"
          onDelete={deleteProject}
        />
      </div>
    </div>
  );
}
