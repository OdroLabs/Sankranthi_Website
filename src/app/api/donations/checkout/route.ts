import { NextResponse } from "next/server";
import { createPendingDonation } from "@/lib/actions/donation";
import {
  checkoutHash,
  formatAmount,
  payhereCheckoutUrl,
} from "@/lib/payhere";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const donation = await createPendingDonation(body);

    const amount = formatAmount(donation.amountCents);
    const currency = donation.currency;
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const fields: Record<string, string> = {
      merchant_id: process.env.PAYHERE_MERCHANT_ID ?? "",
      return_url: `${site}/donate/success`,
      cancel_url: `${site}/donate/cancel`,
      notify_url: `${site}/api/donations/webhook`,
      order_id: donation.orderId,
      items: "Donation to Sankranthi Foundation",
      currency,
      amount,
      first_name: donation.donorName ?? "Supporter",
      last_name: "",
      email: donation.email ?? "donor@sankranthi.org",
      phone: "",
      address: "",
      city: "Colombo",
      country: "Sri Lanka",
      hash: checkoutHash(donation.orderId, amount, currency),
    };

    return NextResponse.json({ action: payhereCheckoutUrl(), fields });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
