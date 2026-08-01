import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // run only on dashboard routes; keeps public pages fast
  matcher: ["/dashboard/:path*"],
};
