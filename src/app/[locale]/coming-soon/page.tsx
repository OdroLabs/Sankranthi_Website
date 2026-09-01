import { isLocale } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { ComingSoon } from "@/components/site/coming-soon";

/**
 * Always a real, directly-loadable page — the "Coming Soon Mode" preview in
 * Settings points straight here. The site-wide gate lives in
 * `[locale]/layout.tsx`, which swaps every other page's content for the same
 * <ComingSoon> component while the toggle is on and the visitor isn't a
 * signed-in admin.
 */
export default async function ComingSoonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const settings = await getSettings();

  return <ComingSoon locale={locale} settings={settings} />;
}
