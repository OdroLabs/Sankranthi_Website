"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { publicationSchema } from "@/lib/validations/publication";
import { type ActionResult, toMessage } from "@/lib/action-result";

export async function getPublications(opts?: { onlyPublished?: boolean }) {
  return prisma.publication.findMany({
    where: opts?.onlyPublished ? { published: true } : undefined,
    orderBy: { publishedAt: "desc" },
  });
}
export async function getPublicationById(id: string) {
  return prisma.publication.findUnique({ where: { id } });
}

function clean(d: ReturnType<typeof publicationSchema.parse>) {
  return {
    ...d,
    coverImage: d.coverImage || null,
    fileUrl: d.fileUrl || null,
    externalUrl: d.externalUrl || null,
  };
}

export async function createPublication(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.publication.create({ data: clean(publicationSchema.parse(raw)) });
    revalidatePath("/publications");
    revalidatePath("/dashboard/publications");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
export async function updatePublication(id: string, raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.publication.update({ where: { id }, data: clean(publicationSchema.parse(raw)) });
    revalidatePath("/publications");
    revalidatePath("/dashboard/publications");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
export async function deletePublication(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.publication.delete({ where: { id } });
    revalidatePath("/publications");
    revalidatePath("/dashboard/publications");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
