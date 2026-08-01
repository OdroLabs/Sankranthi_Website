"use server";
import { prisma } from "@/lib/prisma";
import { requireAdminOnly } from "@/lib/auth";
import { donationSchema } from "@/lib/validations/donation";
import { toMessage } from "@/lib/action-result";

/** Creates a PENDING donation and returns the record so the API route can
 *  hand it to PayHere. Called from /api/donations/checkout. */
export async function createPendingDonation(raw: unknown) {
  const d = donationSchema.parse(raw);
  const orderId = `SF-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const donation = await prisma.donation.create({
    data: {
      donorName: d.donorName || null,
      email: d.email || null,
      amountCents: Math.round(d.amount * 100),
      currency: "LKR",
      message: d.message || null,
      orderId,
    },
  });
  return donation;
}

export async function getDonations() {
  return prisma.donation.findMany({ orderBy: { createdAt: "desc" } });
}

/** Called by the PayHere webhook. Not admin-guarded (webhook is verified by hash). */
export async function markDonationStatus(
  orderId: string,
  status: "PAID" | "FAILED",
  paymentId?: string
) {
  try {
    await prisma.donation.update({
      where: { orderId },
      data: { status, paymentId: paymentId ?? null },
    });
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: toMessage(e) };
  }
}

export async function deleteDonation(id: string) {
  try {
    await requireAdminOnly();
    await prisma.donation.delete({ where: { id } });
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: toMessage(e) };
  }
}
