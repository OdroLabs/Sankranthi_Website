import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const COMMUNITY_IMAGE =
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=85";
const HERO_EDITORIAL_IMAGE =
  "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1800&q=88";
const RIGHTS_WELLBEING_IMAGE =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=86";
const OPPORTUNITY_IMAGE =
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=86";
const COMMUNITY_STORY_IMAGE =
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1600&q=86";
const SPA_IMAGE =
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1600&q=85";
const NELUME_HERO =
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=85";
const NELUME_ABOUT_1 =
  "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=1200&q=85";
const NELUME_ABOUT_2 =
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85";
const NELUME_OPPORTUNITY =
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85";
const NELUME_SERVICE_1 =
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=85";
const NELUME_SERVICE_2 =
  "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=85";
const NELUME_SERVICE_3 =
  "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=85";
const NELUME_SERVICE_4 =
  "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=85";
const NELUME_CTA =
  "https://images.unsplash.com/photo-1600334129128-605f74480c5b?auto=format&fit=crop&w=1200&q=85";

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@sf.lk" },
    update: { name: "Sankranthi Admin", role: "owner", active: true },
    create: {
      name: "Sankranthi Admin",
      email: "admin@sf.lk",
      password: await hash("admin12345", 10),
      role: "owner",
    },
  });

  const settings: Record<string, string> = {
    site_name: "Sankranthi Foundation",
    site_short_name: "SF",
    logo_letter: "S",
    logo_image: "/brand/logo.png",
    logo_image_light: "/brand/logo-light.png",
    favicon: "/brand/mark.png",
    site_tagline: "Community-led care, opportunity and dignity across Sri Lanka.",
    seo_title: "Sankranthi Foundation | Stronger communities, brighter futures",
    seo_description: "Sankranthi Foundation connects people with practical support, inclusive community services, research, volunteering and sustainable livelihood opportunities.",
    seo_keywords: "Sankranthi Foundation, Sri Lanka community services, volunteers, community development, Nail Spa",
    seo_allow_indexing: "true",
    show_coming_soon: "false",
    coming_soon_eyebrow: "We're working on something",
    coming_soon_title: "A new site is on its way.",
    coming_soon_text: "We're putting the finishing touches on our new home online. In the meantime, reach out any time — we'd love to hear from you.",
    email: "sankranthifoundationsl@gmail.com",
    email2: "",
    phone: "+94 11 282 3886",
    phone2: "+94 77 011 0489",
    whatsapp: "94771234567",
    office_hours: "Monday to Friday, 8.30 AM – 5.00 PM",
    address: "Colombo, Sri Lanka",
    show_header_topbar: "true",
    show_header_langs: "true",
    show_header_donate: "true",
    show_floating_donate: "false",
    header_donate_label: "Donate",
    announce_text: "Need urgent support? Contact our community response team.",
    announce_link: "/en/contact",
    nav_show_about: "true",
    nav_show_projects: "true",
    nav_show_services: "true",
    nav_show_publications: "true",
    nav_show_news: "true",
    nav_show_events: "true",
    nav_show_business: "true",
    nav_show_suggestions: "true",
    nav_show_contact: "true",
    hero_title: "Empowering\nChange,\nInspiring Hope",
    hero_subtitle: "We listen, connect and act—bringing practical care, safer opportunities and community-led solutions closer to the people who need them.",
    hero_image: HERO_EDITORIAL_IMAGE,
    hero_rights_image: RIGHTS_WELLBEING_IMAGE,
    hero_opportunity_image: OPPORTUNITY_IMAGE,
    hero_community_image: COMMUNITY_STORY_IMAGE,
    hero_dignity_image: COMMUNITY_IMAGE,
    hero_scroll_label: "Scroll to explore",
    hero_cta1_label: "Explore our work",
    hero_cta1_link: "/projects",
    hero_cta2_label: "Contact for support",
    hero_cta2_link: "/contact",
    show_home_about: "true",
    home_about_eyebrow: "Who we are",
    home_about_title: "Progress begins when communities lead",
    home_about_text: "Sankranthi means a meaningful transition. Our foundation works alongside individuals, families and volunteers to turn difficult moments into practical pathways forward. We provide respectful support, create opportunities and strengthen local voices.",
    show_home_stats: "true",
    home_stats_eyebrow: "Our shared impact",
    home_stats_title: "Community effort, visible change",
    show_home_services: "true",
    home_services_eyebrow: "How we help",
    home_services_title: "Support shaped around real life",
    home_services_text: "From urgent special cases to long-term skills and wellbeing, our team connects each person with the right kind of help.",
    home_services_link_label: "View all services",
    home_services_count: "6",
    show_home_projects: "true",
    home_projects_eyebrow: "In action",
    home_projects_title: "Projects built with communities",
    home_projects_text: "Focused initiatives that create safer, healthier and more independent lives.",
    home_projects_link_label: "See all projects",
    home_projects_count: "3",
    show_home_contact: "true",
    home_contact_eyebrow: "Special-case support",
    home_contact_title: "You do not have to navigate a difficult case alone",
    home_contact_text: "Tell us what is happening. Our team will listen confidentially and connect you with the most appropriate service or trusted partner.",
    home_contact_card_title: "Speak with our response team",
    show_home_testimonials: "true",
    home_testimonials_title: "Community voices",
    show_home_news: "true",
    home_news_facebook_label: "Follow us on Facebook",
    show_home_events: "true",
    home_events_title: "Volunteer events",
    home_events_link_label: "Events & gallery",
    home_events_count: "2",
    show_home_partners: "false",
    show_home_donate: "true",
    home_donate_title: "Help create someone’s turning point",
    home_donate_text: "Your contribution supports urgent cases, outreach, skills training and community-led enterprise.",
    home_donate_button: "Donate now",
    home_donate_button2: "Contact our team",
    footer_about: "Community-led care, opportunity and dignity across Sri Lanka.",
    show_footer_newsletter: "false",
    show_footer_social: "true",
    footer_copyright: "Sankranthi Foundation",
    about_hero_title: "About Sankranthi",
    about_hero_intro: "A service-providing community foundation built on listening, dignity and practical action.",
    about_overview_title: "A turning point shaped together",
    about_overview_text: "Sankranthi Foundation is a community-centred organisation helping people move from difficult circumstances toward safety, wellbeing and sustainable opportunity. We work through trusted community relationships, respectful case support, volunteer action and partnerships.",
    projects_hero_title: "Projects",
    projects_hero_intro: "Practical programmes designed with communities and measured by the change they create.",
    services_hero_title: "Our Services",
    services_hero_intro: "Confidential, respectful support for everyday needs and special cases. Contact us and we will guide you to the right service.",
    publications_hero_title: "Research & Publications",
    publications_hero_intro: "Research publications, reports and learning from our community work.",
    events_hero_title: "Volunteers · Events & Gallery",
    events_hero_intro: "See upcoming volunteer opportunities and moments from our work together.",
    show_gallery: "true",
    gallery_title: "Volunteer Gallery",
    business_hero_title: "NELUME",
    business_hero_tagline: "Beauty, Wellness & Opportunity",
    business_hero_eyebrow: "Sankranthi Foundation – Social Enterprise",
    business_hero_intro:
      "NELUME is a social enterprise established by Sankranthi Foundation that brings together beauty, wellness, inclusion and economic empowerment.",
    business_hero_image: NELUME_HERO,
    business_about_title: "More than beauty.\nA space for possibility.",
    business_about_body:
      "NELUME is more than a nail care and wellness center.\n\nWe provide professional nail care and wellness services in a calm, welcoming and inclusive environment, while creating dignified employment and skills development opportunities for people from marginalized backgrounds who have traditionally been excluded from formal employment.\n\nNELUME was created in response to the barriers many transgender women and sex workers in particular continue to face in accessing stable employment, professional opportunities and economic independence.",
    business_about_image: NELUME_ABOUT_1,
    business_about_image_2: NELUME_ABOUT_2,
    business_impact_title: "Business for\nSocial Impact",
    business_impact_body:
      "Revenue generated through the business will support operations, staff development and business growth, while generating unrestricted income to sustain community programmes.",
    business_impact_flow: "Customers\nNELUME\nRevenue\nEmployment & Skills\nCommunity Impact",
    business_opportunity_title: "Creating space where opportunity can grow.",
    business_opportunity_body:
      "Rather than relying solely on external funding to create change, Sankranthi Foundation is building a sustainable business that can generate both livelihood opportunities and long-term income to support its wider community work.",
    business_opportunity_image: NELUME_OPPORTUNITY,
    business_objectives_title: "Our Objectives",
    business_objectives:
      "Create Inclusive Employment Opportunities :: To create dignified, safe and sustainable employment and skills-development opportunities for people who have traditionally been excluded from the formal economy, particularly transgender women, enabling greater economic independence and livelihood security.\nGenerate Sustainable Income for Social Impact :: To develop a financially sustainable social enterprise that generates income to support Sankranthi Foundation\u2019s mission, programmes and community activities, while reducing reliance on external donor funding and strengthening the organisation\u2019s long-term sustainability.",
    business_services_title: "Care for every body.\nSpace for every soul.",
    business_service_1_image: NELUME_SERVICE_1,
    business_service_1_label: "Nail Care",
    business_service_2_image: NELUME_SERVICE_2,
    business_service_2_label: "Beauty Care",
    business_service_3_image: NELUME_SERVICE_3,
    business_service_3_label: "Wellness",
    business_service_4_image: NELUME_SERVICE_4,
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
    business_cta_image: NELUME_CTA,
    business_cta_primary_label: "Visit NELUME",
    business_cta_secondary_label: "Learn about Sankranthi Foundation",
    suggestions_hero_title: "Your Suggestions",
    suggestions_hero_intro: "Good community services begin with listening. Share an idea, concern or improvement with us.",
    privacy_title: "Privacy Policy",
    terms_title: "Terms & Conditions",
    contact_hero_title: "Contact With Us",
    contact_hero_intro: "Reach our team for services, partnerships, volunteering or confidential support with a special case.",
    donate_hero_title: "Make a Donation",
    donate_hero_intro: "Support practical, accountable work led with and for communities.",
  };

  await prisma.$transaction(
    Object.entries(settings).map(([key, valueEn]) =>
      prisma.setting.upsert({
        where: { key },
        update: { valueEn },
        create: { key, valueEn },
      })
    )
  );

  await prisma.$transaction([
    prisma.news.deleteMany(),
    prisma.project.deleteMany(),
    prisma.service.deleteMany(),
    prisma.publication.deleteMany(),
    prisma.event.deleteMany(),
    prisma.galleryImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.partner.deleteMany(),
    prisma.stat.deleteMany(),
  ]);

  await prisma.stat.createMany({ data: [
    { labelEn: "Community members reached", value: "2,500+", order: 1 },
    { labelEn: "Volunteer hours", value: "4,800+", order: 2 },
    { labelEn: "Active projects", value: "8", order: 3 },
    { labelEn: "District partnerships", value: "6", order: 4 },
  ] });

  await prisma.service.createMany({ data: [
    { slug: "special-case-support", titleEn: "Special Case Support", descriptionEn: "A confidential first point of contact for people facing urgent, sensitive or complex situations. We listen, assess needs and coordinate appropriate help.", icon: "handshake", featuresEn: "Confidential first conversation\nNeeds assessment and safety planning\nReferrals to trusted specialist partners\nFollow-up and practical guidance", order: 1 },
    { slug: "community-wellbeing", titleEn: "Community Wellbeing", descriptionEn: "Health awareness, emotional wellbeing activities and trusted referrals that make care easier to reach.", icon: "leaf", order: 2 },
    { slug: "women-livelihoods", titleEn: "Women’s Livelihoods", descriptionEn: "Skills, mentoring and enterprise pathways—including our community Nail Spa—that support sustainable income.", icon: "briefcase", order: 3 },
    { slug: "youth-family-support", titleEn: "Youth & Family Support", descriptionEn: "Practical guidance, learning support and safe connections for young people and families navigating change.", icon: "home", order: 4 },
    { slug: "volunteer-action", titleEn: "Volunteer Action", descriptionEn: "Meaningful ways for individuals and teams to contribute time, skills and care to community-led initiatives.", icon: "users", order: 5 },
    { slug: "research-advocacy", titleEn: "Research & Advocacy", descriptionEn: "Community evidence, publications and constructive advocacy that turn lived experience into better decisions.", icon: "book-open", order: 6 },
  ] });

  await prisma.project.createMany({ data: [
    { slug: "community-response-network", titleEn: "Community Response Network", descriptionEn: "Training local points of contact to identify urgent needs, provide safe first support and connect people with specialist services.", contentEn: "A coordinated community response can prevent difficult situations from becoming crises. This project strengthens trusted local contacts and referral pathways.", status: "ongoing", beneficiariesEn: "Individuals and families facing urgent or sensitive cases", location: "Western Province", order: 1 },
    { slug: "skills-to-independence", titleEn: "Skills to Independence", descriptionEn: "Practical training, mentoring and market access for women building sustainable income and confidence.", contentEn: "Participants combine hands-on vocational skills with financial literacy, customer care and ongoing mentoring. The community Nail Spa is one pathway created through this project.", status: "ongoing", beneficiariesEn: "Women seeking sustainable livelihood opportunities", location: "Colombo", order: 2 },
    { slug: "volunteers-for-wellbeing", titleEn: "Volunteers for Wellbeing", descriptionEn: "Mobilising trained volunteers for outreach, community events, learning activities and wellbeing campaigns.", contentEn: "Volunteers contribute professional skills and local knowledge while following safeguarding and confidentiality standards.", status: "ongoing", beneficiariesEn: "Community groups and families", location: "Multiple districts", order: 3 },
  ] });

  await prisma.product.createMany({ data: [
    { nameEn: "Essential Manicure", descriptionEn: "Nail shaping, cuticle care, hand massage and classic polish.", price: 2500, image: SPA_IMAGE, order: 1 },
    { nameEn: "Gel Manicure", descriptionEn: "Long-lasting gel colour with complete nail preparation and care.", price: 4000, image: SPA_IMAGE, order: 2 },
    { nameEn: "Spa Pedicure", descriptionEn: "A relaxing foot soak, nail care, exfoliation, massage and polish.", price: 4500, image: SPA_IMAGE, order: 3 },
    { nameEn: "Nail Art Session", descriptionEn: "Creative nail art tailored to your colours, event or personal style.", price: 3500, image: SPA_IMAGE, order: 4 },
  ] });

  const future = new Date();
  future.setDate(future.getDate() + 30);
  await prisma.event.create({ data: {
    slug: "community-volunteer-day", titleEn: "Community Volunteer Day",
    descriptionEn: "Join a practical day of neighbourhood outreach, care-pack preparation and community connection.",
    contentEn: "New and returning volunteers are welcome. An orientation and safeguarding briefing will be provided before activities begin.",
    location: "Colombo", startDate: future, published: true,
  } });

  await prisma.testimonial.createMany({ data: [
    { quoteEn: "They listened without judging and helped me understand the next safe step.", authorEn: "Community member", order: 1 },
    { quoteEn: "Volunteering here feels practical. You can see how your time becomes real support.", authorEn: "Sankranthi volunteer", order: 2 },
  ] });

  console.log("Sankranthi Foundation content is ready.");
  console.log("Admin: admin@sf.lk / admin12345");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}).finally(() => prisma.$disconnect());
