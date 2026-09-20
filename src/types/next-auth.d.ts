import type { DefaultSession } from "next-auth";

/** Adds the admin's role to the session, so screens can gate on OWNER. */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "OWNER" | "STAFF";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "OWNER" | "STAFF";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "OWNER" | "STAFF";
  }
}
