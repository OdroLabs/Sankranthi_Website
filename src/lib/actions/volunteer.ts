"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { volunteerSchema } from "@/lib/validations/volunteer";
import { type ActionResult, toMessage } from "@/lib/action-result";

export async function getVolunteers(opts?: { onlyPublished?: boolean }) {
  return prisma.volunteer.findMany({
    where: opts?.onlyPublished ? { published: true } : undefined,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}
export async function getVolunteerById(id: string) {
  return prisma.volunteer.findUnique({ where: { id } });
}

function clean(d: ReturnType<typeof volunteerSchema.parse>) {
  return { ...d, role: d.role || null, photo: d.photo || null, bio: d.bio || null };
}

export async function createVolunteer(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.volunteer.create({ data: clean(volunteerSchema.parse(raw)) });
    revalidatePath("/volunteers");
    revalidatePath("/dashboard/volunteers");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
export async function updateVolunteer(id: string, raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.volunteer.update({ where: { id }, data: clean(volunteerSchema.parse(raw)) });
    revalidatePath("/volunteers");
    revalidatePath("/dashboard/volunteers");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
export async function deleteVolunteer(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.volunteer.delete({ where: { id } });
    revalidatePath("/volunteers");
    revalidatePath("/dashboard/volunteers");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
