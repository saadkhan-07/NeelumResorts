"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";
import { requireOwner, type ActionState } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

/**
 * Staff accounts — OWNER only.
 *
 * `requireOwner()` is the whole point of this file: a STAFF account that could
 * add another account could promote itself, and the role would mean nothing.
 */

const createSchema = z.object({
  name: z.string().trim().min(1, "A name is required").max(80),
  email: z.string().trim().toLowerCase().email("That is not a valid email"),
  // Long rather than cryptic: a passphrase the owner can actually dictate over
  // the phone beats eight characters of punctuation they will write on a note.
  password: z.string().min(10, "Use at least 10 characters"),
  role: z.enum(["OWNER", "STAFF"]),
});

export async function createUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireOwner();

  const parsed = createSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") ?? "STAFF",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form" };

  const { password, ...rest } = parsed.data;

  try {
    await prisma.adminUser.create({
      data: { ...rest, passwordHash: await bcrypt.hash(password, 12) },
    });
  } catch (error) {
    return {
      error:
        (error as { code?: string }).code === "P2002"
          ? "Someone already uses that email."
          : "Could not create the account.",
    };
  }

  revalidatePath("/admin/users");
  return { ok: true, message: `${rest.name} can now sign in` };
}

const passwordSchema = z.object({
  id: z.string().min(1),
  password: z.string().min(10, "Use at least 10 characters"),
});

export async function resetPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireOwner();

  const parsed = passwordSchema.safeParse({
    id: formData.get("id"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the password" };

  await prisma.adminUser.update({
    where: { id: parsed.data.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.password, 12) },
  });

  revalidatePath("/admin/users");
  return { ok: true, message: "Password changed" };
}

export async function deleteUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const owner = await requireOwner();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Nothing to delete." };

  // Two locks, because losing access to the admin panel is unrecoverable from
  // inside it: you cannot delete yourself, and you cannot delete the last owner.
  const session = await auth();
  if (session?.user?.id === id) {
    return { error: "You cannot remove your own account." };
  }

  const target = await prisma.adminUser.findUnique({ where: { id }, select: { role: true } });
  if (target?.role === "OWNER") {
    const owners = await prisma.adminUser.count({ where: { role: "OWNER" } });
    if (owners <= 1) return { error: "That is the only owner account — it cannot be removed." };
  }

  await prisma.adminUser.delete({ where: { id } });

  revalidatePath("/admin/users");
  return { ok: true, message: "Account removed" };
}
