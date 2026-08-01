"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations/service";
import { type ActionResult, toMessage } from "@/lib/action-result";

export async function getServices(opts?: { onlyPublished?: boolean }) {
  return prisma.service.findMany({
    where: opts?.onlyPublished ? { published: true } : undefined,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}
export async function getServiceById(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

function clean(d: ReturnType<typeof serviceSchema.parse>) {
  return { ...d, icon: d.icon || null, specialCase: d.specialCase || null };
}

export async function createService(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.service.create({ data: clean(serviceSchema.parse(raw)) });
    revalidatePath("/services");
    revalidatePath("/dashboard/services");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
export async function updateService(id: string, raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.service.update({ where: { id }, data: clean(serviceSchema.parse(raw)) });
    revalidatePath("/services");
    revalidatePath("/dashboard/services");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
export async function deleteService(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.service.delete({ where: { id } });
    revalidatePath("/services");
    revalidatePath("/dashboard/services");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
