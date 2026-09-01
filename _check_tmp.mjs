import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const row = await prisma.setting.findUnique({ where: { key: "about_overview_image" } }).catch(async () => {
  // fallback: try to inspect model name
  return null;
});
console.log(JSON.stringify(row));
await prisma.$disconnect();
