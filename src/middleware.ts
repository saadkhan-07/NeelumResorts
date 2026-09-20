import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Protects everything under /admin except /admin/login.
 *
 * Built from `auth.config.ts` alone — no providers, no Prisma — because this runs
 * on the edge runtime where the database client cannot be bundled.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Everything under /admin, including /admin itself. `authorized()` lets
  // /admin/login through. Static assets and the public site never reach here.
  matcher: ["/admin", "/admin/:path*"],
};
