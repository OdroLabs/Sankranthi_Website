"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { spaServiceSchema } from "@/lib/validations/spaService";
import { bookingSchema } from "@/lib/validations/booking";
import { type ActionResult, toMessage } from "@/lib/action-result";

// ----- SPA services (admin CRUD, public read) -----
export async function getSpaServices(opts?: { onlyActive?: boolean }) {
  return prisma.spaService.findMany({
    where: opts?.onlyActive ? { active: true } : undefined,
    orderBy: { name: "asc" },
  });
}
export async function getSpaServiceById(id: string) {
  return prisma.spaService.findUnique({ where: { id } });
}

export async function createSpaService(raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const d = spaServiceSchema.parse(raw);
    await prisma.spaService.create({
      data: {
        name: d.name,
        description: d.description || null,
        priceCents: Math.round(d.price * 100),
        durationMin: d.durationMin,
        active: d.active,
      },
    });
    revalidatePath("/spa");
    revalidatePath("/dashboard/spa-services");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
export async function updateSpaService(id: string, raw: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const d = spaServiceSchema.parse(raw);
    await prisma.spaService.update({
      where: { id },
      data: {
        name: d.name,
        description: d.description || null,
        priceCents: Math.round(d.price * 100),
        durationMin: d.durationMin,
        active: d.active,
      },
    });
    revalidatePath("/spa");
    revalidatePath("/dashboard/spa-services");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
export async function deleteSpaService(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.spaService.delete({ where: { id } });
    revalidatePath("/spa");
    revalidatePath("/dashboard/spa-services");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}

// ----- Bookings (public create, admin manage) -----
export async function getBookings() {
  return prisma.booking.findMany({
    orderBy: { scheduledAt: "desc" },
    include: { spaService: { select: { name: true } } },
  });
}

export async function createBooking(raw: unknown): Promise<ActionResult> {
  try {
    const d = bookingSchema.parse(raw);
    await prisma.booking.create({
      data: {
        spaServiceId: d.spaServiceId,
        customerName: d.customerName,
        phone: d.phone,
        email: d.email || null,
        scheduledAt: d.scheduledAt,
        notes: d.notes || null,
      },
    });
    revalidatePath("/dashboard/bookings");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}

export async function setBookingStatus(
  id: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.booking.update({ where: { id }, data: { status } });
    revalidatePath("/dashboard/bookings");
    return { ok: true };
  } catch (e) { return { ok: false, error: toMessage(e) }; }
}
