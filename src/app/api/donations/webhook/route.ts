import { NextResponse } from "next/server";
import { verifyNotifySignature } from "@/lib/payhere";
import { markDonationStatus } from "@/lib/actions/donation";

export async function POST(req: Request) {
  const form = await req.formData();
  const get = (k: string) => String(form.get(k) ?? "");

  const params = {
    merchant_id: get("merchant_id"),
    order_id: get("order_id"),
    payhere_amount: get("payhere_amount"),
    payhere_currency: get("payhere_currency"),
    status_code: get("status_code"),
    md5sig: get("md5sig"),
  };

  if (!verifyNotifySignature(params)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // PayHere status_code: 2 = success, 0 = pending, -1/-2/-3 = failed/cancelled
  const paid = params.status_code === "2";
  await markDonationStatus(params.order_id, paid ? "PAID" : "FAILED", get("payment_id"));

  return NextResponse.json({ received: true });
}
