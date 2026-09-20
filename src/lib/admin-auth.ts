import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Session guards for server actions.
 *
 * `middleware.ts` protects the /admin *pages*, but a server action is its own
 * endpoint — it can be invoked directly with a crafted POST and never passes
 * through the page. So every mutation calls one of these first. This is not
 * belt-and-braces; without it the middleware is decoration.
 */

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  role: "OWNER" | "STAFF";
};

export async function requireAdmin(): Promise<AdminSession> {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? "Admin",
    role: session.user.role ?? "STAFF",
  };
}

/** Staff accounts are for the day-to-day; adding and removing users is not. */
export async function requireOwner(): Promise<AdminSession> {
  const session = await requireAdmin();
  if (session.role !== "OWNER") {
    throw new Error("Only the owner can do that.");
  }
  return session;
}

/** The shape every server action returns, so forms can render one way. */
export type ActionState = {
  ok?: boolean;
  error?: string;
  message?: string;
};
