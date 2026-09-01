import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { buildNav } from "@/lib/nav";
import { getSettings, s, sBool } from "@/lib/settings";
import { getAdmin } from "@/lib/session";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { ComingSoon } from "@/components/site/coming-soon";
import { ScrollFX } from "@/components/site/scroll-fx";
import { LenisProvider } from "@/components/site/lenis-provider";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { FloatingDonate } from "@/components/site/floating-donate";
import { PrideStripe } from "@/components/pride-stripe";

export const dynamic = "force-dynamic";

/** Page title, description, favicon and share image all come from the admin. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const settings = await getSettings();

  const siteName = s(settings, "site_name", locale);
  const title = s(settings, "seo_title", locale) || siteName;
  const description =
    s(settings, "seo_description", locale) || s(settings, "site_tagline", locale);
  const keywords = s(settings, "seo_keywords");
  const favicon = s(settings, "favicon");
  const ogImage = s(settings, "og_image");

  // Coming Soon mode implies noindex regardless of the toggle below — no
  // point letting search engines index a holding page — but the explicit
  // "Allow search engines to index this site" switch always applies too.
  const allowIndexing =
    sBool(settings, "seo_allow_indexing", true) && !sBool(settings, "show_coming_soon", false);

  return {
    title: title || undefined,
    description: description || undefined,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    icons: favicon ? { icon: favicon } : undefined,
    robots: allowIndexing
      ? undefined
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      title: title || undefined,
      description: description || undefined,
      siteName: siteName || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const settings = await getSettings();

  /**
   * Coming Soon mode (Settings → Coming Soon Mode) replaces the entire site
   * with a single holding page for anyone who isn't a signed-in admin.
   * Signed-in admins keep seeing the real site everywhere (including the
   * admin's own section-preview iframe, which carries the same session
   * cookie), so the toggle can always be reached and reversed from /admin.
   * The /coming-soon route itself renders unconditionally, independent of
   * this gate, so it's always previewable from Settings.
   */
  if (sBool(settings, "show_coming_soon", false) && !(await getAdmin())) {
    return <ComingSoon locale={locale} settings={settings} />;
  }

  const dict = getLabels(locale, settings);
  const nav = buildNav(settings, dict);

  const siteName = s(settings, "site_name", locale);
  const shortName = s(settings, "site_short_name");
  const logoImage = s(settings, "logo_image");
  const logoLetter = s(settings, "logo_letter");
  const donateLabel = s(settings, "header_donate_label", locale);

  return (
    <div className="flex min-h-screen flex-col">
      <LenisProvider />
      <ScrollFX />
      <ScrollProgress />
      <PrideStripe />
      <SiteHeader
        locale={locale}
        dict={dict}
        nav={nav}
        siteName={siteName}
        shortName={shortName}
        logoImage={logoImage || undefined}
        logoLetter={logoLetter}
        phones={[s(settings, "phone"), s(settings, "phone2")].filter(Boolean)}
        emails={[s(settings, "email"), s(settings, "email2")].filter(Boolean)}
        donateLabel={donateLabel}
        announceText={s(settings, "announce_text", locale) || undefined}
        announceLink={s(settings, "announce_link") || undefined}
        showTopbar={sBool(settings, "show_header_topbar", true)}
        showLangs={sBool(settings, "show_header_langs", true)}
        showDonate={sBool(settings, "show_header_donate", true)}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} dict={dict} settings={settings} />
      {/* Fixed CTA — kept outside <main> and any transformed/animated parent */}
      {sBool(settings, "show_floating_donate", true) && (
        <FloatingDonate locale={locale} label={dict.donate.donateNow} />
      )}
    </div>
  );
}
