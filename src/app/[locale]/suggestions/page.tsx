import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { SuggestionForm } from "@/components/site/suggestion-form";
import { Reveal } from "@/components/animations";

export default async function SuggestionsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  return (
    <>
      <PageHero
        title={s(settings, "suggestions_hero_title", locale)}
        intro={s(settings, "suggestions_hero_intro", locale)}
        image={s(settings, "suggestions_hero_image") || undefined}
        nextSurface="blush"
      />

      <div className="surface-blush relative overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-200/30 blur-[110px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/15 blur-[100px]" />

        <div className="relative mx-auto w-full max-w-2xl px-4 py-14 md:px-6 md:py-20">
          <Reveal direction="scale">
            <div className="card-glow overflow-hidden rounded-[20px] border border-border bg-white p-7 shadow-sm md:p-9">
              <SuggestionForm
                dict={dict}
                successMessage={s(settings, "suggestions_success_message", locale)}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
