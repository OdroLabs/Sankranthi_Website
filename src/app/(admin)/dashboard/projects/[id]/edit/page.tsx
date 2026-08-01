import { notFound } from "next/navigation";
import { getProjectById, updateProject } from "@/lib/actions/project";
import { CrudForm } from "@/components/admin/crud-form";
import { projectFields } from "@/config/fields";

export const metadata = { title: "Edit project · Admin" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  // bind the id so CrudForm can call action(data)
  const action = updateProject.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink">Edit project</h1>
      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <CrudForm
          fields={projectFields}
          action={action}
          redirectTo="/dashboard/projects"
          submitLabel="Save changes"
          defaultValues={{
            title: project.title,
            slug: project.slug,
            summary: project.summary,
            content: project.content,
            location: project.location ?? "",
            coverImage: project.coverImage ?? "",
            published: project.published,
          }}
        />
      </div>
    </div>
  );
}
