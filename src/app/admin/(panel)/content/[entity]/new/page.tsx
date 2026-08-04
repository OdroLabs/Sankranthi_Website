import { notFound } from "next/navigation";
import { getEntity } from "@/lib/admin-config";
import { EntityForm } from "@/components/admin/entity-form";

export default async function NewEntityPage({ params }: { params: Promise<{ entity: string }> }) {
  const { entity: entitySlug } = await params;
  const entity = getEntity(entitySlug);
  if (!entity || entity.readOnly) notFound();

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">New {entity.titleSingular}</h1>
      <EntityForm entity={entity} record={null} />
    </div>
  );
}
