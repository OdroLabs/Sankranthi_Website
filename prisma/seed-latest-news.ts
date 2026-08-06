import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const items = [
  {
    slug: "mobile-health-clinic-event",
    titleEn: "Mobile health clinic event",
    excerptEn:
      "Free Mobile Health Clinic held in Gampaha — breast cancer & syphilis screenings available",
    contentEn:
      "Free Mobile Health Clinic held in Gampaha — breast cancer & syphilis screenings available",
    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=800&q=80",
    publishedAt: new Date("2026-07-05"),
  },
  {
    slug: "advocacy-meeting-with-partners",
    titleEn: "Advocacy meeting with partners",
    excerptEn:
      "Sankranthi joins IPPF Sex Work Policy Consortium for rights-based advocacy in Sri Lanka",
    contentEn:
      "Sankranthi joins IPPF Sex Work Policy Consortium for rights-based advocacy in Sri Lanka",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    publishedAt: new Date("2026-06-24"),
  },
  {
    slug: "peer-support-group-session",
    titleEn: "Peer support group session",
    excerptEn:
      "New peer support programme launches for trans women sex workers in Colombo",
    contentEn:
      "New peer support programme launches for trans women sex workers in Colombo",
    image:
      "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=800&q=80",
    publishedAt: new Date("2026-06-12"),
  },
];

async function main() {
  for (const item of items) {
    await prisma.news.upsert({
      where: { slug: item.slug },
      update: {
        titleEn: item.titleEn,
        excerptEn: item.excerptEn,
        contentEn: item.contentEn,
        image: item.image,
        publishedAt: item.publishedAt,
        published: true,
      },
      create: { ...item, published: true },
    });
  }
  console.log(`Upserted ${items.length} news items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
