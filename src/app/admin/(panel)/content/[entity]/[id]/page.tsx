import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getEntity } from "@/lib/admin-config";
import { EntityForm } from "@/components/admin/entity-form";
import { RecordView } from "@/components/admin/record-view";

export default async function EditEntityPage({
  params,
}: {
  params: Promise<{ entity: string; id: string }>;
}) {
  const { entity: entitySlug, id: idParam } = await params;
  const entity = getEntity(entitySlug);
  const id = Number(idParam);
  if (!entity || isNaN(id)) notFound();

  const record = await (prisma as any)[entity.model].findUnique({ where: { id } });
  if (!record) notFound();

  // Dates and Decimals have to be plain values before they cross into a
  // client component, so the record is serialised either way.
  const plain = JSON.parse(JSON.stringify(record));

  // Inbox records have no editable fields — they are shown, not edited.
  if (entity.readOnly) return <RecordView entity={entity} record={plain} />;

  return (
    <div className="max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">Edit {entity.titleSingular}</h1>
      <EntityForm entity={entity} record={plain} />
    </div>
  );
}
