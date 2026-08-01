"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { newsSchema } from "@/lib/validations/news";
import { type ActionResult, toMessage } from "@/lib/action-result";

export async function getNews(opts?: { onlyPublished?: boolean; take?: number }) {
  return prisma.newsPost.findMany({
    where: opts?.onlyPublished ? { published: true } : undefined,
    orderBy: { publishedAt: "desc" },
    take: opts?.take,
  });
}
export async function getNewsBySlug(slug: string) {
  return prisma.newsPost.findUnique({ where: { slug } });
}
export async function getNewsById(id: string) {
  return prisma.newsPost.findUnique({ where: { id } });
}

function clean(d: ReturnType<typeof newsSchema.parse>) {
  return { ...d, coverImage: d.coverImage || null, category: d.category || null };
}

export async function createNews(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.newsPost.create({ data: clean(newsSchema.parse(raw)) });
    revalidatePath("/news");
    revalidatePath("/dashboard/news");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
export async function updateNews(id: string, raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.newsPost.update({ where: { id }, data: clean(newsSchema.parse(raw)) });
    revalidatePath("/news");
    revalidatePath("/dashboard/news");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
export async function deleteNews(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.newsPost.delete({ where: { id } });
    revalidatePath("/news");
    revalidatePath("/dashboard/news");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
