import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { buildSocials } from "@/lib/nav";
import { getSettings, s, show } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";
import { TiltCard } from "@/components/site/tilt-card";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
      <span className="block h-0.5 w-8 rounded-full bg-primary" />
      {children}
    </p>
  );
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  const mapEmbed = s(settings, "map_embed");
  const socials = buildSocials(settings);

  // Blank values drop out of the details panel entirely.
  const items = [
    { icon: MapPin, label: dict.contact.address, value: s(settings, "address", locale) },
    { icon: Phone, label: dict.common.phone, value: s(settings, "phone") },
    { icon: Phone, label: dict.common.phone, value: s(settings, "phone2") },
    { icon: Mail, label: dict.common.email, value: s(settings, "email") },
    { icon: Mail, label: dict.common.email, value: s(settings, "email2") },
    { icon: Clock, label: dict.contact.hours, value: s(settings, "office_hours", locale) },
  ].filter((item) => item.value);

  const detailsTitle = s(settings, "contact_details_title", locale);
  const formTitle = s(settings, "contact_form_title", locale);
  const formNote = s(settings, "contact_form_note", locale);
  const successMessage = s(settings, "contact_success_message", locale);

  const showDetails = show(settings, "show_contact_details", items, socials);
  const showForm = show(settings, "show_contact_form");
  const showMap = show(settings, "show_contact_map", mapEmbed);

  return (
    <>
      <PageHero
        title={s(settings, "contact_hero_title", locale)}
        intro={s(settings, "contact_hero_intro", locale)}
        image={s(settings, "contact_hero_image") || undefined}
      />

      {(showDetails || showForm) && (
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#FF6F91]/[0.08] blur-[100px]" />
          <div className="pointer-events-none absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[#83D8B6]/[0.10] blur-[110px]" />

          <div
            className={`relative mx-auto w-full max-w-[1400px] px-4 py-20 md:px-6 md:py-28 ${
              showDetails && showForm ? "grid gap-12 lg:grid-cols-5" : ""
            }`}
          >
            {showDetails && (
              <div id="sec-details" className={showForm ? "lg:col-span-2" : "max-w-xl"}>
                <Eyebrow>Get in Touch</Eyebrow>
                {detailsTitle && (
                  <Reveal direction="left">
                    <h2 className="mb-6 text-display-lg font-extrabold tracking-tight text-navy-900">
                      {detailsTitle}
                    </h2>
                  </Reveal>
                )}
                <Reveal direction="left">
                  <TiltCard>
                    <div className="card-glow overflow-hidden rounded-3xl border border-border bg-white shadow-card transition-shadow duration-300">
                      <StaggerContainer>
                        {items.map((item, i) => (
                          <StaggerItem key={`${item.label}-${i}`}>
                            <div
                              className={`flex items-start gap-4 p-6 ${
                                i !== 0 ? "border-t border-border/70" : ""
                              }`}
                            >
                              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent text-white shadow-glow">
                                <item.icon className="h-5 w-5" />
                              </span>
                              <div>
                                <p className="text-sm font-bold text-navy-900">{item.label}</p>
                                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                                  {item.value}
                                </p>
                              </div>
                            </div>
                          </StaggerItem>
                        ))}
                        {socials.length > 0 && (
                          <StaggerItem>
                            <div className="border-t border-border/70 p-6">
                              <p className="mb-3 text-sm font-bold text-navy-900">{dict.contact.followUs}</p>
                              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                                {socials.map((social) => (
                                  <a
                                    key={social.key}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-primary transition-colors hover:text-accent"
                                  >
                                    {social.label}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </StaggerItem>
                        )}
                      </StaggerContainer>
                    </div>
                  </TiltCard>
                </Reveal>
              </div>
            )}

            {showForm && (
              <Reveal
                direction="right"
                className={showDetails ? "lg:col-span-3" : "mx-auto w-full max-w-2xl"}
              >
                <div className="card-glow rounded-[2rem] border border-border bg-white p-8 shadow-card md:p-10">
                  <Eyebrow>Send a Message</Eyebrow>
                  {formTitle && (
                    <h2 className="mb-2 text-display-lg font-extrabold tracking-tight text-navy-900">
                      {formTitle}
                    </h2>
                  )}
                  {formNote && (
                    <p className="mb-6 whitespace-pre-line leading-relaxed text-muted-foreground">
                      {formNote}
                    </p>
                  )}
                  <ContactForm dict={dict} successMessage={successMessage} />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      )}

      {showMap && (
        <Reveal>
          <div
            id="sec-map"
            className="mx-auto w-full max-w-[1400px] px-4 pb-20 md:px-6 md:pb-28"
          >
            <div className="overflow-hidden rounded-[2rem] border border-border shadow-card">
              <iframe
                src={mapEmbed}
                className="h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map"
              />
            </div>
          </div>
        </Reveal>
      )}
    </>
  );
}
