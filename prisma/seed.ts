import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ----- Admin -----
  const email = "admin@sankranthi.org";
  const password = await bcrypt.hash("12345", 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: "Sankranthi Admin", email, password, role: "ADMIN" },
  });

  // ----- Services -----
  const services = [
    {
      title: "Mobile Health Clinics",
      slug: "mobile-health-clinics",
      icon: "🏥",
      description:
        "Free medical clinics, STI testing and general check-ups in safe, affirming spaces.",
      order: 1,
    },
    {
      title: "Psychosocial Support",
      slug: "psychosocial-support",
      icon: "🫂",
      description:
        "Peer counselling and mental well-being support led by trained community members.",
      order: 2,
    },
    {
      title: "Legal Assistance",
      slug: "legal-assistance",
      icon: "⚖️",
      description:
        "Guidance on rights, documentation and protection from discrimination.",
      specialCase: "Book via hotline",
      order: 3,
    },
    {
      title: "HIV & Harm Reduction",
      slug: "hiv-harm-reduction",
      icon: "🎗️",
      description:
        "Confidential testing, referrals and harm-reduction resources.",
      order: 4,
    },
  ];
  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  // ----- Projects -----
  const projects = [
    {
      title: "Mobile Health Clinic Programme",
      slug: "mobile-health-clinic",
      summary:
        "Free mobile medical clinics tailored for transgender women across Colombo and Gampaha.",
      content:
        "Our mobile clinics bring free screenings, STI testing and general health check-ups directly to the community in safe, affirming spaces.",
      location: "Colombo & Gampaha",
      published: true,
    },
    {
      title: "Peer Support Network",
      slug: "peer-support-network",
      summary:
        "Community-led peer support connecting trans women and sex workers for mutual aid.",
      content:
        "Trained community members facilitate safe spaces for counselling, wellbeing check-ins and solidarity.",
      location: "Colombo",
      published: true,
    },
  ];
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // ----- Publications -----
  const publications = [
    {
      title: "Community Health Needs Assessment 2025",
      slug: "needs-assessment-2025",
      kind: "Report",
      summary:
        "A survey of health access barriers faced by transgender women in the Western Province.",
      published: true,
    },
    {
      title: "Know Your Rights: A Community Guide",
      slug: "know-your-rights",
      kind: "Publication",
      summary: "A plain-language guide to legal rights and protections.",
      published: true,
    },
  ];
  for (const p of publications) {
    await prisma.publication.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // ----- Volunteers -----
  const volunteers = [
    {
      name: "Community Coordinator",
      role: "Programme Lead",
      bio: "Leads our clinic outreach and peer network.",
      order: 1,
      published: true,
    },
    {
      name: "Peer Supporter",
      role: "Counselling",
      bio: "Provides one-to-one peer counselling.",
      order: 2,
      published: true,
    },
  ];
  for (const v of volunteers) {
    const exists = await prisma.volunteer.findFirst({
      where: { name: v.name },
    });
    if (!exists) await prisma.volunteer.create({ data: v });
  }

  // ----- Events -----
  const events = [
    {
      title: "Free Health Clinic — Colombo",
      slug: "free-health-clinic-colombo",
      description:
        "A free walk-in health clinic with STI testing, general check-ups and counselling.",
      location: "Colombo",
      startsAt: new Date(Date.now() + 14 * 864e5),
      published: true,
    },
  ];
  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: e,
    });
  }

  // ----- News -----
  const news = [
    {
      title: "New mobile clinic route launches in Gampaha",
      slug: "gampaha-clinic-launch",
      excerpt:
        "We are expanding our free mobile clinics to reach more community members in Gampaha.",
      content:
        "This month we launched a new mobile clinic route serving the Gampaha district, bringing free screenings and check-ups closer to the community.",
      category: "Health",
      published: true,
    },
  ];
  for (const n of news) {
    await prisma.newsPost.upsert({
      where: { slug: n.slug },
      update: {},
      create: n,
    });
  }

  // ----- SPA services -----
  await prisma.spaService.createMany({
    data: [
      {
        name: "Classic Manicure",
        priceCents: 250000,
        durationMin: 45,
        description: "A clean, classic manicure.",
      },
      {
        name: "Gel Nail Art",
        priceCents: 450000,
        durationMin: 90,
        description: "Custom gel nail art by our community artists.",
      },
      {
        name: "Pedicure & Foot Care",
        priceCents: 350000,
        durationMin: 60,
        description: "Relaxing pedicure and foot care.",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
