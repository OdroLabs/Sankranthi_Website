"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { eventSchema } from "@/lib/validations/event";
import { type ActionResult, toMessage } from "@/lib/action-result";

export async function getEvents(opts?: { onlyPublished?: boolean }) {
  return prisma.event.findMany({
    where: opts?.onlyPublished ? { published: true } : undefined,
    orderBy: { startsAt: "desc" },
  });
}
export async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({ where: { slug }, include: { gallery: true } });
}
export async function getEventById(id: string) {
  return prisma.event.findUnique({ where: { id } });
}
export async function getUpcomingEvents() {
  return prisma.event.findMany({
    where: { published: true, startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    take: 3,
  });
}

function clean(d: ReturnType<typeof eventSchema.parse>) {
  return {
    ...d,
    coverImage: d.coverImage || null,
    location: d.location || null,
    endsAt: d.endsAt ?? null,
  };
}

export async function createEvent(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.event.create({ data: clean(eventSchema.parse(raw)) });
    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
export async function updateEvent(id: string, raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.event.update({ where: { id }, data: clean(eventSchema.parse(raw)) });
    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.event.delete({ where: { id } });
    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
