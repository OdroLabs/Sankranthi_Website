import { Landmark, Heart, Sparkles, ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sBool, sList, sPairs } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { DonationForm } from "@/components/site/donation-form";
import { BankDonationForm } from "@/components/site/bank-donation-form";
import { CopyField } from "@/components/site/copy-field";
import { Reveal } from "@/components/animations";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#C94F72]">
      <span className="block h-0.5 w-8 rounded-full bg-[#FF6F91]" />
      {children}
    </p>
  );
}

export default async function DonatePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const { locale } = await params;
  const { cancelled } = await searchParams;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  const bankTitle = s(settings, "donate_bank_title", locale);
  const bankFields = [
    { label: "Account number", value: s(settings, "bank_account_number") },
    { label: "Name of the account", value: s(settings, "bank_account_name") },
    { label: "Swift code", value: s(settings, "bank_swift_code") },
    { label: "Currency", value: s(settings, "bank_currency") },
    { label: "Bank & Branch", value: s(settings, "bank_branch") },
    { label: "Bank Code", value: s(settings, "bank_code") },
    { label: "Branch Code", value: s(settings, "bank_branch_code") },
  ].filter((f) => f.value);
  const bankDetailsExtra = s(settings, "bank_details_extra");
  const note = s(settings, "donate_note", locale);

  const impactTitle = s(settings, "donate_impact_title", locale);
  const impactItems = sPairs(settings, "donate_impact_items", locale);

  const presets = sList(settings, "donate_amounts")
    .map((line) => Number(line.replace(/[^\d.]/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);

  // No payment gateway is configured yet, so the online card defaults off —
  // bank transfer (with the deposit-slip upload below) is the real path
  // until an admin switches this on under Site Settings → Donation Page.
  const showOnline = sBool(settings, "show_donate_online", false);
  const showBank = bankFields.length > 0;
  const showImpact = impactItems.length > 0;

  return (
    <>
      <PageHero
        title={s(settings, "donate_hero_title", locale)}
        intro={s(settings, "donate_intro", locale)}
        image={s(settings, "donate_hero_image") || undefined}
        nextSurface="blush"
      />

      <div className="bg-grain surface-blush relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 -top-20 h-[28rem] w-[28rem] rounded-full bg-[#FF6F91]/[0.10] blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[#83D8B6]/[0.12] blur-[120px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FFD66B]/[0.10] blur-[100px]" />

        <div className="relative container space-y-10 py-14 md:py-20">
          {/* Online payment — off by default until a gateway is configured */}
          {showOnline && (
            <div id="sec-online" className="mx-auto max-w-2xl">
              <Reveal direction="up">
                <div className="card-glow overflow-hidden rounded-[20px] border border-[rgba(32,43,51,0.09)] bg-[#FFFDF9] p-7 shadow-sm md:p-9">
                  <Eyebrow>Give Today</Eyebrow>
                  <div className="mb-7 flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#FF6178] to-[#FF826F] text-white shadow-[0_10px_24px_rgba(255,97,127,0.22)]">
                      <Heart className="h-5 w-5 fill-current" />
                    </span>
                    <h2 className="text-display-lg font-extrabold tracking-tight text-[#202B33]">
                      {dict.donate.donateNow}
                    </h2>
                  </div>

                  {cancelled && (
                    <p className="mb-5 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
                      {dict.donate.cancelledText}
                    </p>
                  )}

                  <DonationForm locale={locale} dict={dict} presets={presets} />

                  {note && (
                    <p className="mt-5 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                      {note}
                    </p>
                  )}
                </div>
              </Reveal>
            </div>
          )}

          {/* Bank transfer — details and the donation form sit side by side,
              so a donor can copy a field with one hand and switch to their
              bank app without losing their place. */}
          {showBank && (
            <div id="sec-bank">
              <div className="mx-auto mb-8 max-w-2xl text-center">
                <h2 className="text-display-lg font-extrabold tracking-tight text-[#202B33]">
                  {bankTitle || "Give by bank transfer"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Transfer using the details below, then tell us about your gift and upload the
                  receipt so our team can confirm it.
                </p>
              </div>

              <div className="grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
                {/* Bank details, with a copy button on every field */}
                <Reveal direction="left">
                  <div className="card-glow sticky top-24 rounded-[20px] border border-[rgba(32,43,51,0.09)] bg-[#FFFDF9] p-6 shadow-sm md:p-7">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFF3ED] text-[#C94F72] ring-1 ring-[rgba(32,43,51,0.07)]">
                        <Landmark className="h-5 w-5" />
                      </span>
                      <h3 className="font-extrabold text-[#202B33]">Bank details</h3>
                    </div>

                    <dl className="divide-y divide-[rgba(32,43,51,0.08)] rounded-2xl bg-[#FFF3ED] px-4">
                      {bankFields.map((f) => (
                        <CopyField key={f.label} label={f.label} value={f.value} />
                      ))}
                    </dl>

                    {bankDetailsExtra && (
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {bankDetailsExtra}
                      </p>
                    )}

                    <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#83D8B6]" />
                      Your donation is recorded as soon as you submit the form. Our team checks
                      the receipt and confirms it from there.
                    </p>
                  </div>
                </Reveal>

                {/* The actual submission: amount, details, receipt upload */}
                <Reveal direction="right" delay={0.08}>
                  <div className="card-glow rounded-[20px] border border-[rgba(32,43,51,0.09)] bg-[#FFFDF9] p-6 shadow-sm md:p-7">
                    <BankDonationForm dict={dict} presets={presets} />
                  </div>
                </Reveal>
              </div>
            </div>
          )}

          {/* Why give — hidden when no points are set in the admin */}
          {showImpact && (
            <div id="sec-impact">
              <Reveal direction="up" delay={0.1}>
                <div className="card-glow relative mx-auto max-w-5xl overflow-hidden rounded-[20px] border border-[rgba(32,43,51,0.07)] bg-[#202B33] p-7 text-[#F8F5F2] shadow-sm md:p-9">
                  <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#FF6F91]/[0.16] blur-3xl" />
                  {impactTitle && (
                    <h3 className="text-lg font-extrabold tracking-tight">{impactTitle}</h3>
                  )}
                  <ul className="mt-5 grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    {impactItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 ring-1 ring-white/20">
                          <Sparkles className="h-4 w-4 text-[#FFD66B]" />
                        </span>
                        <span>
                          <span className="block font-semibold">{item.left}</span>
                          {item.right && (
                            <span className="mt-0.5 block leading-relaxed text-white/75">
                              {item.right}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
