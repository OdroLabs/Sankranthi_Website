/**
 * Upserts NELUME settings to match the reference screenshot composition.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Spa massage / wellness — hero right panel */
const HERO =
  "https://static.vecteezy.com/system/resources/thumbnails/053/188/883/small/serene-spa-setting-with-candles-stones-and-a-lotus-flower-free-photo.jpg";
/** Lotus on water — story top */
const ABOUT_1 =
  "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?auto=format&fit=crop&w=1200&q=85";
/** Calm spa treatment room — story bottom */
const ABOUT_2 =
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85";
/** Botanical / hands moment — opportunity */
const OPPORTUNITY =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=85";
const SERVICE_1 =
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=85";
const SERVICE_2 =
  "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=85";
const SERVICE_3 =
  "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=85";
const SERVICE_4 =
  "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=85";
/** Soft candles / spa — faint CTA side atmosphere */
const CTA =
  "https://images.unsplash.com/photo-1600334129128-605f74480c5b?auto=format&fit=crop&w=1200&q=85";

const settings: Record<string, string> = {
  business_hero_title: "NELUME",
  business_hero_tagline: "Beauty, Wellness & Opportunity",
  business_hero_eyebrow: "Sankranthi Foundation – Social Enterprise",
  business_hero_intro:
    "NELUME is a social enterprise established by Sankranthi Foundation that brings together beauty, wellness, inclusion and economic empowerment.",
  business_hero_image: HERO,
  business_about_title: "More than beauty.\nA space for possibility.",
  business_about_body:
    "NELUME is more than a nail care and wellness center.\n\nWe provide professional nail care and wellness services in a calm, welcoming and inclusive environment, while creating dignified employment and skills development opportunities for people from marginalized backgrounds who have traditionally been excluded from formal employment.\n\nNELUME was created in response to the barriers many transgender women and sex workers in particular continue to face in accessing stable employment, professional opportunities and economic independence.",
  business_about_image: ABOUT_1,
  business_about_image_2: ABOUT_2,
  business_about_image_3: "",
  business_impact_title: "Business for\nSocial Impact",
  business_impact_body:
    "Revenue generated through the business will support operations, staff development and business growth, while generating unrestricted income to sustain community programmes.",
  business_impact_flow: "Customers\nNELUME\nRevenue\nEmployment & Skills\nCommunity Impact",
  business_opportunity_title: "Creating space where opportunity can grow.",
  business_opportunity_body:
    "Rather than relying solely on external funding to create change, Sankranthi Foundation is building a sustainable business that can generate both livelihood opportunities and long-term income to support its wider community work.",
  business_opportunity_image: OPPORTUNITY,
  business_objectives_title: "Our Objectives",
  business_objectives:
    "Create Inclusive Employment Opportunities :: To create dignified, safe and sustainable employment and skills-development opportunities for people who have traditionally been excluded from the formal economy, particularly transgender women, enabling greater economic independence and livelihood security.\nGenerate Sustainable Income for Social Impact :: To develop a financially sustainable social enterprise that generates income to support Sankranthi Foundation\u2019s mission, programmes and community activities, while reducing reliance on external donor funding and strengthening the organisation\u2019s long-term sustainability.",
  business_services_title: "Care for every body.\nSpace for every soul.",
  business_service_1_image: SERVICE_1,
  business_service_1_label: "Nail Care",
  business_service_2_image: SERVICE_2,
  business_service_2_label: "Beauty Care",
  business_service_3_image: SERVICE_3,
  business_service_3_label: "Wellness",
  business_service_4_image: SERVICE_4,
  business_service_4_label: "Self Care",
  business_service_explore_label: "Explore →",
  business_services_cta_label: "Discover the NELUME Experience",
  business_booking_show: "true",
  business_booking_eyebrow: "Appointments",
  business_booking_title: "Book your NELUME visit",
  business_booking_body:
    "Choose a published Nail Spa service and tell us your preferred date and time. Our team will contact you to confirm availability.",
  business_booking_form_title: "Request an appointment",
  business_booking_form_intro: "Select a service, date and preferred time.",
  business_booking_submit_label: "Request appointment",
  business_booking_success_title: "Appointment request received",
  business_booking_success_body: "Our NELUME team will call or message you to confirm the time.",
  business_values: "Inclusive :: Always\nRespect :: Always\nCare :: Always",
  business_cta_title: "Step into NELUME.",
  business_cta_body: "A space for beauty, wellness\nand meaningful change.",
  business_cta_image: CTA,
  business_cta_primary_label: "Visit NELUME",
  business_cta_secondary_label: "Learn about Sankranthi Foundation",
};

async function main() {
  const missingOnly = process.argv.includes("--missing-only");
  await prisma.$transaction(
    Object.entries(settings).map(([key, valueEn]) =>
      prisma.setting.upsert({
        where: { key },
        update: missingOnly ? {} : { valueEn },
        create: { key, valueEn },
      })
    )
  );
  console.log(`${missingOnly ? "Added missing" : "Synced"} ${Object.keys(settings).length} NELUME settings.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
