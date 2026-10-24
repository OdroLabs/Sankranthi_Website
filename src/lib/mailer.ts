import nodemailer, { type Transporter } from "nodemailer";
import { getSettings, s, sBool, sNum } from "./settings";

/**
 * Sends form-submission notifications over SMTP, configured entirely from
 * Site Settings → General → Email notifications (no env vars, no hardcoded
 * fallback — same "settings as CMS" pattern as the rest of the site).
 *
 * Every public form action (contact, suggestion, booking, newsletter,
 * donation) calls this after saving to the database. Email is always
 * best-effort: the database save is the thing that must never fail, so
 * callers should swallow/log errors from this function rather than let a
 * broken SMTP setup break the form for visitors.
 */

export type MailInput = {
  /** Short admin-facing label for which form this came from, e.g. "Contact form". */
  subject: string;
  /** Plain-text body. */
  text: string;
  /** Optional HTML body. Falls back to the plain text if omitted. */
  html?: string;
  /** Lets the admin hit "Reply" and land in the visitor's own inbox. */
  replyTo?: string;
};

let cached: { key: string; transporter: Transporter } | null = null;

function getTransporter(host: string, port: number, secure: boolean, user: string, pass: string): Transporter {
  const key = `${host}:${port}:${secure}:${user}`;
  if (!cached || cached.key !== key) {
    cached = {
      key,
      transporter: nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      }),
    };
  }
  return cached.transporter;
}

function splitAddresses(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

/**
 * Sends a notification email using the SMTP settings configured in the
 * admin panel. Returns `{ ok: false, skipped: true }` (not an error) when
 * SMTP hasn't been configured yet — this is the normal state for a site
 * that hasn't set it up, and callers should not treat it as a failure.
 */
export async function sendNotificationEmail(
  input: MailInput
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const settings = await getSettings();

  const host = s(settings, "smtp_host");
  const username = s(settings, "smtp_username");
  const password = s(settings, "smtp_password");
  const toRaw = s(settings, "smtp_to_email") || s(settings, "email");

  if (!host || !username || !password || !toRaw) {
    return { ok: false, skipped: true };
  }

  const port = sNum(settings, "smtp_port", 587);
  const secure = sBool(settings, "smtp_secure", port === 465);
  const fromName = s(settings, "smtp_from_name") || s(settings, "site_name") || "Website";
  const fromEmail = s(settings, "smtp_from_email") || username;
  const to = splitAddresses(toRaw);
  const cc = splitAddresses(s(settings, "smtp_cc_email"));

  try {
    const transporter = getTransporter(host, port, secure, username, password);
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      cc: cc.length > 0 ? cc : undefined,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text,
      html: input.html ?? `<pre style="font-family:inherit;white-space:pre-wrap">${escapeHtml(input.text)}</pre>`,
    });
    return { ok: true };
  } catch (err) {
    console.error("SMTP send failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Send failed" };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
