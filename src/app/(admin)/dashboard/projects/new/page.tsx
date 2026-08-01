import { createProject } from "@/lib/actions/project";
import { CrudForm } from "@/components/admin/crud-form";
import { projectFields } from "@/config/fields";

export const metadata = { title: "New project · Admin" };

export default function NewProjectPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">New project</h1>
      <p className="mt-1 text-sm text-muted">Create a project. Save as draft or publish immediately.</p>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm
          fields={projectFields}
          action={createProject}
          redirectTo="/dashboard/projects"
          submitLabel="Create project"
        />
      </div>
    </div>
  );
}
