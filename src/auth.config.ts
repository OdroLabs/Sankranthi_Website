import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config: NO Prisma / bcrypt imports here, so it can run in
 * middleware. The Credentials provider (which needs Node APIs) is added
 * in lib/auth.ts.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const onDashboard = request.nextUrl.pathname.startsWith("/dashboard");
      if (onDashboard) return !!auth?.user;
      return true;
    },
    jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
