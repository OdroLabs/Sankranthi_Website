import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
try {
  const row = await prisma.setting.findUnique({ where: { key: "about_overview_image" } });
  console.log("ROW:", JSON.stringify(row));
} catch (e) {
  console.log("ERR:", e.message);
}
await prisma.$disconnect();
