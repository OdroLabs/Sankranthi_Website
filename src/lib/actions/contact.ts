"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { contactSchema } from "@/lib/validations/contact";
import { type ActionResult, toMessage } from "@/lib/action-result";

export async function getMessages() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createMessage(raw: unknown): Promise<ActionResult> {
  try {
    const d = contactSchema.parse(raw);
    await prisma.contactMessage.create({
      data: { name: d.name, contact: d.contact, subject: d.subject || null, message: d.message },
    });
    // TODO: send an email notification with Resend here
    revalidatePath("/dashboard/messages");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}

export async function setMessageHandled(id: string, handled: boolean): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.contactMessage.update({ where: { id }, data: { handled } });
    revalidatePath("/dashboard/messages");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/dashboard/messages");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
