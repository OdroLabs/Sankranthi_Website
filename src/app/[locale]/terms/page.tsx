import type { Locale } from "@/lib/i18n";
import { getSettings, s } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { RichText } from "@/components/site/rich-text";

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const settings = await getSettings();

  const title = s(settings, "terms_title", locale);
  const body = s(settings, "terms_body", locale);

  return (
    <>
      <PageHero title={title} nextSurface="ivory" />
      {/*
        Intentionally not wrapped in the site's `.container` utility — a
        legal document reads better in a plain, narrower column than the
        wide grid layout used by the rest of the site.
      */}
      <div className="surface-ivory relative overflow-hidden">
        <section className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
          <RichText value={body} />
        </section>
      </div>
    </>
  );
}
