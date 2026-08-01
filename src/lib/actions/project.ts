"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { projectSchema } from "@/lib/validations/project";
import { type ActionResult, toMessage } from "@/lib/action-result";

// ---------- Reads (public) ----------

export async function getProjects(opts?: { onlyPublished?: boolean }) {
  return prisma.project.findMany({
    where: opts?.onlyPublished ? { published: true } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

// ---------- Writes (admin only) ----------

export async function createProject(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = projectSchema.parse(raw);
    await prisma.project.create({
      data: { ...data, coverImage: data.coverImage || null, location: data.location || null },
    });
    revalidatePath("/projects");
    revalidatePath("/dashboard/projects");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: toMessage(e) };
  }
}

export async function updateProject(id: string, raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = projectSchema.parse(raw);
    await prisma.project.update({
      where: { id },
      data: { ...data, coverImage: data.coverImage || null, location: data.location || null },
    });
    revalidatePath("/projects");
    revalidatePath("/dashboard/projects");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: toMessage(e) };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.project.delete({ where: { id } });
    revalidatePath("/projects");
    revalidatePath("/dashboard/projects");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: toMessage(e) };
  }
}
