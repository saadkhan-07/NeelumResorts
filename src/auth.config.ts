import type { NextAuthConfig } from "next-auth";

/**
 * The edge-safe half of the Auth.js config.
 *
 * `middleware.ts` runs on the edge runtime, where Prisma cannot go. So the parts
 * middleware needs — the sign-in page and the `authorized` rule — live here with
 * no providers and no database import, and `auth.ts` adds the Credentials
 * provider on top for the Node runtime. Import Prisma into this file and every
 * request to the site fails at the middleware, not at /admin.
 */
export const authConfig = {
  /**
   * Auth.js refuses to answer a request whose Host header it has not been told
   * to trust, and it only auto-trusts in development. Under `next start` — and
   * on Render — that means every sign-in fails with UntrustedHost and a
   * "problem with the server configuration" page, which names nothing useful.
   *
   * Trusting the host is right here: this app is always served from a host we
   * control, and `NEXTAUTH_URL` pins the canonical origin used to build
   * callback URLs. There is no OAuth provider whose redirect could be pointed
   * somewhere else by a forged header.
   *
   * On Render, also set AUTH_TRUST_HOST=true so the proxy's forwarded host is
   * accepted.
   */
  trustHost: true,

  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    // The owner logs in from a phone in a valley. Thirty days means they are not
    // typing a password again every week on a weak connection.
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    /**
     * Runs for every request matched by the middleware matcher.
     *
     * Returning `false` sends the visitor to `pages.signIn` with a callbackUrl,
     * so a logged-out visit to /admin/rooms lands on the login page and returns
     * to /admin/rooms afterwards.
     */
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/admin/login")) {
        // Already signed in? Don't show the login form again.
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", request.nextUrl));
        }
        return true;
      }

      if (pathname.startsWith("/admin")) return isLoggedIn;

      return true;
    },

    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? "STAFF";
        token.name = user.name;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "OWNER" | "STAFF";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
