"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { suggestionSchema } from "@/lib/validations/suggestion";
import { type ActionResult, toMessage } from "@/lib/action-result";

export async function getSuggestions() {
  return prisma.suggestion.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createSuggestion(raw: unknown): Promise<ActionResult> {
  try {
    const d = suggestionSchema.parse(raw);
    await prisma.suggestion.create({
      data: {
        name: d.name || null,
        contact: d.contact || null,
        category: d.category || null,
        message: d.message,
      },
    });
    revalidatePath("/dashboard/suggestions");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}

export async function setSuggestionReviewed(id: string, reviewed: boolean): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.suggestion.update({ where: { id }, data: { reviewed } });
    revalidatePath("/dashboard/suggestions");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}

export async function deleteSuggestion(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.suggestion.delete({ where: { id } });
    revalidatePath("/dashboard/suggestions");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
