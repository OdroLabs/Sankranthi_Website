import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { loc, type Locale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { getSettings, s, sList, sPairs } from "@/lib/settings";
import { Reveal } from "@/components/animations";
import type { BookableService } from "@/components/site/booking-form";
import { NelumeBookingServices } from "@/components/site/nelume-booking-services";
import { NelumeHero } from "@/components/site/nelume-hero";
import { NelumeImpactFlow } from "@/components/site/nelume-impact-flow";
import { NelumeStoryCollage } from "@/components/site/nelume-story-collage";
import { NelumeIcon, NelumeWatermark, type NelumeMotif } from "@/components/site/nelume-watermark";

const SERIF = '"Cormorant Garamond", "DM Serif Display", Georgia, serif';
const SANS = "Manrope, Inter, sans-serif";

const C = {
  ivory: "#F8F5EF",
  cream: "#FCFAF6",
  softBlue: "#DDECF5",
  blue: "#2F6590",
  ink: "#34434C",
  strong: "#293845",
  body: "#5F7380",
  beige: "#DFD2C5",
  sage: "#7D8C74",
};

const BTN_PRIMARY =
  "group inline-flex items-center gap-2 rounded-[8px] px-6 py-3 text-[12px] font-semibold text-white shadow-[0_10px_25px_rgba(47,101,144,0.15)] transition-transform duration-300 hover:-translate-y-0.5";
const BTN_SECONDARY =
  "inline-flex items-center gap-2 rounded-[8px] border px-6 py-3 text-[12px] font-semibold text-[#2F5F84] transition-colors duration-300 hover:bg-white/60";

const OBJECTIVE_ACCENTS: { icon: NelumeMotif; color: string }[] = [
  { icon: "lotusPetal", color: C.blue },
  { icon: "leaf", color: C.sage },
];

function splitTitleLines(title: string): string[] {
  return title.split(/\n/).map((line) => line.trim()).filter(Boolean);
}

export default async function BusinessPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const [settings, products] = await Promise.all([
    getSettings(),
    prisma.product.findMany({
      where: { published: true, inStock: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const bookableServices: BookableService[] = products.map((product) => ({
    id: product.id,
    name: loc(product, "name", locale),
    description: loc(product, "description", locale),
    image: product.image || undefined,
    price: product.price
      ? new Intl.NumberFormat(locale === "si" ? "si-LK" : locale === "ta" ? "ta-LK" : "en-LK", {
          maximumFractionDigits: 0,
        }).format(Number(product.price))
      : undefined,
  }));

  const heroTitle = s(settings, "business_hero_title", locale);
  const heroTagline = s(settings, "business_hero_tagline", locale);
  const heroEyebrow = s(settings, "business_hero_eyebrow", locale);
  const heroIntro = s(settings, "business_hero_intro", locale);
  const heroImage = s(settings, "business_hero_image");
  const heroPrimaryLabel = s(settings, "business_hero_primary_label", locale);
  const heroImpactLabel = s(settings, "business_hero_impact_label", locale);

  const aboutTitle = s(settings, "business_about_title", locale);
  const aboutTitleLines = splitTitleLines(aboutTitle.replace(/([.!?])(?=[A-Z])/g, "$1\n"));
  const aboutBody = s(settings, "business_about_body", locale);
  const aboutParagraphs = aboutBody.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const aboutImage = s(settings, "business_about_image");
  const aboutImage2 = s(settings, "business_about_image_2");
  const aboutImage3 = s(settings, "business_about_image_3");

  const impactTitle = s(settings, "business_impact_title", locale);
  const impactBody = s(settings, "business_impact_body", locale);
  const impactFlow = sList(settings, "business_impact_flow", locale);

  const opportunityTitle = s(settings, "business_opportunity_title", locale);
  const opportunityBody = s(settings, "business_opportunity_body", locale);
  const opportunityImage = s(settings, "business_opportunity_image");

  const objectivesTitle = s(settings, "business_objectives_title", locale);
  const objectives = sPairs(settings, "business_objectives", locale);

  const servicesTitle = s(settings, "business_services_title", locale);
  const servicesTitleLines = splitTitleLines(servicesTitle);
  const servicesCtaLabel = s(settings, "business_services_cta_label", locale);

  const showBooking = s(settings, "business_booking_show") !== "false";
  const bookingEyebrow = s(settings, "business_booking_eyebrow", locale);
  const bookingTitle = s(settings, "business_booking_title", locale);
  const bookingBody = s(settings, "business_booking_body", locale);
  const bookingFormTitle = s(settings, "business_booking_form_title", locale);
  const bookingFormIntro = s(settings, "business_booking_form_intro", locale);
  const bookingSubmitLabel = s(settings, "business_booking_submit_label", locale);
  const bookingSuccessTitle = s(settings, "business_booking_success_title", locale);
  const bookingSuccessBody = s(settings, "business_booking_success_body", locale);

  const values = sPairs(settings, "business_values", locale);
  const valueMotifs: NelumeMotif[] = ["lotus", "leaf", "waterRipple"];

  const ctaTitle = s(settings, "business_cta_title", locale);
  const ctaBody = s(settings, "business_cta_body", locale);
  const ctaImage = s(settings, "business_cta_image");
  const ctaPrimaryLabel = s(settings, "business_cta_primary_label", locale);
  const ctaSecondaryLabel = s(settings, "business_cta_secondary_label", locale);

  const showAbout = aboutTitle || aboutParagraphs.length > 0 || aboutImage || aboutImage2 || aboutImage3;
  const showImpact = impactTitle || impactBody || impactFlow.length > 0;
  const showOpportunity = opportunityTitle || opportunityBody || opportunityImage || objectives.length > 0;
  const showServices = bookableServices.length > 0 || servicesTitle || servicesCtaLabel;
  const showValues = values.length > 0;
  const showCta = ctaTitle || ctaBody || ctaPrimaryLabel || ctaSecondaryLabel;

  return (
    <div
      className="overflow-x-hidden"
      style={{ backgroundColor: C.ivory, color: C.ink, fontFamily: SANS }}
    >
      <NelumeHero
        heroTitle={heroTitle}
        heroTagline={heroTagline}
        heroEyebrow={heroEyebrow}
        heroIntro={heroIntro}
        heroImage={heroImage}
        primaryLabel={heroPrimaryLabel}
        impactLabel={heroImpactLabel}
      />

      {/* ============================== STORY — 2-photo collage + copy */}
      {showAbout && (
        <section
          id="sec-story"
          className="relative overflow-hidden"
          style={{ backgroundColor: C.cream }}
        >
          <NelumeWatermark
            variant="lotus"
            size={280}
            opacity={0.07}
            color={C.blue}
            className="right-[4%] top-1/2 hidden -translate-y-1/2 lg:block"
          />
          <div className="relative grid lg:min-h-[360px] lg:grid-cols-[38%_62%]">
            <Reveal direction="right" className="h-full">
              <NelumeStoryCollage image1={aboutImage} image2={aboutImage2} image3={aboutImage3} />
            </Reveal>

            <Reveal direction="left" className="relative flex items-center px-6 py-10 md:px-[5vw] lg:min-h-[360px] lg:py-8">
              <div className="relative z-10 max-w-[510px]">
                {aboutTitleLines.length > 0 && (
                  <h2
                    className="text-[2rem] leading-[1.02] text-[#293845] md:text-[2.7rem]"
                    style={{ fontFamily: SERIF }}
                  >
                    {aboutTitleLines.map((line, i) => {
                      const words = line.split(/\s+/);
                      const emphasis = words.pop();
                      return (
                        <span key={i} className="block">
                          {words.join(" ")}{words.length > 0 && " "}
                          <em className="font-normal text-[#2F6590]">{emphasis}</em>
                        </span>
                      );
                    })}
                  </h2>
                )}
                <div className="mt-5 space-y-3">
                  {aboutParagraphs.map((p, i) => (
                    <p key={i} className="max-w-[32rem] text-[13px] leading-[1.65] text-[#34434C] md:text-[13.5px]">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============================== IMPACT */}
      {showImpact && (
        <section
          id="sec-impact"
          className="relative overflow-hidden py-12 md:py-14"
          style={{ backgroundColor: C.softBlue }}
        >
          <div className="relative mx-auto grid max-w-[1240px] items-center gap-10 px-6 md:px-12 lg:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)] lg:gap-12 lg:px-16">
            <Reveal direction="right">
              {impactTitle && (
                <h2
                  className="text-[1.9rem] leading-[1.15] tracking-tight text-[#3A4F5C] md:text-[2.35rem]"
                  style={{ fontFamily: SERIF }}
                >
                  {splitTitleLines(impactTitle).map((line, i) => (
                    <span key={i} className={`block ${i > 0 ? "italic" : ""}`}>
                      {line}
                    </span>
                  ))}
                </h2>
              )}
              {impactBody && (
                <p className="mt-4 max-w-xs text-[14px] leading-[1.7] text-[#5F7380]">
                  {impactBody}
                </p>
              )}
            </Reveal>
            <Reveal direction="left" delay={60}>
              {impactFlow.length > 0 && <NelumeImpactFlow labels={impactFlow} />}
            </Reveal>
          </div>
        </section>
      )}

      {/* ============================== OPPORTUNITY + OBJECTIVES */}
      {showOpportunity && (
        <section id="sec-opportunity" className="relative scroll-mt-20 bg-[#FAF7F2]">
          <div className="grid lg:min-h-[360px] lg:grid-cols-2">
            <Reveal direction="right" className="grid bg-[#FCFAF6] lg:grid-cols-[55%_45%]">
              <div className="flex items-center px-6 py-10 md:px-[5vw] lg:py-8">
                <div className="max-w-[310px]">
                  {opportunityTitle && (
                    <h2
                      className="text-[2rem] leading-[1.05] text-[#293845] md:text-[2.45rem]"
                      style={{ fontFamily: SERIF }}
                    >
                      {opportunityTitle}
                    </h2>
                  )}
                  {opportunityBody && (
                    <p className="mt-5 text-[13px] leading-[1.7] text-[#34434C] md:text-[13.5px]">
                      {opportunityBody}
                    </p>
                  )}
                </div>
              </div>
              <div className="relative min-h-[300px] overflow-hidden lg:min-h-full">
                {opportunityImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={opportunityImage} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: C.cream }}>
                    <NelumeIcon variant="lotus" size={40} color={C.blue} />
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal direction="left" delay={60} className="flex flex-col justify-center border-t border-[#E7D8CA] px-6 py-10 md:px-[3.5vw] lg:border-l lg:border-t-0 lg:py-7">
              {objectivesTitle && (
                <h2
                  className="mb-5 text-[2rem] leading-none text-[#293845] md:text-[2.4rem]"
                  style={{ fontFamily: SERIF }}
                >
                  {objectivesTitle}
                </h2>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {objectives.map((obj, i) => {
                  const accent = OBJECTIVE_ACCENTS[i % OBJECTIVE_ACCENTS.length];
                  return (
                    <article
                      key={i}
                      className="relative flex h-full min-h-[240px] flex-col rounded-[14px] border border-[#DFCBB9] bg-[#FBF4EC] p-5 md:p-6"
                    >
                      <NelumeIcon
                        variant={accent.icon}
                        size={28}
                        color="#C89B72"
                        className="absolute right-5 top-5 opacity-80"
                      />
                      <span
                        className="block text-[2rem] leading-none text-[#344653]"
                        style={{ fontFamily: SERIF }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="mt-3 max-w-[13rem] text-[1.1rem] leading-[1.08] text-[#293845] md:text-[1.2rem]"
                        style={{ fontFamily: SERIF }}
                      >
                        {obj.left}
                      </h3>
                      {obj.right && (
                        <p className="mt-3 text-[12.5px] leading-[1.55] text-[#34434C] md:text-[13px]">
                          {obj.right}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============================== SERVICES */}
      {showServices && (
        <section id="sec-services" className="relative scroll-mt-20 py-10 md:py-12" style={{ backgroundColor: C.cream }}>
          <div className="mx-auto max-w-[1160px] px-6 text-center md:px-12">
            {servicesTitleLines.length > 0 && (
              <Reveal className="mb-8 md:mb-9">
                <h2
                  className="text-[1.9rem] leading-[1.25] text-[#3A4F5C] md:text-[2.45rem]"
                  style={{ fontFamily: SERIF }}
                >
                  {servicesTitleLines.map((line, i) => (
                    <span key={i} className={`block ${i > 0 ? "italic text-[#415A6B]" : ""}`}>
                      {line}
                    </span>
                  ))}
                </h2>
              </Reveal>
            )}

            <Reveal delay={60}>
              <NelumeBookingServices
                services={bookableServices}
                bookingEnabled={showBooking}
                bookingLabel={servicesCtaLabel}
                bookingEyebrow={bookingEyebrow}
                bookingTitle={bookingTitle}
                bookingBody={bookingBody}
                formTitle={bookingFormTitle}
                formIntro={bookingFormIntro}
                submitLabel={bookingSubmitLabel}
                successTitle={bookingSuccessTitle}
                successBody={bookingSuccessBody}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* ============================== VALUES */}
      {showValues && <section id="sec-values"
        className="border-y py-5"
        style={{ backgroundColor: C.cream, borderColor: "rgba(217,203,187,0.55)" }}
      >
        <div className="mx-auto grid max-w-[880px] gap-8 px-6 sm:grid-cols-3 sm:gap-0 md:px-12">
          {values.map((value, i) => (
            <Reveal
              key={`${value.left}-${i}`}
              delay={i * 50}
              className="flex flex-col items-center gap-1 border-[rgba(217,203,187,0.7)] text-center sm:border-r sm:last:border-r-0"
            >
              <span className="mb-1">
                <NelumeIcon variant={valueMotifs[i % valueMotifs.length]} size={20} color={C.blue} />
              </span>
              <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.28em] text-[#3A4F5C]">
                {value.left}
              </h3>
              {value.right && <p className="text-sm italic text-[#5F7380]" style={{ fontFamily: SERIF }}>
                {value.right}
              </p>}
            </Reveal>
          ))}
        </div>
      </section>}

      {/* ============================== CTA */}
      {showCta && (
        <section className="grid min-h-[220px] bg-[#FCFAF6] lg:grid-cols-[43%_57%]">
          <div className="relative min-h-[220px] overflow-hidden">
            {ctaImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ctaImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#EAF3F8]">
                <NelumeIcon variant="lotus" size={48} color={C.blue} />
              </div>
            )}
          </div>
          <div className="relative flex items-center px-6 py-10 md:px-[6vw]">
            <Reveal>
              {ctaTitle && (
                <h2
                  className="text-[2.1rem] leading-[1.1] text-[#293845] md:text-[2.5rem]"
                  style={{ fontFamily: SERIF }}
                >
                  {ctaTitle}
                </h2>
              )}
              {ctaBody && (
                <p className="mt-3 max-w-md whitespace-pre-line text-[14px] leading-[1.65] text-[#5F7380]">
                  {ctaBody}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {ctaPrimaryLabel && <Link href="#sec-services" className={BTN_PRIMARY} style={{ backgroundColor: C.blue }}>
                  {ctaPrimaryLabel}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>}
                {ctaSecondaryLabel && <Link
                  href={`/${locale}/about`}
                  className={BTN_SECONDARY}
                  style={{ borderColor: "rgba(65,90,107,0.28)" }}
                >
                  {ctaSecondaryLabel}
                </Link>}
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  );
}
