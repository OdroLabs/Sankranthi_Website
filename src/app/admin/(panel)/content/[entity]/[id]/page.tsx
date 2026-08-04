import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getEntity } from "@/lib/admin-config";
import { EntityForm } from "@/components/admin/entity-form";

export default async function EditEntityPage({
  params,
}: {
  params: Promise<{ entity: string; id: string }>;
}) {
  const { entity: entitySlug, id: idParam } = await params;
  const entity = getEntity(entitySlug);
  const id = Number(idParam);
  if (!entity || entity.readOnly || isNaN(id)) notFound();

  const record = await (prisma as any)[entity.model].findUnique({ where: { id } });
  if (!record) notFound();

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">Edit {entity.titleSingular}</h1>
      <EntityForm entity={entity} record={JSON.parse(JSON.stringify(record))} />
    </div>
  );
}
