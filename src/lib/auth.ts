import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (creds) => {
        const email = creds?.email as string | undefined;
        const password = creds?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
});

/** Any signed-in staff member (ADMIN or EDITOR). Used by content actions. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized. Please sign in.");
  return session.user;
}

/** ADMIN role only. Used for donations and user management. */
export async function requireAdminOnly() {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user) throw new Error("Unauthorized. Please sign in.");
  if (user.role !== "ADMIN") throw new Error("This action is restricted to administrators.");
  return user;
}

/** Returns the current user's role, or null if signed out. */
export async function getRole(): Promise<"ADMIN" | "EDITOR" | null> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === "ADMIN" || role === "EDITOR" ? role : null;
}
