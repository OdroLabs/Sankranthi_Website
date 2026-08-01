"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { galleryImageSchema } from "@/lib/validations/galleryImage";
import { type ActionResult, toMessage } from "@/lib/action-result";

export async function getGallery() {
  return prisma.galleryImage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { event: { select: { title: true } } },
  });
}

export async function addGalleryImage(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const d = galleryImageSchema.parse(raw);
    await prisma.galleryImage.create({
      data: {
        url: d.url,
        caption: d.caption || null,
        eventId: d.eventId || null,
        order: d.order,
      },
    });
    revalidatePath("/gallery");
    revalidatePath("/dashboard/gallery");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.galleryImage.delete({ where: { id } });
    revalidatePath("/gallery");
    revalidatePath("/dashboard/gallery");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
