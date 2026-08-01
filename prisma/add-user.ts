import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const name = "Content Editor";
const email = "editor@sankranthi.org";
const plainPassword = "12345";
const role: "ADMIN" | "EDITOR" = "EDITOR";

async function main() {
  const password = await bcrypt.hash(plainPassword, 10);
  await prisma.user.upsert({
    where: { email },
    update: { name, password, role },
    create: { name, email, password, role },
  });
  console.log(`Saved ${role}: ${email} (password: ${plainPassword})`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
