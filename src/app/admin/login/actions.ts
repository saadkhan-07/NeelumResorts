"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn } from "@/auth";

const schema = z.object({
  email: z.string().trim().min(1, "Enter your email").email("That does not look like an email"),
  password: z.string().min(1, "Enter your password"),
});

export type LoginState = { error?: string };

/**
 * Signs the admin in, then sends them wherever they were heading — so a
 * logged-out tap on /admin/rooms comes back to /admin/rooms, not the dashboard.
 *
 * The failure message never says which half was wrong: telling an attacker that
 * an email exists is a free hint.
 */
export async function login(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details" };
  }

  const callbackUrl = String(formData.get("callbackUrl") || "/admin");
  // Only ever return inside this site.
  const redirectTo = callbackUrl.startsWith("/admin") ? callbackUrl : "/admin";

  try {
    await signIn("credentials", { ...parsed.data, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Wrong email or password. Please try again." };
    }
    // signIn throws a redirect on success — let it through.
    throw error;
  }

  return {};
}
