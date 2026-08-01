import crypto from "crypto";

const md5 = (s: string) => crypto.createHash("md5").update(s).digest("hex").toUpperCase();

export function payhereMode() {
  return process.env.NEXT_PUBLIC_PAYHERE_MODE === "live" ? "live" : "sandbox";
}

export function payhereCheckoutUrl() {
  return payhereMode() === "live"
    ? "https://www.payhere.lk/pay/checkout"
    : "https://sandbox.payhere.lk/pay/checkout";
}

/** amount must be formatted with 2 decimals and no thousands separators */
export function formatAmount(amountCents: number) {
  return (amountCents / 100).toFixed(2);
}

/** Hash sent with the checkout request (PayHere spec). */
export function checkoutHash(orderId: string, amount: string, currency: string) {
  const merchantId = process.env.PAYHERE_MERCHANT_ID ?? "";
  const secret = process.env.PAYHERE_MERCHANT_SECRET ?? "";
  return md5(merchantId + orderId + amount + currency + md5(secret));
}

/** Verify the md5sig sent by PayHere to the notify URL. */
export function verifyNotifySignature(params: {
  merchant_id: string;
  order_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
  md5sig: string;
}) {
  const secret = process.env.PAYHERE_MERCHANT_SECRET ?? "";
  const local = md5(
    params.merchant_id +
      params.order_id +
      params.payhere_amount +
      params.payhere_currency +
      params.status_code +
      md5(secret)
  );
  return local === params.md5sig?.toUpperCase();
}
